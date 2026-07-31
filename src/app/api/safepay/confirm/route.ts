import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchSafepayTracker } from "@/lib/safepay";

export const runtime = "nodejs";

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

/** After SafePay redirect, confirm tracker and unlock Pro if paid. */
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
    const admin = createClient(SUPABASE_URL, key);

    let requestId = orderId;
    let email: string | null = null;
    let plan = "pro_plus";
    let paymentRef = tracker;

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
        .select("id, email, plan, status")
        .eq("payment_reference", tracker)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (byRef) {
        requestId = String(byRef.id);
        email = String(byRef.email || "").toLowerCase() || null;
        plan = String(byRef.plan || plan).toLowerCase() === "pro" ? "pro" : "pro_plus";
      }
    }

    if (requestId && !email) {
      const { data: byId } = await admin
        .from("pro_payment_requests")
        .select("id, email, plan, payment_reference, status")
        .eq("id", requestId)
        .maybeSingle();
      if (byId) {
        email = String(byId.email || "").toLowerCase() || null;
        plan = String(byId.plan || plan).toLowerCase() === "pro" ? "pro" : "pro_plus";
        paymentRef = tracker || String(byId.payment_reference || requestId);
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

    if (email) {
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .ilike("email", email)
        .limit(1)
        .maybeSingle();
      if (profile?.id) {
        const nowIso = new Date().toISOString();
        await admin
          .from("profiles")
          .update({ subscription_plan: plan, updated_at: nowIso })
          .eq("id", profile.id);
        await admin.from("subscriptions").delete().eq("user_id", profile.id).like("product_id", "safepay_%");
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

    return NextResponse.json({ ok: true, paid: true, tracker: paymentRef, requestId, email, plan });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Confirm failed" },
      { status: 500 },
    );
  }
}
