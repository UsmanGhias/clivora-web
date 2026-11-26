import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { verifyStripeWebhookSignature } from "@/lib/stripe-webhook";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_ENABLED = process.env.STRIPE_ENABLED === "true";

async function resolveProfileByUserOrEmail(
  admin: SupabaseClient,
  userId: string | null,
  email: string | null,
): Promise<{ id: string; email: string | null } | null> {
  if (userId) {
    const { data, error } = await admin
      .from("profiles")
      .select("id, email")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data?.id) return { id: String(data.id), email: data.email ? String(data.email) : email };
  }
  if (email) {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await admin
      .from("profiles")
      .select("id, email")
      .eq("email", cleanEmail)
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data?.id) return { id: String(data.id), email: data.email ? String(data.email) : cleanEmail };
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!STRIPE_ENABLED || !STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  if (!verifyStripeWebhookSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Missing or invalid stripe-signature" }, { status: 400 });
  }

  let event: { id: string; type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload JSON" }, { status: 400 });
  }

  let adminCfg: { url: string; serviceRoleKey: string };
  try {
    adminCfg = requireAdminServiceConfig();
  } catch {
    return NextResponse.json({ error: "Database service key not configured" }, { status: 503 });
  }
  const admin = createClient(adminCfg.url, adminCfg.serviceRoleKey, {
    auth: { persistSession: false },
  });

  const eventId = event.id;
  if (eventId) {
    const { data: existingEvent, error: dedupErr } = await admin
      .from("clivora_events")
      .select("id")
      .eq("event_type", "stripe_webhook")
      .contains("payload", { event_id: eventId })
      .limit(1)
      .maybeSingle();
    if (dedupErr) {
      return NextResponse.json({ error: dedupErr.message }, { status: 500 });
    }
    if (existingEvent) {
      return NextResponse.json({ received: true, deduplicated: true, eventId });
    }
  }

  const nowIso = new Date().toISOString();
  const dataObject = event.data.object;
  let ledgerEmail = "";
  let ledgerPlan: string | null = null;
  let ledgerExtra: Record<string, unknown> = {};

  try {
    if (event.type === "checkout.session.completed") {
      const session = dataObject;
      if (session.payment_status !== "paid") {
        return NextResponse.json({
          received: true,
          ignored: true,
          reason: `payment_status=${String(session.payment_status ?? "unknown")}`,
        });
      }

      const rawEmail =
        typeof session.customer_email === "string"
          ? session.customer_email
          : typeof session.customer_details === "object" &&
              session.customer_details !== null &&
              typeof (session.customer_details as Record<string, unknown>).email === "string"
            ? ((session.customer_details as Record<string, unknown>).email as string)
            : null;
      const cleanEmail = rawEmail ? rawEmail.trim().toLowerCase() : null;
      const metadata = (session.metadata ?? {}) as Record<string, string>;
      if (metadata.kind === "escrow_milestone" && metadata.milestone_id) {
        const { error: escrowErr } = await admin.rpc("connect_transition_milestone", {
          p_milestone_id: metadata.milestone_id,
          p_status: "funded",
        });
        if (escrowErr) throw new Error(escrowErr.message);

        ledgerEmail = cleanEmail ?? "";
        ledgerPlan = "escrow";
        ledgerExtra = {
          kind: "escrow_milestone",
          milestone_id: metadata.milestone_id,
          session_id: session.id,
          user_id: metadata.client_user_id ?? session.client_reference_id ?? null,
        };
      } else {
        const userIdHint =
          typeof session.client_reference_id === "string"
            ? session.client_reference_id
            : metadata.user_id || null;
        const plan =
          metadata.plan === "pro" ? "pro" : metadata.plan === "pro_plus" ? "pro_plus" : "pro_plus";

        const profile = await resolveProfileByUserOrEmail(admin, userIdHint, cleanEmail);
        if (!profile) {
          return NextResponse.json(
            { error: "Unable to resolve user profile for completed Stripe checkout session" },
            { status: 500 },
          );
        }

        const { error: profErr } = await admin
          .from("profiles")
          .update({ subscription_plan: plan, updated_at: nowIso })
          .eq("id", profile.id);
        if (profErr) throw new Error(profErr.message);

        const subToken =
          typeof session.subscription === "string"
            ? `stripe_${session.subscription}`
            : `stripe_${session.id}`;
        const expiresAt = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();

        const { error: subErr } = await admin.from("subscriptions").upsert(
          {
            user_id: profile.id,
            product_id: `stripe_${plan}`,
            purchase_token: subToken,
            package_name: "org.codcrafters.clivora",
            status: "active",
            expires_at: expiresAt,
            verified_at: nowIso,
            updated_at: nowIso,
          },
          { onConflict: "purchase_token" },
        );
        if (subErr) throw new Error(subErr.message);

        ledgerEmail = profile.email ?? cleanEmail ?? "";
        ledgerPlan = plan;
        ledgerExtra = {
          session_id: session.id,
          subscription: session.subscription ?? null,
          user_id: profile.id,
        };
      }
    } else if (event.type === "customer.subscription.updated") {
      const sub = dataObject;
      const subToken = `stripe_${String(sub.id ?? "")}`;
      const rawStatus = String(sub.status ?? "").toLowerCase();
      const metadata = (sub.metadata ?? {}) as Record<string, string>;
      const periodEnd =
        typeof sub.current_period_end === "number"
          ? new Date(sub.current_period_end * 1000).toISOString()
          : undefined;
      const isInactive = ["canceled", "unpaid", "incomplete_expired"].includes(rawStatus);
      const nextSubStatus = isInactive
        ? "canceled"
        : rawStatus === "past_due"
          ? "past_due"
          : "active";

      const { data: subscription, error: findErr } = await admin
        .from("subscriptions")
        .select("id, user_id")
        .eq("purchase_token", subToken)
        .maybeSingle();
      if (findErr) throw new Error(findErr.message);

      const targetUserId = subscription?.user_id || metadata.user_id || null;
      if (subscription?.id) {
        const { error: subUpdErr } = await admin
          .from("subscriptions")
          .update({
            status: nextSubStatus,
            ...(periodEnd ? { expires_at: periodEnd } : {}),
            updated_at: nowIso,
          })
          .eq("id", subscription.id);
        if (subUpdErr) throw new Error(subUpdErr.message);
      }

      if (targetUserId && isInactive) {
        const { error: profErr } = await admin
          .from("profiles")
          .update({ subscription_plan: "free", updated_at: nowIso })
          .eq("id", targetUserId);
        if (profErr) throw new Error(profErr.message);
      }
      ledgerPlan = isInactive ? "free" : metadata.plan || null;
      ledgerExtra = { subscription_id: sub.id, status: rawStatus, user_id: targetUserId };
    } else if (event.type === "customer.subscription.deleted") {
      const sub = dataObject;
      const subToken = `stripe_${String(sub.id ?? "")}`;
      const { data: subscription, error: findErr } = await admin
        .from("subscriptions")
        .select("id, user_id")
        .eq("purchase_token", subToken)
        .maybeSingle();
      if (findErr) throw new Error(findErr.message);

      if (subscription?.user_id) {
        const { error: profErr } = await admin
          .from("profiles")
          .update({ subscription_plan: "free", updated_at: nowIso })
          .eq("id", subscription.user_id);
        if (profErr) throw new Error(profErr.message);

        const { error: subErr } = await admin
          .from("subscriptions")
          .update({ status: "canceled", updated_at: nowIso })
          .eq("id", subscription.id);
        if (subErr) throw new Error(subErr.message);
      }
      ledgerPlan = "free";
      ledgerExtra = { subscription_id: sub.id };
    } else if (event.type === "invoice.payment_failed") {
      const invoice = dataObject;
      const subId = typeof invoice.subscription === "string" ? invoice.subscription : "";
      if (subId) {
        const { error: subErr } = await admin
          .from("subscriptions")
          .update({ status: "past_due", updated_at: nowIso })
          .eq("purchase_token", `stripe_${subId}`);
        if (subErr) throw new Error(subErr.message);
      }
      ledgerEmail =
        typeof invoice.customer_email === "string" ? invoice.customer_email.toLowerCase() : "";
      ledgerExtra = { invoice_id: invoice.id, subscription_id: subId || null };
    } else if (event.type === "charge.refunded") {
      const charge = dataObject;
      const amount = Number(charge.amount ?? 0);
      const amountRefunded = Number(charge.amount_refunded ?? 0);
      const billingEmail =
        typeof (charge.billing_details as Record<string, unknown> | undefined)?.email === "string"
          ? String((charge.billing_details as Record<string, unknown>).email).toLowerCase()
          : typeof charge.receipt_email === "string"
            ? charge.receipt_email.toLowerCase()
            : "";

      if (amount > 0 && amountRefunded >= amount && billingEmail) {
        const { data: profile, error: profFindErr } = await admin
          .from("profiles")
          .select("id")
          .eq("email", billingEmail)
          .limit(1)
          .maybeSingle();
        if (profFindErr) throw new Error(profFindErr.message);

        if (profile?.id) {
          const { error: profErr } = await admin
            .from("profiles")
            .update({ subscription_plan: "free", updated_at: nowIso })
            .eq("id", profile.id);
          if (profErr) throw new Error(profErr.message);

          const { error: subErr } = await admin
            .from("subscriptions")
            .update({ status: "canceled", updated_at: nowIso })
            .eq("user_id", profile.id)
            .like("product_id", "stripe_%")
            .eq("status", "active");
          if (subErr) throw new Error(subErr.message);
        }
      }
      ledgerEmail = billingEmail;
      ledgerPlan = "free";
      ledgerExtra = { charge_id: charge.id, amount_refunded: amountRefunded };
    }

    if (eventId) {
      const { error: logErr } = await admin.from("clivora_events").insert({
        event_type: "stripe_webhook",
        user_email: ledgerEmail,
        ...(ledgerPlan ? { plan: ledgerPlan } : {}),
        source: "stripe",
        payload: {
          event_id: eventId,
          event_type: event.type,
          ...ledgerExtra,
          processed_at: nowIso,
        },
      });
      if (logErr) throw new Error(logErr.message);
    }

    return NextResponse.json({ received: true, eventId });
  } catch (err) {
    console.error("[stripe/webhook] Processing error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook processing failed" },
      { status: 500 },
    );
  }
}
