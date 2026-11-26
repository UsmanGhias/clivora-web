import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { PRO_PLUS_PRICE_USD, PRO_PRICE_USD } from "@/lib/pricing";
import { activateSafepaySubscription, fetchSafepayTracker } from "@/lib/safepay";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** After SafePay redirect, confirm tracker and unlock Pro if paid and authenticated. */
export async function POST(req: NextRequest) {
  try {
    const serverSupabase = await createServerClient();
    const {
      data: { user },
      error: authErr,
    } = await serverSupabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json(
        { error: "Authentication required to confirm payment and unlock subscription." },
        { status: 401 },
      );
    }

    const body = (await req.json().catch(() => null)) as {
      tracker?: string;
      orderId?: string;
    } | null;
    const tracker = String(body?.tracker ?? "").trim();
    const orderId = String(body?.orderId ?? "").trim() || null;
    if (!tracker && !orderId) {
      return NextResponse.json({ error: "tracker or orderId required" }, { status: 400 });
    }

    let adminCfg: { url: string; serviceRoleKey: string };
    try {
      adminCfg = requireAdminServiceConfig();
    } catch {
      return NextResponse.json({ error: "Payment service unavailable" }, { status: 503 });
    }
    const admin = createAdminClient(adminCfg.url, adminCfg.serviceRoleKey, {
      auth: { persistSession: false },
    });

    const callerEmail = user.email?.trim().toLowerCase() ?? null;

    type RequestRow = {
      id: string;
      user_id: string | null;
      email: string | null;
      plan: string | null;
      amount_usd: number | null;
      currency: string | null;
      payment_reference: string | null;
      status: string | null;
    };

    let requestRow: RequestRow | null = null;
    if (orderId) {
      const { data: byId, error: idErr } = await admin
        .from("pro_payment_requests")
        .select("id, user_id, email, plan, amount_usd, currency, payment_reference, status")
        .eq("id", orderId)
        .maybeSingle();
      if (idErr) {
        return NextResponse.json({ error: idErr.message }, { status: 500 });
      }
      if (!byId) {
        return NextResponse.json({ error: "Payment request not found" }, { status: 404 });
      }
      requestRow = byId as RequestRow;
    } else if (tracker) {
      const { data: byRef, error: refErr } = await admin
        .from("pro_payment_requests")
        .select("id, user_id, email, plan, amount_usd, currency, payment_reference, status")
        .eq("payment_reference", tracker)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (refErr) {
        return NextResponse.json({ error: refErr.message }, { status: 500 });
      }
      if (!byRef) {
        return NextResponse.json({ error: "Payment request not found for tracker" }, { status: 404 });
      }
      requestRow = byRef as RequestRow;
    }

    if (!requestRow) {
      return NextResponse.json({ error: "Payment request not found" }, { status: 404 });
    }

    const ownsByUserId = Boolean(requestRow.user_id && requestRow.user_id === user.id);
    const ownsByEmail = Boolean(
      !requestRow.user_id &&
        requestRow.email &&
        callerEmail &&
        requestRow.email.toLowerCase() === callerEmail,
    );
    if (!ownsByUserId && !ownsByEmail) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to confirm this payment record." },
        { status: 403 },
      );
    }

    const storedRef = String(requestRow.payment_reference ?? "").trim();
    if (tracker && storedRef && storedRef !== tracker) {
      return NextResponse.json(
        { error: "Tracker does not match the payment request reference." },
        { status: 400 },
      );
    }
    const paymentRef = tracker || storedRef;
    if (!paymentRef) {
      return NextResponse.json(
        { error: "Payment request has no registered SafePay tracker." },
        { status: 400 },
      );
    }

    const plan = String(requestRow.plan ?? "").toLowerCase() === "pro" ? "pro" : "pro_plus";

    if (requestRow.status === "approved") {
      return NextResponse.json({
        ok: true,
        paid: true,
        deduplicated: true,
        tracker: paymentRef,
        requestId: requestRow.id,
        plan,
      });
    }

    const status = await fetchSafepayTracker(paymentRef);
    if (!status.paid) {
      return NextResponse.json({
        ok: true,
        paid: false,
        state: status.state,
        message: "Payment not completed yet",
      });
    }

    const expectedCurrency = String(
      requestRow.currency || process.env.SAFEPAY_CURRENCY || "USD",
    ).toUpperCase();
    if (status.currency && status.currency !== expectedCurrency) {
      return NextResponse.json(
        { error: `Payment currency mismatch: expected ${expectedCurrency}, received ${status.currency}` },
        { status: 400 },
      );
    }

    const expectedAmountUsd =
      typeof requestRow.amount_usd === "number" && Number.isFinite(requestRow.amount_usd)
        ? requestRow.amount_usd
        : plan === "pro"
          ? PRO_PRICE_USD
          : PRO_PLUS_PRICE_USD;
    const expectedMinor = Math.max(0, Math.round(expectedAmountUsd * 100));
    if (status.amountMinor != null && status.amountMinor < expectedMinor) {
      return NextResponse.json(
        { error: "Paid amount is less than the expected checkout amount." },
        { status: 400 },
      );
    }

    const activation = await activateSafepaySubscription({
      tracker: paymentRef,
      requestId: requestRow.id,
      userId: requestRow.user_id || user.id,
      email: requestRow.email || callerEmail,
      plan,
      source: "confirm",
      state: status.state,
    });

    return NextResponse.json({
      ok: true,
      paid: true,
      deduplicated: activation.deduplicated,
      tracker: paymentRef,
      requestId: requestRow.id,
      plan,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Confirm failed" },
      { status: 500 },
    );
  }
}
