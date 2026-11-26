import { NextRequest } from "next/server";
import { adminErrorResponse, adminJson, requireAdminRequest } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      table?: string;
      id?: string;
      verify?: boolean;
      verified?: boolean;
    };
    const action = String(body.action ?? "list");
    await requireAdminRequest(req, { requireAal2: action !== "list" });

    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const svcHeaders = adminServiceHeaders(serviceRoleKey, "return=representation");

    if (action === "list") {
      const [profilesRes, needsRes, requestsRes] = await Promise.all([
        fetch(
          `${url}/rest/v1/connect_profiles?select=id,user_id,display_title,headline,skills,rate_band,is_listed,is_verified,moderation_status,account_type,updated_at&order=updated_at.desc&limit=100`,
          { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: "no-store" },
        ),
        fetch(
          `${url}/rest/v1/connect_need_posts?select=id,client_user_id,title,summary,skills,budget_band,is_open,moderation_status,created_at&order=created_at.desc&limit=100`,
          { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: "no-store" },
        ),
        fetch(
          `${url}/rest/v1/connect_requests?select=id,status,created_at,from_user_id,to_user_id&order=created_at.desc&limit=50`,
          { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: "no-store" },
        ),
      ]);

      if (!profilesRes.ok || !needsRes.ok) {
        return adminJson({ error: "Failed to load Connect data" }, { status: 500 });
      }

      const profiles = await profilesRes.json();
      const needs = await needsRes.json();
      const requests = requestsRes.ok ? await requestsRes.json() : [];

      return adminJson({
        ok: true,
        profiles: Array.isArray(profiles) ? profiles : [],
        needs: Array.isArray(needs) ? needs : [],
        requests: Array.isArray(requests) ? requests : [],
      });
    }

    const table = String(body.table ?? "");
    const id = String(body.id ?? "");
    if (!id || (table !== "connect_profiles" && table !== "connect_need_posts")) {
      return adminJson({ error: "table and id required" }, { status: 400 });
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
      const res = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: svcHeaders,
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        return adminJson({ error: "Failed to approve marketplace item" }, { status: 400 });
      }
      return adminJson({ ok: true, action: "approve", id });
    }

    if (action === "hide") {
      const patch: Record<string, unknown> = {
        moderation_status: "hidden",
        updated_at: new Date().toISOString(),
      };
      if (table === "connect_profiles") patch.is_listed = false;
      if (table === "connect_need_posts") patch.is_open = false;
      const res = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: svcHeaders,
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        return adminJson({ error: "Failed to hide marketplace item" }, { status: 400 });
      }
      return adminJson({ ok: true, action: "hide", id });
    }

    if (action === "verify" && table === "connect_profiles") {
      const res = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: svcHeaders,
        body: JSON.stringify({
          is_verified: Boolean(body.verified ?? true),
          moderation_status: "approved",
          is_listed: true,
          updated_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        return adminJson({ error: "Failed to verify profile" }, { status: 400 });
      }
      return adminJson({ ok: true, action: "verify", id });
    }

    return adminJson({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return adminErrorResponse(e, "Marketplace moderation failed");
  }
}
