import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { fetchSafepayTracker } from "@/lib/safepay";
import { getSupabaseUrl } from "@/lib/supabase/env";

export const runtime = "nodejs";

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

/** After SafePay redirect, confirm tracker and unlock Pro if paid and authenticated. */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { tracker?: string; orderId?: string };
    const tracker = String(body.tracker ?? "").trim();
    const orderId = String(body.orderId ?? "").trim() || null;
    if (!tracker && !orderId) {
      return NextResponse.json({ error: "tracker or orderId required" }, { status: 400 });
    }

    const key = serviceKey();
    if (!key) {
      return NextResponse.json({ error: "Service role missing" }, { status: 503 });
    }
    const admin = createAdminClient(getSupabaseUrl(), key);

    // Verify authenticated caller session
    let callerUser: { id: string; email?: string } | null = null;
    try {
      const serverSupabase = await createServerClient();
      const {
        data: { user },
      } = await serverSupabase.auth.getUser();
      if (user) {
        callerUser = { id: user.id, email: user.email?.toLowerCase() };
      }
    } catch {
      // Inability to read session will be enforced below
    }

    let requestId = orderId;
    let email: string | null = null;
    let plan = "pro_plus";
    let paymentRef = tracker;
    let requestUserId: string | null = null;

    if (tracker) {
      const status = await fetchSafepayTracker(tracker);
      if (!status.paid) {
        return NextResponse.json({
          ok: true,
          paid: false,
          state: status.state,
          message: "Payment not completed yet",
        });
      }
      paymentRef = tracker;
      const { data: byRef } = await admin
        .from("pro_payment_requests")
        .select("id, user_id, email, plan, status")
        .eq("payment_reference", tracker)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (byRef) {
        requestId = String(byRef.id);
        requestUserId = byRef.user_id ? String(byRef.user_id) : null;
        email = String(byRef.email || "").toLowerCase() || null;
        plan = String(byRef.plan || plan).toLowerCase() === "pro" ? "pro" : "pro_plus";
        if (byRef.status === "approved") {
          return NextResponse.json({
            ok: true,
            paid: true,
            tracker: paymentRef,
            requestId,
            plan,
          });
        }
      }
    }

    if (requestId && !email) {
      const { data: byId } = await admin
        .from("pro_payment_requests")
        .select("id, user_id, email, plan, payment_reference, status")
        .eq("id", requestId)
        .maybeSingle();
      if (byId) {
        requestId = String(byId.id);
        requestUserId = byId.user_id ? String(byId.user_id) : null;
        email = String(byId.email || "").toLowerCase() || null;
        plan = String(byId.plan || plan).toLowerCase() === "pro" ? "pro" : "pro_plus";
        paymentRef = tracker || String(byId.payment_reference || requestId);
        if (byId.status === "approved") {
          return NextResponse.json({
            ok: true,
            paid: true,
            tracker: paymentRef,
            requestId,
            plan,
          });
        }
        if (!tracker) {
          const status = await fetchSafepayTracker(paymentRef);
          if (!status.paid) {
            return NextResponse.json({
              ok: true,
              paid: false,
              state: status.state,
              message: "Payment not completed yet",
            });
          }
        }
      }
    }

    // Assert caller authentication against payment record ownership
    if (!callerUser) {
      return NextResponse.json(
        { error: "Authentication required to confirm payment and unlock subscription." },
        { status: 401 }
      );
    }

    const isAuthorized =
      (requestUserId && callerUser.id === requestUserId) ||
      (email && callerUser.email === email);

    if (!isAuthorized && (requestUserId || email)) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to confirm this payment record." },
        { status: 403 }
      );
    }

    if (requestId) {
      await admin
        .from("pro_payment_requests")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          payment_reference: paymentRef,
        })
        .eq("id", requestId);
    }

    // Resolve profile to upgrade: prefer callerUser.id
    const targetUserId = requestUserId || callerUser.id;
    const targetEmail = email || callerUser.email;

    if (targetUserId) {
      const nowIso = new Date().toISOString();
      await admin
        .from("profiles")
        .update({ subscription_plan: plan, updated_at: nowIso })
        .eq("id", targetUserId);

      await admin
        .from("subscriptions")
        .delete()
        .eq("user_id", targetUserId)
        .like("product_id", "safepay_%");

      await admin.from("subscriptions").insert({
        user_id: targetUserId,
        product_id: `safepay_${plan}`,
        purchase_token: paymentRef || `safepay_${targetUserId}_${Date.now()}`,
        status: "active",
        expires_at: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
        verified_at: nowIso,
      });
    } else if (targetEmail) {
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .ilike("email", targetEmail)
        .limit(1)
        .maybeSingle();

      if (profile?.id) {
        const nowIso = new Date().toISOString();
        await admin
          .from("profiles")
          .update({ subscription_plan: plan, updated_at: nowIso })
          .eq("id", profile.id);

        await admin
          .from("subscriptions")
          .delete()
          .eq("user_id", profile.id)
          .like("product_id", "safepay_%");

        await admin.from("subscriptions").insert({
          user_id: profile.id,
          product_id: `safepay_${plan}`,
          purchase_token: paymentRef || `safepay_${profile.id}_${Date.now()}`,
          status: "active",
          expires_at: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
          verified_at: nowIso,
        });
      }
    }

    return NextResponse.json({ ok: true, paid: true, tracker: paymentRef, requestId, plan });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Confirm failed" },
      { status: 500 }
    );
  }
}
