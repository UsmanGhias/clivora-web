import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Low-cost Stripe Customer Portal (only when STRIPE_SECRET_KEY is set).
 * Without Stripe keys, returns a clear message. JazzCash/Play remain primary.
 */
export async function POST(req: NextRequest) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (process.env.STRIPE_ENABLED !== "true" || !STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: "Stripe Customer Portal not configured",
        hint: "Primary billing is Google Play (Android) and JazzCash/manual (web). Add STRIPE_SECRET_KEY in Vercel to enable Stripe portal.",
        alternatives: ["/pro", "https://play.google.com/store/account/subscriptions"],
      },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const origin = req.headers.get("origin") ?? "https://clivora.io";
  const returnUrl = `${origin}/app/account`;

  // Prefer existing stripe_customers row if present (table may be absent in some envs).
  let customerId: string | undefined;
  try {
    const { data: sc, error: scErr } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!scErr && sc?.stripe_customer_id) {
      customerId = String(sc.stripe_customer_id);
    }
  } catch {
    /* table optional */
  }

  try {
    if (!customerId) {
      const createParams = new URLSearchParams({
        email: user.email,
        "metadata[user_id]": user.id,
      });
      const createRes = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: createParams.toString(),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err?.error?.message ?? "Could not create Stripe customer");
      }
      const created = (await createRes.json()) as { id: string };
      customerId = created.id;
    }

    const portalParams = new URLSearchParams({
      customer: customerId!,
      return_url: returnUrl,
    });
    const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: portalParams.toString(),
    });
    if (!portalRes.ok) {
      const err = await portalRes.json();
      throw new Error(err?.error?.message ?? "Could not open billing portal");
    }
    const session = (await portalRes.json()) as { url: string };
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Portal failed" },
      { status: 500 },
    );
  }
}
