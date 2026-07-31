import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifySafepayWebhook } from "@/lib/safepay";

export const runtime = "nodejs";

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

function digString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/** SafePay dashboard URL ping / health. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/safepay/webhook",
    expects: ["X-SFPY-SIGNATURE", "payment.succeeded"],
  });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature =
    req.headers.get("x-sfpy-signature") ||
    req.headers.get("X-SFPY-SIGNATURE") ||
    req.headers.get("x-safepay-signature");
  const timestamp =
    req.headers.get("x-sfpy-timestamp") ||
    req.headers.get("X-SFPY-TIMESTAMP") ||
    req.headers.get("x-safepay-timestamp");

  const ok = await verifySafepayWebhook(raw, signature, timestamp);
  if (!ok) {
    return NextResponse.json({ error: "Invalid Safepay signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = (payload.data ?? payload) as Record<string, unknown>;
  const metadata = (data.metadata ?? {}) as Record<string, unknown>;
  const eventType =
    digString(payload, ["type", "event", "event_type"])?.toLowerCase() ?? "";
  const state = digString(data, ["state", "status", "event", "type"])?.toLowerCase() ?? "";
  const trackerObj = data.tracker;
  const trackerFromObj =
    trackerObj && typeof trackerObj === "object"
      ? digString(trackerObj as Record<string, unknown>, ["token", "tracker"])
      : null;
  const tracker =
    trackerFromObj ||
    digString(data, ["tracker", "token", "tracker_token"]) ||
    digString(payload, ["tracker", "token"]);
  const paid =
    eventType.includes("payment.succeeded") ||
    eventType.includes("payment.success") ||
    state.includes("paid") ||
    state.includes("success") ||
    state.includes("completed") ||
    state.includes("captured") ||
    data.success === true ||
    Boolean(data.paid);

  if (!paid) {
    return NextResponse.json({ ok: true, ignored: true, state });
  }

  const key = serviceKey();
  if (!key) {
    return NextResponse.json({ error: "Service role missing" }, { status: 503 });
  }
  const admin = createClient(SUPABASE_URL, key);

  let requestId = digString(metadata, ["order_id", "orderId", "payment_request_id"]);
  let email = digString(metadata, ["email"])?.toLowerCase() ?? null;
  let plan = digString(metadata, ["plan"])?.toLowerCase() ?? "pro_plus";
  if (plan !== "pro" && plan !== "pro_plus") plan = "pro_plus";

  if (tracker) {
    const { data: byRef } = await admin
      .from("pro_payment_requests")
      .select("id, email, plan, status")
      .eq("payment_reference", tracker)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (byRef) {
      requestId = String(byRef.id);
      email = String(byRef.email || email || "").toLowerCase() || email;
      plan = String(byRef.plan || plan).toLowerCase() === "pro" ? "pro" : "pro_plus";
    }
  }

  if (requestId) {
    await admin
      .from("pro_payment_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        payment_reference: tracker ?? requestId,
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
        purchase_token: tracker || `safepay_${profile.id}_${Date.now()}`,
        status: "active",
        expires_at: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
        verified_at: nowIso,
      });
    }
  }

  return NextResponse.json({ ok: true, paid: true, tracker, requestId, email, plan });
}
