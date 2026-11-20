import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyStripeWebhookSignature } from "@/lib/stripe-webhook";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_ENABLED = process.env.STRIPE_ENABLED === "true";

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createClient(SUPABASE_URL, serviceKey);
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

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database service key not configured" }, { status: 503 });
  }

  // Idempotency: Verify whether this event.id has already been processed
  const eventId = event.id;
  if (eventId) {
    const { data: existingEvent } = await admin
      .from("clivora_events")
      .select("id")
      .eq("event_type", "stripe_webhook")
      .contains("payload", { event_id: eventId })
      .limit(1)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json({ received: true, deduplicated: true, eventId });
    }
  }

  const nowIso = new Date().toISOString();
  const dataObject = event.data.object;

  if (event.type === "checkout.session.completed") {
    const session = dataObject;
    const email =
      typeof session.customer_email === "string"
        ? session.customer_email
        : typeof session.customer_details === "object" &&
            session.customer_details !== null &&
            typeof (session.customer_details as Record<string, unknown>).email === "string"
          ? ((session.customer_details as Record<string, unknown>).email as string)
          : null;
    const metadata = (session.metadata ?? {}) as Record<string, string>;
    const plan = metadata.plan === "pro_plus" ? "pro_plus" : metadata.plan === "pro" ? "pro" : "pro_plus";

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .ilike("email", cleanEmail)
        .limit(1)
        .maybeSingle();

      if (profile?.id) {
        await admin
          .from("profiles")
          .update({
            subscription_plan: plan,
            updated_at: nowIso,
          })
          .eq("id", profile.id);

        const subToken =
          typeof session.subscription === "string"
            ? `stripe_${session.subscription}`
            : `stripe_${session.id}`;

        const { data: existingSub } = await admin
          .from("subscriptions")
          .select("id")
          .eq("purchase_token", subToken)
          .maybeSingle();

        if (!existingSub) {
          await admin
            .from("subscriptions")
            .delete()
            .eq("user_id", profile.id)
            .like("product_id", "stripe_%");

          await admin.from("subscriptions").insert({
            user_id: profile.id,
            product_id: `stripe_${plan}`,
            purchase_token: subToken,
            package_name: "org.codcrafters.clivora",
            status: "active",
            expires_at: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
            verified_at: nowIso,
          });
        } else {
          await admin
            .from("subscriptions")
            .update({
              status: "active",
              expires_at: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
              verified_at: nowIso,
              updated_at: nowIso,
            })
            .eq("id", existingSub.id);
        }
      }

      // Log processed event into clivora_events ledger
      await admin.from("clivora_events").insert({
        event_type: "stripe_webhook",
        user_email: cleanEmail,
        plan,
        source: "stripe",
        payload: {
          event_id: eventId,
          event_type: event.type,
          session_id: session.id,
          subscription: session.subscription ?? null,
          processed_at: nowIso,
        },
      });
    }
  } else if (event.type === "customer.subscription.deleted") {
    // Subscription canceled or revoked: downgrade user to free tier
    const sub = dataObject;
    const subToken = `stripe_${sub.id}`;
    const { data: subscription } = await admin
      .from("subscriptions")
      .select("id, user_id")
      .eq("purchase_token", subToken)
      .maybeSingle();

    if (subscription?.user_id) {
      await admin
        .from("profiles")
        .update({ subscription_plan: "free", updated_at: nowIso })
        .eq("id", subscription.user_id);

      await admin
        .from("subscriptions")
        .update({ status: "canceled", updated_at: nowIso })
        .eq("id", subscription.id);
    }

    if (eventId) {
      await admin.from("clivora_events").insert({
        event_type: "stripe_webhook",
        plan: "free",
        source: "stripe",
        payload: {
          event_id: eventId,
          event_type: event.type,
          subscription_id: sub.id,
          processed_at: nowIso,
        },
      });
    }
  } else if (eventId) {
    // Log other informational events for audit trail
    await admin.from("clivora_events").insert({
      event_type: "stripe_webhook",
      source: "stripe",
      payload: {
        event_id: eventId,
        event_type: event.type,
        processed_at: nowIso,
      },
    });
  }

  return NextResponse.json({ received: true, eventId });
}
