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

    const target = String(body.email ?? "").trim().toLowerCase();
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
      `${SUPABASE_URL}/rest/v1/profiles?select=id,email&email=ilike.${encodeURIComponent(target)}&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      },
    );
    if (!profileRes.ok) {
      return NextResponse.json({ error: "Failed to look up profile" }, { status: 500 });
    }
    const profiles = (await profileRes.json()) as Array<{ id: string }>;
    if (!profiles.length) {
      return NextResponse.json({ error: "No profile found for that email." }, { status: 404 });
    }

    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${profiles[0].id}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ role: "admin", updated_at: new Date().toISOString() }),
    });
    if (!patchRes.ok) {
      const text = await patchRes.text();
      return NextResponse.json({ error: text || "Failed to grant admin" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, email: target });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: e instanceof Error && e.message.includes("authorized") ? 403 : 500 },
    );
  }
}
