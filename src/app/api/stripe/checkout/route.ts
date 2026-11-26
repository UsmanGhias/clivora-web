import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo-codes";
import { getPublicSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_ENABLED = process.env.STRIPE_ENABLED === "true";
const STRIPE_PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO ?? "",
  pro_plus: process.env.STRIPE_PRICE_PRO_PLUS ?? "",
};

async function findActiveStripePromotionCode(code: string, secretKey: string): Promise<string | null> {
  const query = new URLSearchParams({
    code: code.trim().toUpperCase(),
    active: "true",
    limit: "1",
  });
  const res = await fetch(`https://api.stripe.com/v1/promotion_codes?${query.toString()}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: Array<{ id?: string }> };
  return json.data?.[0]?.id ?? null;
}

export async function POST(req: NextRequest) {
  if (!STRIPE_ENABLED || !STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let body: {
    plan?: string;
    email?: string;
    promoCode?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const plan = body.plan === "pro" ? "pro" : "pro_plus";
  const email = body.email;
  const rawPromoCode = typeof body.promoCode === "string" ? body.promoCode.trim().toUpperCase() : "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (email && email.trim().toLowerCase() !== user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "Checkout email must match the signed-in account" },
      { status: 403 },
    );
  }

  const priceId = STRIPE_PRICE_IDS[plan];
  if (!priceId || priceId.startsWith("price_placeholder")) {
    return NextResponse.json(
      {
        error: "Stripe price IDs not configured",
        hint: "Set STRIPE_PRICE_PRO / STRIPE_PRICE_PRO_PLUS, or use SafePay / Play billing.",
      },
      { status: 503 },
    );
  }

  let stripePromotionId: string | null = null;
  if (rawPromoCode) {
    try {
      await validatePromoCode({ code: rawPromoCode, plan, amountUsd: 1 });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid promo code" },
        { status: 400 },
      );
    }
    stripePromotionId = await findActiveStripePromotionCode(rawPromoCode, STRIPE_SECRET_KEY);
    if (!stripePromotionId) {
      return NextResponse.json(
        { error: "This promo code is not configured for Stripe card discounts." },
        { status: 400 },
      );
    }
  }

  const origin = getPublicSiteUrl();
  const success = `${origin}/app?checkout=success`;
  const cancel = `${origin}/pro?checkout=cancelled`;

  try {
    const params = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: success,
      cancel_url: cancel,
      customer_email: user.email,
      client_reference_id: user.id,
      "metadata[plan]": plan,
      "metadata[user_id]": user.id,
      "subscription_data[metadata][plan]": plan,
      "subscription_data[metadata][user_id]": user.id,
      ...(stripePromotionId && rawPromoCode
        ? {
            "discounts[0][promotion_code]": stripePromotionId,
            "metadata[promo_code]": rawPromoCode,
            "subscription_data[metadata][promo_code]": rawPromoCode,
          }
        : {}),
    });

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = (await res.json()) as { error?: { message?: string } };
      throw new Error(err.error?.message ?? "Stripe checkout failed");
    }

    const session = (await res.json()) as { id: string; url: string };
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
