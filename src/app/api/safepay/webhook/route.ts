import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { PRO_PLUS_PRICE_USD, PRO_PRICE_USD } from "@/lib/pricing";
import {
  activateSafepaySubscription,
  parseSafepayAmountMinor,
  verifySafepayWebhook,
} from "@/lib/safepay";
import { isSafepayPaidState } from "@/lib/security-utils";

export const runtime = "nodejs";

function digString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

const PAID_WEBHOOK_EVENTS = new Set([
  "payment.succeeded",
  "payment.success",
  "tracker.ended",
  "payment_intent.succeeded",
]);

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
  const state = digString(data, ["state", "status", "event", "type"]) ?? "";
  const trackerObj = data.tracker;
  const trackerFromObj =
    trackerObj && typeof trackerObj === "object"
      ? digString(trackerObj as Record<string, unknown>, ["token", "tracker"])
      : null;
  const tracker =
    trackerFromObj ||
    digString(data, ["tracker", "token", "tracker_token"]) ||
    digString(payload, ["tracker", "token"]);

  const stateLooksPaid = isSafepayPaidState(state);
  const eventLooksPaid = PAID_WEBHOOK_EVENTS.has(eventType);
  const paid = state ? stateLooksPaid : eventLooksPaid;

  if (!paid) {
    return NextResponse.json({ ok: true, ignored: true, state: state || eventType });
  }
  if (!tracker) {
    return NextResponse.json({ error: "Missing tracker in paid webhook" }, { status: 400 });
  }

  let adminCfg: { url: string; serviceRoleKey: string };
  try {
    adminCfg = requireAdminServiceConfig();
  } catch {
    return NextResponse.json({ error: "Service role missing" }, { status: 503 });
  }
  const admin = createClient(adminCfg.url, adminCfg.serviceRoleKey, {
    auth: { persistSession: false },
  });

  let requestId = digString(metadata, ["order_id", "orderId", "payment_request_id"]);
  let userId: string | null = digString(metadata, ["user_id"]);
  let email = digString(metadata, ["email"])?.toLowerCase() ?? null;
  let plan: "pro" | "pro_plus" =
    digString(metadata, ["plan"])?.toLowerCase() === "pro" ? "pro" : "pro_plus";
  let expectedAmountUsd: number | null = null;
  let expectedCurrency = (process.env.SAFEPAY_CURRENCY || "USD").toUpperCase();

  const { data: byRef, error: byRefErr } = await admin
    .from("pro_payment_requests")
    .select("id, user_id, email, plan, amount_usd, currency, status")
    .eq("payment_reference", tracker)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (byRefErr) {
    return NextResponse.json({ error: byRefErr.message }, { status: 500 });
  }

  if (byRef) {
    requestId = String(byRef.id);
    userId = byRef.user_id ? String(byRef.user_id) : userId;
    email = String(byRef.email || email || "").toLowerCase() || email;
    plan = String(byRef.plan || plan).toLowerCase() === "pro" ? "pro" : "pro_plus";
    if (typeof byRef.amount_usd === "number" && Number.isFinite(byRef.amount_usd)) {
      expectedAmountUsd = byRef.amount_usd;
    }
    if (typeof byRef.currency === "string" && byRef.currency.trim()) {
      expectedCurrency = byRef.currency.trim().toUpperCase();
    }
  }

  const paidCurrency = digString(data, ["currency"])?.toUpperCase() ?? null;
  if (paidCurrency && paidCurrency !== expectedCurrency) {
    return NextResponse.json(
      { error: `Currency mismatch: expected ${expectedCurrency}, got ${paidCurrency}` },
      { status: 400 },
    );
  }

  const paidMinor = parseSafepayAmountMinor(data);
  const minimumUsd =
    expectedAmountUsd ?? (plan === "pro" ? PRO_PRICE_USD : PRO_PLUS_PRICE_USD);
  if (paidMinor != null && paidMinor < Math.max(0, Math.round(minimumUsd * 100))) {
    return NextResponse.json(
      { error: "Paid amount is less than expected plan price" },
      { status: 400 },
    );
  }

  try {
    const result = await activateSafepaySubscription({
      tracker,
      requestId,
      userId,
      email,
      plan,
      source: "webhook",
      state: state || eventType,
    });
    return NextResponse.json({
      ok: true,
      paid: true,
      deduplicated: result.deduplicated,
      tracker,
      requestId,
      email,
      plan,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "SafePay activation failed" },
      { status: 500 },
    );
  }
}
