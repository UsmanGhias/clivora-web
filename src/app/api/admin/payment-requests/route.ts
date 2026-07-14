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
    await requireAdminRequest(req);

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
    await requireAdminRequest(req);
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
