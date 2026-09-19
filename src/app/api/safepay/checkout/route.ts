import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createSafepayCheckout, loadSafepayConfig } from "@/lib/safepay";
import { PRO_PLUS_PRICE_USD, PRO_PRICE_USD } from "@/lib/pricing";
import { validatePromoCode } from "@/lib/promo-codes";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

export async function GET() {
  const cfg = await loadSafepayConfig();
  return NextResponse.json({
    configured: cfg.configured,
    env: cfg.env,
    missing: cfg.missing,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      plan?: string;
      accountType?: string;
      fullName?: string;
      email?: string;
      promoCode?: string;
      amountUsd?: number;
    };

    const plan = body.plan === "pro" ? "pro" : "pro_plus";
    const accountType = body.accountType === "client" ? "client" : "freelancer";
    const email = String(body.email ?? "").trim().toLowerCase();
    const fullName = String(body.fullName ?? "").trim();
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const cfg = await loadSafepayConfig();
    if (!cfg.configured) {
      return NextResponse.json(
        {
          error: "SafePay is not configured",
          missing: cfg.missing,
          hint: "Set SAFEPAY_SECRET_KEY and SAFEPAY_API_KEY (sec_… UUID) in Vercel or admin_integration_secrets.",
        },
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

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const key = serviceKey();
    const writer = key
      ? createServiceClient(SUPABASE_URL, key, { auth: { persistSession: false } })
      : supabase;

    const orderId = `clivora_${plan}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const { data: requestRow, error: insertError } = await writer
      .from("pro_payment_requests")
      .insert({
        email,
        full_name: fullName || email,
        account_type: accountType,
        plan,
        amount_usd: amount,
        currency: process.env.SAFEPAY_CURRENCY || "USD",
        country: "PK",
        payment_method: "safepay",
        payment_reference: orderId,
        notes: promo ? `Promo: ${promo.code} (${promo.note})` : "Safepay hosted checkout",
        promo_code: promo?.code ?? null,
        status: "pending",
        user_id: user?.id ?? null,
      })
      .select("id")
      .maybeSingle();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    const origin = req.nextUrl.origin || site.url;
    const checkout = await createSafepayCheckout({
      amountUsd: amount,
      orderId: String(requestRow?.id || orderId),
      customerEmail: email,
      customerName: fullName || email,
      plan,
      accountType,
      successUrl: `${origin}/pro?safepay=success&order=${encodeURIComponent(String(requestRow?.id || orderId))}`,
      cancelUrl: `${origin}/pro?safepay=cancel`,
    });

    if (requestRow?.id) {
      const promoNote = promo ? `Promo: ${promo.code} (${promo.note})` : "Safepay hosted checkout";
      await writer
        .from("pro_payment_requests")
        .update({
          payment_reference: checkout.tracker,
          notes: `${promoNote}\nSafepay tracker ${checkout.tracker}`,
        })
        .eq("id", requestRow.id);
    }

    return NextResponse.json({
      ok: true,
      checkoutUrl: checkout.checkoutUrl,
      tracker: checkout.tracker,
      requestId: requestRow?.id ?? null,
      env: checkout.env,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Safepay checkout failed" },
      { status: 500 },
    );
  }
}
