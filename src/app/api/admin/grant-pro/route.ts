import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

function serviceKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

function headers(key: string, prefer = "return=minimal") {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

async function readError(res: Response, fallback: string) {
  const text = await res.text().catch(() => "");
  return text || fallback;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await requireAdminRequest(req, { requireAal2: false });

    const target = String(body.email ?? "").trim().toLowerCase();
    const revoke = Boolean(body.revoke);
    const requested = String(body.plan ?? "pro").toLowerCase();
    const plan = revoke
      ? "free"
      : requested === "pro_plus" || requested === "plus" || requested === "proplus"
        ? "pro_plus"
        : requested === "pro"
          ? "pro"
          : null;
    if (!plan) {
      return NextResponse.json({ error: "Plan must be pro, pro_plus, or free (via revoke)." }, { status: 400 });
    }
    if (!target.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const key = serviceKey();
    if (!key) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is not configured on Vercel" },
        { status: 500 },
      );
    }

    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=id,email,subscription_plan,account_type&email=ilike.${encodeURIComponent(target)}&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      },
    );
    if (!profileRes.ok) {
      return NextResponse.json(
        { error: await readError(profileRes, "Failed to look up profile") },
        { status: 500 },
      );
    }
    const profiles = (await profileRes.json()) as Array<{
      id: string;
      email: string;
      account_type?: string | null;
    }>;
    if (!profiles.length) {
      return NextResponse.json({ error: "No profile found for that email." }, { status: 404 });
    }
    const userId = profiles[0].id;
    const accountType = String(profiles[0].account_type ?? "freelancer").toLowerCase();
    // Grants apply to freelancer and client account types (and legacy empty).
    if (accountType && !["freelancer", "client", "admin"].includes(accountType)) {
      return NextResponse.json(
        { error: `Unsupported account type for plan grants: ${accountType}` },
        { status: 400 },
      );
    }

    const nowIso = new Date().toISOString();
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: "PATCH",
      headers: headers(key),
      body: JSON.stringify({ subscription_plan: plan, updated_at: nowIso }),
    });
    if (!patchRes.ok) {
      return NextResponse.json(
        { error: await readError(patchRes, "Failed to update plan") },
        { status: 400 },
      );
    }

    if (plan === "pro" || plan === "pro_plus") {
      const delRes = await fetch(
        `${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}&product_id=like.admin_grant_*`,
        {
          method: "DELETE",
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        },
      );
      if (!delRes.ok) {
        return NextResponse.json(
          { error: await readError(delRes, "Failed to clear prior admin grants") },
          { status: 400 },
        );
      }
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
        method: "POST",
        headers: headers(key),
        body: JSON.stringify({
          user_id: userId,
          product_id: `admin_grant_${plan}`,
          purchase_token: `admin_${userId}_${plan}_${Date.now()}`,
          status: "active",
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          verified_at: nowIso,
        }),
      });
      if (!insertRes.ok) {
        return NextResponse.json(
          { error: await readError(insertRes, "Failed to create subscription grant") },
          { status: 400 },
        );
      }
    } else {
      const cancelRes = await fetch(
        `${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}&status=eq.active`,
        {
          method: "PATCH",
          headers: headers(key),
          body: JSON.stringify({ status: "canceled", updated_at: nowIso }),
        },
      );
      if (!cancelRes.ok) {
        return NextResponse.json(
          { error: await readError(cancelRes, "Failed to revoke active subscriptions") },
          { status: 400 },
        );
      }
    }

    if (body.paymentRequestId) {
      const payRes = await fetch(
        `${SUPABASE_URL}/rest/v1/pro_payment_requests?id=eq.${encodeURIComponent(String(body.paymentRequestId))}`,
        {
          method: "PATCH",
          headers: headers(key),
          body: JSON.stringify({
            status: revoke ? "rejected" : "approved",
            reviewed_at: nowIso,
          }),
        },
      );
      if (!payRes.ok) {
        return NextResponse.json(
          { error: await readError(payRes, "Plan updated but payment request review failed") },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({
      ok: true,
      plan,
      email: target,
      account_type: accountType,
      granted_at: nowIso,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status =
      msg.includes("authorized") || msg.includes("Incorrect password") ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
