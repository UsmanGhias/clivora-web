import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { createClient } from "@/lib/supabase/server";
import { createSafepayCheckout, loadSafepayConfig } from "@/lib/safepay";
import { PRO_PLUS_PRICE_USD, PRO_PRICE_USD } from "@/lib/pricing";
import { validatePromoCode } from "@/lib/promo-codes";
import { getPublicSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

export async function GET() {
  const cfg = await loadSafepayConfig();
  return NextResponse.json({
    configured: cfg.configured,
    env: cfg.env,
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user?.email) {
      return NextResponse.json(
        { error: "Sign in required before starting SafePay checkout." },
        { status: 401 },
      );
    }

    const body = (await req.json().catch(() => null)) as {
      plan?: string;
      accountType?: string;
      fullName?: string;
      email?: string;
      promoCode?: string;
    } | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const plan = body.plan === "pro" ? "pro" : "pro_plus";
    const accountType = body.accountType === "client" ? "client" : "freelancer";
    const accountEmail = user.email.trim().toLowerCase();
    const requestedEmail = String(body.email ?? "").trim().toLowerCase();
    if (requestedEmail && requestedEmail !== accountEmail) {
      return NextResponse.json(
        { error: "Checkout email must match your signed-in account." },
        { status: 403 },
      );
    }
    const fullName = String(body.fullName ?? user.user_metadata?.name ?? "").trim();

    const cfg = await loadSafepayConfig();
    if (!cfg.configured) {
      return NextResponse.json(
        { error: "SafePay is not configured." },
        { status: 503 },
      );
    }

    let adminUrl: string;
    let serviceRoleKey: string;
    try {
      const adminCfg = requireAdminServiceConfig();
      adminUrl = adminCfg.url;
      serviceRoleKey = adminCfg.serviceRoleKey;
    } catch {
      return NextResponse.json(
        { error: "Checkout service is unavailable." },
        { status: 503 },
      );
    }

    const baseAmount = plan === "pro_plus" ? PRO_PLUS_PRICE_USD : PRO_PRICE_USD;
    const promo = body.promoCode
      ? await validatePromoCode({
          code: body.promoCode,
          plan,
          amountUsd: baseAmount,
        })
      : null;
    const amount = promo?.finalAmountUsd ?? baseAmount;
    const currency = (process.env.SAFEPAY_CURRENCY || "USD").toUpperCase();

    const writer = createServiceClient(adminUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const orderId = `clivora_${plan}_${randomUUID()}`;
    const { data: requestRow, error: insertError } = await writer
      .from("pro_payment_requests")
      .insert({
        email: accountEmail,
        full_name: fullName || accountEmail,
        account_type: accountType,
        plan,
        amount_usd: amount,
        currency,
        country: "PK",
        payment_method: "safepay",
        payment_reference: orderId,
        notes: promo ? `Promo: ${promo.code} (${promo.note})` : "Safepay hosted checkout",
        promo_code: promo?.code ?? null,
        status: "pending",
        user_id: user.id,
      })
      .select("id")
      .single();

    if (insertError || !requestRow?.id) {
      return NextResponse.json(
        { error: insertError?.message || "Failed to initialize payment request" },
        { status: 400 },
      );
    }

    const origin = getPublicSiteUrl();
    const checkout = await createSafepayCheckout({
      amountUsd: amount,
      currency,
      orderId: String(requestRow.id),
      customerEmail: accountEmail,
      customerName: fullName || accountEmail,
      plan,
      accountType,
      successUrl: `${origin}/pro?safepay=success&order=${encodeURIComponent(String(requestRow.id))}`,
      cancelUrl: `${origin}/pro?safepay=cancel`,
    });

    const promoNote = promo ? `Promo: ${promo.code} (${promo.note})` : "Safepay hosted checkout";
    const { error: updateErr } = await writer
      .from("pro_payment_requests")
      .update({
        payment_reference: checkout.tracker,
        notes: `${promoNote}\nSafepay tracker ${checkout.tracker}`,
      })
      .eq("id", requestRow.id);

    if (updateErr) {
      return NextResponse.json(
        { error: `Failed to bind payment tracker: ${updateErr.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      checkoutUrl: checkout.checkoutUrl,
      tracker: checkout.tracker,
      requestId: requestRow.id,
      env: checkout.env,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Safepay checkout failed" },
      { status: 500 },
    );
  }
}
