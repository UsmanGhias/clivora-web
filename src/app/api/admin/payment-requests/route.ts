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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await requireAdminRequest(req, { requireAal2: false });

    const key = serviceKey();
    if (!key) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is not configured on Vercel" },
        { status: 500 },
      );
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/pro_payment_requests?select=id,email,full_name,plan,amount_pkr,amount_usd,currency,payment_method,payment_reference,status,created_at,country,account_type,notes&order=created_at.desc&limit=100`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Failed to load payment requests" }, { status: 500 });
    }
    const rows = await res.json();
    return NextResponse.json({ requests: rows });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: e instanceof Error && e.message.includes("authorized") ? 403 : 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await requireAdminRequest(req, { requireAal2: false });
    const key = serviceKey();
    if (!key) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is not configured on Vercel" },
        { status: 500 },
      );
    }
    const id = String(body.id ?? "").trim();
    const status = String(body.status ?? "").trim().toLowerCase();
    if (!id || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "id and status (approved|rejected|pending) required" }, { status: 400 });
    }

    // Load request so Approve can also grant the plan (status-only was leaving profiles on Free).
    const getRes = await fetch(
      `${SUPABASE_URL}/rest/v1/pro_payment_requests?id=eq.${encodeURIComponent(id)}&select=id,email,plan,status&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      },
    );
    if (!getRes.ok) {
      return NextResponse.json({ error: await getRes.text() }, { status: 400 });
    }
    const rows = (await getRes.json()) as Array<{ id: string; email?: string; plan?: string }>;
    const row = rows[0];
    if (!row) return NextResponse.json({ error: "Payment request not found" }, { status: 404 });

    if (status === "approved") {
      const email = String(row.email ?? "").trim().toLowerCase();
      const planRaw = String(row.plan ?? "pro").toLowerCase();
      const plan = planRaw.includes("plus") ? "pro_plus" : "pro";
      if (!email.includes("@")) {
        return NextResponse.json({ error: "Payment request missing email" }, { status: 400 });
      }
      const profileRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?select=id&email=ilike.${encodeURIComponent(email)}&limit=1`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
      );
      const profiles = profileRes.ok
        ? ((await profileRes.json()) as Array<{ id: string }>)
        : [];
      if (!profiles.length) {
        return NextResponse.json({ error: `No profile for ${email}` }, { status: 404 });
      }
      const userId = profiles[0].id;
      const nowIso = new Date().toISOString();
      const patchProfile = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
        {
          method: "PATCH",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ subscription_plan: plan, updated_at: nowIso }),
        },
      );
      if (!patchProfile.ok) {
        return NextResponse.json({ error: await patchProfile.text() }, { status: 400 });
      }
      await fetch(
        `${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}&product_id=like.admin_grant_*`,
        { method: "DELETE", headers: { apikey: key, Authorization: `Bearer ${key}` } },
      );
      await fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: `admin_grant_${plan}`,
          purchase_token: `admin_${userId}_${plan}_${Date.now()}`,
          status: "active",
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          verified_at: nowIso,
        }),
      });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/pro_payment_requests?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status,
          reviewed_at: new Date().toISOString(),
        }),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Failed to update payment request" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, id, status });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: e instanceof Error && e.message.includes("authorized") ? 403 : 500 },
    );
  }
}
