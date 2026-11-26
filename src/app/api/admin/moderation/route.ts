import { NextRequest } from "next/server";
import { adminErrorResponse, adminJson, requireAdminRequest } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export const runtime = "nodejs";

const ALLOWED_ACCOUNT_TYPES = new Set(["freelancer", "client", "admin"]);
const ALLOWED_PLANS = new Set(["free", "pro", "pro_plus"]);
const ALLOWED_JOB_STATUSES = new Set(["published", "draft", "paused", "closed", "archived"]);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const action = String(body.action ?? "");
    await requireAdminRequest(req, { requireAal2: action !== "get_settings" });

    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const svcHeaders = adminServiceHeaders(serviceRoleKey, "return=representation");

    if (action === "get_settings") {
      const res = await fetch(
        `${url}/rest/v1/app_settings?select=key,value&key=in.(connect_auto_approve_profiles,connect_auto_approve_needs)`,
        { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: "no-store" },
      );
      if (!res.ok) return adminJson({ error: "Failed to load settings" }, { status: 500 });
      const rows = (await res.json()) as { key: string; value: { enabled?: boolean } }[];
      const map: Record<string, boolean> = {
        connect_auto_approve_profiles: true,
        connect_auto_approve_needs: true,
      };
      for (const r of rows) map[r.key] = r.value?.enabled !== false;
      return adminJson({ ok: true, settings: map });
    }

    if (action === "set_auto_approve") {
      const target = String(body.target ?? ""); // profiles | needs
      const enabled = body.enabled === true;
      const keyName =
        target === "needs" ? "connect_auto_approve_needs" : "connect_auto_approve_profiles";
      const res = await fetch(
        `${url}/rest/v1/app_settings?key=eq.${encodeURIComponent(keyName)}`,
        {
          method: "PATCH",
          headers: svcHeaders,
          body: JSON.stringify({
            value: { enabled },
            updated_at: new Date().toISOString(),
          }),
        },
      );
      if (!res.ok) return adminJson({ error: "Failed to update setting" }, { status: 400 });
      return adminJson({ ok: true, key: keyName, enabled });
    }

    if (action === "block" || action === "unblock" || action === "restrict" || action === "unrestrict") {
      const userId = String(body.userId ?? "");
      if (!userId) return adminJson({ error: "userId required" }, { status: 400 });
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (action === "block") {
        patch.is_blocked = true;
        patch.block_reason = String(body.reason ?? "Blocked by admin");
        patch.blocked_at = new Date().toISOString();
      } else if (action === "unblock") {
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
        `${url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
        { method: "PATCH", headers: svcHeaders, body: JSON.stringify(patch) },
      );
      if (!res.ok) return adminJson({ error: "Failed to update moderation flags" }, { status: 400 });
      return adminJson({ ok: true, action, userId });
    }

    if (action === "update_user") {
      const userId = String(body.userId ?? "");
      if (!userId) return adminJson({ error: "userId required" }, { status: 400 });
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (typeof body.name === "string") patch.name = body.name.trim();
      if (typeof body.account_type === "string") {
        const at = body.account_type.trim().toLowerCase();
        if (!ALLOWED_ACCOUNT_TYPES.has(at)) {
          return adminJson({ error: "Invalid account_type" }, { status: 400 });
        }
        patch.account_type = at;
      }
      if (typeof body.subscription_plan === "string") {
        const sp = body.subscription_plan.trim().toLowerCase();
        if (!ALLOWED_PLANS.has(sp)) {
          return adminJson({ error: "Invalid subscription_plan" }, { status: 400 });
        }
        patch.subscription_plan = sp;
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
        `${url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
        { method: "PATCH", headers: svcHeaders, body: JSON.stringify(patch) },
      );
      if (!res.ok) return adminJson({ error: "Failed to update user profile" }, { status: 400 });
      return adminJson({ ok: true, action, userId });
    }

    if (action === "delete_review") {
      const reviewId = String(body.reviewId ?? "");
      if (!reviewId) return adminJson({ error: "reviewId required" }, { status: 400 });
      const res = await fetch(
        `${url}/rest/v1/connect_reviews?id=eq.${encodeURIComponent(reviewId)}`,
        { method: "DELETE", headers: svcHeaders },
      );
      if (!res.ok) return adminJson({ error: "Failed to delete review" }, { status: 400 });
      return adminJson({ ok: true, action, reviewId });
    }

    if (action === "update_review") {
      const reviewId = String(body.reviewId ?? "");
      if (!reviewId) return adminJson({ error: "reviewId required" }, { status: 400 });
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.rating != null) {
        const rating = Number(body.rating);
        if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
          return adminJson({ error: "rating must be 1-5" }, { status: 400 });
        }
        patch.rating = rating;
      }
      if (typeof body.title === "string") patch.title = body.title.trim();
      if (typeof body.comment === "string") patch.comment = body.comment.trim();
      if (typeof body.verified === "boolean") patch.verified = body.verified;
      const res = await fetch(
        `${url}/rest/v1/connect_reviews?id=eq.${encodeURIComponent(reviewId)}`,
        { method: "PATCH", headers: svcHeaders, body: JSON.stringify(patch) },
      );
      if (!res.ok) return adminJson({ error: "Failed to update review" }, { status: 400 });
      return adminJson({ ok: true, action, reviewId });
    }

    if (action === "delete_job") {
      const jobId = String(body.jobId ?? "");
      if (!jobId) return adminJson({ error: "jobId required" }, { status: 400 });
      const res = await fetch(
        `${url}/rest/v1/connect_jobs?id=eq.${encodeURIComponent(jobId)}`,
        { method: "DELETE", headers: svcHeaders },
      );
      if (!res.ok) return adminJson({ error: "Failed to delete job" }, { status: 400 });
      return adminJson({ ok: true, action, jobId });
    }

    if (action === "update_job") {
      const jobId = String(body.jobId ?? "");
      if (!jobId) return adminJson({ error: "jobId required" }, { status: 400 });
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (typeof body.status === "string") {
        const st = body.status.trim().toLowerCase();
        if (!ALLOWED_JOB_STATUSES.has(st)) {
          return adminJson({ error: "Invalid job status" }, { status: 400 });
        }
        patch.status = st;
      }
      if (typeof body.title === "string") patch.title = body.title.trim();
      const res = await fetch(
        `${url}/rest/v1/connect_jobs?id=eq.${encodeURIComponent(jobId)}`,
        { method: "PATCH", headers: svcHeaders, body: JSON.stringify(patch) },
      );
      if (!res.ok) return adminJson({ error: "Failed to update job" }, { status: 400 });
      return adminJson({ ok: true, action, jobId });
    }

    return adminJson({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return adminErrorResponse(e, "Moderation request failed");
  }
}
