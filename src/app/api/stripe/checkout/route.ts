import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_ENABLED = process.env.STRIPE_ENABLED === "true";
const STRIPE_PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO ?? "",
  pro_plus: process.env.STRIPE_PRICE_PRO_PLUS ?? "",
};

export async function POST(req: NextRequest) {
  if (!STRIPE_ENABLED || !STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let body: {
    plan?: string;
    email?: string;
    successUrl?: string;
    cancelUrl?: string;
    promoCode?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { plan = "pro", email, promoCode } = body;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (email && email.trim().toLowerCase() !== user.email.toLowerCase()) {
    return NextResponse.json({ error: "Checkout email must match the signed-in account" }, { status: 403 });
  }
  const priceId = STRIPE_PRICE_IDS[plan];

  const origin = "https://clivora.codcrafters.org";
  const success = `${origin}/app?checkout=success`;
  const cancel = `${origin}/pro?checkout=cancelled`;

  try {
    const params = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId || "price_placeholder",
      "line_items[0][quantity]": "1",
      success_url: success,
      cancel_url: cancel,
      customer_email: user.email,
      "metadata[plan]": plan,
      "subscription_data[metadata][plan]": plan,
      ...(promoCode
        ? {
            "metadata[promo_code]": promoCode.trim().toUpperCase(),
            "subscription_data[metadata][promo_code]": promoCode.trim().toUpperCase(),
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
