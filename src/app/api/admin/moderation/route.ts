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

function headers(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
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

    const action = String(body.action ?? "");

    if (action === "get_settings") {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/app_settings?select=key,value&key=in.(connect_auto_approve_profiles,connect_auto_approve_needs)`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
      );
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 });
      const rows = (await res.json()) as { key: string; value: { enabled?: boolean } }[];
      const map: Record<string, boolean> = {
        connect_auto_approve_profiles: true,
        connect_auto_approve_needs: true,
      };
      for (const r of rows) map[r.key] = r.value?.enabled !== false;
      return NextResponse.json({ ok: true, settings: map });
    }

    if (action === "set_auto_approve") {
      const target = String(body.target ?? ""); // profiles | needs
      const enabled = body.enabled === true;
      const keyName =
        target === "needs" ? "connect_auto_approve_needs" : "connect_auto_approve_profiles";
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/app_settings?key=eq.${encodeURIComponent(keyName)}`,
        {
          method: "PATCH",
          headers: headers(key),
          body: JSON.stringify({
            value: { enabled },
            updated_at: new Date().toISOString(),
          }),
        },
      );
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 400 });
      return NextResponse.json({ ok: true, key: keyName, enabled });
    }

    if (action === "block" || action === "unblock" || action === "restrict" || action === "unrestrict") {
      const userId = String(body.userId ?? "");
      if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (action === "block") {
        patch.is_blocked = true;
        patch.block_reason = String(body.reason ?? "Blocked by admin");
        patch.blocked_at = new Date().toISOString();
      } else if (action === "unblock") {
        // Clear both flags so admin "Unblock" restores full access (UI treats either as suspended).
        patch.is_blocked = false;
        patch.is_restricted = false;
        patch.block_reason = "";
        patch.blocked_at = null;
        patch.blocked_by = null;
      } else if (action === "restrict") {
        patch.is_restricted = true;
      } else if (action === "unrestrict") {
        patch.is_restricted = false;
      }
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
        { method: "PATCH", headers: headers(key), body: JSON.stringify(patch) },
      );
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 400 });
      return NextResponse.json({ ok: true, action, userId });
    }

    if (action === "update_user") {
      const userId = String(body.userId ?? "");
      if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (typeof body.name === "string") patch.name = body.name.trim();
      if (typeof body.account_type === "string") patch.account_type = body.account_type.trim();
      if (typeof body.subscription_plan === "string") {
        patch.subscription_plan = body.subscription_plan.trim();
      }
      if (typeof body.is_blocked === "boolean") {
        patch.is_blocked = body.is_blocked;
        if (body.is_blocked) {
          patch.blocked_at = new Date().toISOString();
          patch.block_reason = String(body.block_reason ?? "Blocked by administrator");
        } else {
          patch.blocked_at = null;
          patch.block_reason = "";
        }
      }
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
        { method: "PATCH", headers: headers(key), body: JSON.stringify(patch) },
      );
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 400 });
      return NextResponse.json({ ok: true, action, userId });
    }

    if (action === "delete_review") {
      const reviewId = String(body.reviewId ?? "");
      if (!reviewId) return NextResponse.json({ error: "reviewId required" }, { status: 400 });
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/connect_reviews?id=eq.${encodeURIComponent(reviewId)}`,
        { method: "DELETE", headers: headers(key) },
      );
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 400 });
      return NextResponse.json({ ok: true, action, reviewId });
    }

    if (action === "update_review") {
      const reviewId = String(body.reviewId ?? "");
      if (!reviewId) return NextResponse.json({ error: "reviewId required" }, { status: 400 });
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.rating != null) patch.rating = Number(body.rating);
      if (typeof body.title === "string") patch.title = body.title.trim();
      if (typeof body.comment === "string") patch.comment = body.comment.trim();
      if (typeof body.verified === "boolean") patch.verified = body.verified;
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/connect_reviews?id=eq.${encodeURIComponent(reviewId)}`,
        { method: "PATCH", headers: headers(key), body: JSON.stringify(patch) },
      );
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 400 });
      return NextResponse.json({ ok: true, action, reviewId });
    }

    if (action === "delete_job") {
      const jobId = String(body.jobId ?? "");
      if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/connect_jobs?id=eq.${encodeURIComponent(jobId)}`,
        { method: "DELETE", headers: headers(key) },
      );
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 400 });
      return NextResponse.json({ ok: true, action, jobId });
    }

    if (action === "update_job") {
      const jobId = String(body.jobId ?? "");
      if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (typeof body.status === "string") patch.status = body.status;
      if (typeof body.title === "string") patch.title = body.title;
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/connect_jobs?id=eq.${encodeURIComponent(jobId)}`,
        { method: "PATCH", headers: headers(key), body: JSON.stringify(patch) },
      );
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 400 });
      return NextResponse.json({ ok: true, action, jobId });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Moderation failed" },
      { status: 401 },
    );
  }
}
