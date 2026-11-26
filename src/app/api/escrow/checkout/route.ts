import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { getPublicSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_ENABLED = process.env.STRIPE_ENABLED === "true";

export async function POST(req: NextRequest) {
  if (!STRIPE_ENABLED || !STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Escrow payment gateway (Stripe) is not configured." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { milestoneId?: string } | null;
  const milestoneId = String(body?.milestoneId ?? "").trim();
  if (!milestoneId) {
    return NextResponse.json({ error: "milestoneId is required" }, { status: 400 });
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

  const { data: ms, error: msErr } = await admin
    .from("connect_milestones")
    .select("id, title, amount, currency, status, client_user_id")
    .eq("id", milestoneId)
    .maybeSingle();

  if (msErr || !ms) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
  }
  if (ms.client_user_id !== user.id) {
    return NextResponse.json(
      { error: "Only the hiring client may fund escrow for this milestone." },
      { status: 403 },
    );
  }
  if (!["pending", "pending_funding"].includes(String(ms.status ?? ""))) {
    return NextResponse.json(
      { error: `Milestone cannot be funded from status "${ms.status}".` },
      { status: 400 },
    );
  }

  const amountNum = Number(ms.amount ?? 0);
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    return NextResponse.json({ error: "Milestone amount must be greater than zero." }, { status: 400 });
  }

  const unitAmount = Math.round(amountNum * 100);
  const currency = String(ms.currency || "USD").trim().toLowerCase();
  const origin = getPublicSiteUrl();

  try {
    const params = new URLSearchParams({
      mode: "payment",
      "line_items[0][price_data][currency]": currency,
      "line_items[0][price_data][unit_amount]": String(unitAmount),
      "line_items[0][price_data][product_data][name]": `Escrow Deposit: ${String(ms.title || "Milestone")}`,
      "line_items[0][quantity]": "1",
      success_url: `${origin}/checkout/escrow?milestone=${encodeURIComponent(ms.id)}&payment=success`,
      cancel_url: `${origin}/checkout/escrow?milestone=${encodeURIComponent(ms.id)}&payment=cancel`,
      ...(user.email ? { customer_email: user.email } : {}),
      client_reference_id: user.id,
      "metadata[kind]": "escrow_milestone",
      "metadata[milestone_id]": ms.id,
      "metadata[client_user_id]": user.id,
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
      const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
      throw new Error(err.error?.message ?? "Stripe escrow checkout failed");
    }

    const session = (await res.json()) as { id: string; url: string };
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Escrow checkout failed" },
      { status: 500 },
    );
  }
}
