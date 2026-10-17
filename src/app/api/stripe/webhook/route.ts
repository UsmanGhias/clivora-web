import { NextRequest, NextResponse } from "next/server";
import { verifyStripeWebhookSignature } from "@/lib/stripe-webhook";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_ENABLED = process.env.STRIPE_ENABLED === "true";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://jtzjwgovqczlccyeujhq.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function updateProfilePlan(email: string, plan: string) {
  if (!SUPABASE_SERVICE_ROLE_KEY) return;
  const cleanEmail = email.trim();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?email=ilike.${encodeURIComponent(cleanEmail)}`,
    {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        subscription_plan: plan,
        updated_at: new Date().toISOString(),
      }),
    },
  );
  if (!res.ok) {
    console.error(`[Stripe Webhook] Failed to update profile plan for ${cleanEmail}: ${res.statusText}`);
  }
}

export async function POST(req: NextRequest) {
  if (!STRIPE_ENABLED || !STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  if (!verifyStripeWebhookSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email =
      typeof session.customer_email === "string"
        ? session.customer_email
        : typeof session.customer_details === "object" &&
            session.customer_details !== null &&
            typeof (session.customer_details as Record<string, unknown>).email === "string"
          ? (session.customer_details as Record<string, unknown>).email as string
          : null;
    const metadata = (session.metadata ?? {}) as Record<string, string>;
    const plan = metadata.plan === "pro_plus" ? "pro_plus" : metadata.plan === "pro" ? "pro" : null;

    if (email && plan) {
      await updateProfilePlan(email, plan);
    }
  }

  return NextResponse.json({ received: true });
}
