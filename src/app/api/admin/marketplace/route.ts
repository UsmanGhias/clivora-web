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

function headers(key: string, prefer = "return=representation") {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
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

    const action = String(body.action ?? "list");

    if (action === "list") {
      const [profilesRes, needsRes, requestsRes] = await Promise.all([
        fetch(
          `${SUPABASE_URL}/rest/v1/connect_profiles?select=id,user_id,display_title,headline,skills,rate_band,is_listed,is_verified,moderation_status,account_type,updated_at&order=updated_at.desc&limit=100`,
          { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
        ),
        fetch(
          `${SUPABASE_URL}/rest/v1/connect_need_posts?select=id,client_user_id,title,summary,skills,budget_band,is_open,moderation_status,created_at&order=created_at.desc&limit=100`,
          { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
        ),
        fetch(
          `${SUPABASE_URL}/rest/v1/connect_requests?select=id,status,created_at,from_user_id,to_user_id&order=created_at.desc&limit=50`,
          { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
        ),
      ]);

      if (!profilesRes.ok || !needsRes.ok) {
        const text = !profilesRes.ok ? await profilesRes.text() : await needsRes.text();
        return NextResponse.json({ error: text || "Failed to load Connect data" }, { status: 500 });
      }

      const profiles = await profilesRes.json();
      const needs = await needsRes.json();
      const requests = requestsRes.ok ? await requestsRes.json() : [];

      return NextResponse.json({
        ok: true,
        profiles: Array.isArray(profiles) ? profiles : [],
        needs: Array.isArray(needs) ? needs : [],
        requests: Array.isArray(requests) ? requests : [],
      });
    }

    const table = String(body.table ?? "");
    const id = String(body.id ?? "");
    if (!id || (table !== "connect_profiles" && table !== "connect_need_posts")) {
      return NextResponse.json({ error: "table and id required" }, { status: 400 });
    }

    if (action === "approve") {
      const patch: Record<string, unknown> = {
        moderation_status: "approved",
        updated_at: new Date().toISOString(),
      };
      if (table === "connect_profiles") {
        patch.is_listed = true;
        if (body.verify === true) patch.is_verified = true;
      }
      if (table === "connect_need_posts") {
        patch.is_open = true;
      }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: headers(key),
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        return NextResponse.json({ error: await res.text() }, { status: 400 });
      }
      return NextResponse.json({ ok: true, action: "approve", id });
    }

    if (action === "hide") {
      const patch: Record<string, unknown> = {
        moderation_status: "hidden",
        updated_at: new Date().toISOString(),
      };
      if (table === "connect_profiles") patch.is_listed = false;
      if (table === "connect_need_posts") patch.is_open = false;
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: headers(key),
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        return NextResponse.json({ error: await res.text() }, { status: 400 });
      }
      return NextResponse.json({ ok: true, action: "hide", id });
    }

    if (action === "verify" && table === "connect_profiles") {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: headers(key),
        body: JSON.stringify({
          is_verified: Boolean(body.verified ?? true),
          moderation_status: "approved",
          is_listed: true,
          updated_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        return NextResponse.json({ error: await res.text() }, { status: 400 });
      }
      return NextResponse.json({ ok: true, action: "verify", id });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status =
      msg.includes("authorized") || msg.includes("Incorrect password") ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
