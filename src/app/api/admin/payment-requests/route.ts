import { NextRequest } from "next/server";
import { adminErrorResponse, adminJson, requireAdminRequest } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await requireAdminRequest(req, { requireAal2: false });
    const { url, serviceRoleKey } = requireAdminServiceConfig();

    const res = await fetch(
      `${url}/rest/v1/pro_payment_requests?select=id,email,full_name,plan,amount_pkr,amount_usd,currency,payment_method,payment_reference,status,created_at,country,account_type,notes&order=created_at.desc&limit=100`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return adminJson({ error: "Failed to load payment requests" }, { status: 500 });
    }
    const rows = await res.json();
    return adminJson({ requests: rows });
  } catch (e) {
    return adminErrorResponse(e, "Failed to load payment requests");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { id?: string; status?: string };
    await requireAdminRequest(req, { requireAal2: true });
    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const svcHeaders = adminServiceHeaders(serviceRoleKey, "return=minimal");

    const id = String(body.id ?? "").trim();
    const status = String(body.status ?? "").trim().toLowerCase();
    if (!id || !["approved", "rejected", "pending"].includes(status)) {
      return adminJson(
        { error: "id and status (approved|rejected|pending) required" },
        { status: 400 },
      );
    }

    // Load request so Approve can also grant the plan (status-only was leaving profiles on Free).
    const getRes = await fetch(
      `${url}/rest/v1/pro_payment_requests?id=eq.${encodeURIComponent(id)}&select=id,email,plan,status&limit=1`,
      {
        headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
        cache: "no-store",
      },
    );
    if (!getRes.ok) {
      return adminJson({ error: "Failed to look up payment request" }, { status: 400 });
    }
    const rows = (await getRes.json()) as Array<{ id: string; email?: string; plan?: string }>;
    const row = rows[0];
    if (!row) return adminJson({ error: "Payment request not found" }, { status: 404 });

    if (status === "approved") {
      const email = String(row.email ?? "").trim().toLowerCase();
      const planRaw = String(row.plan ?? "pro").toLowerCase();
      const plan = planRaw.includes("plus") ? "pro_plus" : "pro";
      if (!email.includes("@")) {
        return adminJson({ error: "Payment request missing email" }, { status: 400 });
      }
      const profileRes = await fetch(
        `${url}/rest/v1/profiles?select=id&email=ilike.${encodeURIComponent(email)}&limit=1`,
        {
          headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
          cache: "no-store",
        },
      );
      const profiles = profileRes.ok
        ? ((await profileRes.json()) as Array<{ id: string }>)
        : [];
      if (!profiles.length) {
        return adminJson({ error: `No profile for ${email}` }, { status: 404 });
      }
      const userId = profiles[0].id;
      const nowIso = new Date().toISOString();
      const patchProfile = await fetch(
        `${url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
        {
          method: "PATCH",
          headers: svcHeaders,
          body: JSON.stringify({ subscription_plan: plan, updated_at: nowIso }),
        },
      );
      if (!patchProfile.ok) {
        return adminJson({ error: "Failed to upgrade profile plan" }, { status: 500 });
      }
      const delGrant = await fetch(
        `${url}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(userId)}&product_id=like.admin_grant_*`,
        { method: "DELETE", headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } },
      );
      if (!delGrant.ok) {
        return adminJson({ error: "Failed to replace existing grant" }, { status: 500 });
      }
      const insGrant = await fetch(`${url}/rest/v1/subscriptions`, {
        method: "POST",
        headers: svcHeaders,
        body: JSON.stringify({
          user_id: userId,
          product_id: `admin_grant_${plan}`,
          purchase_token: `admin_${userId}_${plan}_${Date.now()}`,
          status: "active",
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          verified_at: nowIso,
        }),
      });
      if (!insGrant.ok) {
        return adminJson({ error: "Failed to record grant subscription" }, { status: 500 });
      }
    }

    const res = await fetch(
      `${url}/rest/v1/pro_payment_requests?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: svcHeaders,
        body: JSON.stringify({
          status,
          reviewed_at: new Date().toISOString(),
        }),
      },
    );
    if (!res.ok) {
      return adminJson({ error: "Failed to update payment request" }, { status: 400 });
    }
    return adminJson({ ok: true, id, status });
  } catch (e) {
    return adminErrorResponse(e, "Failed to update payment request");
  }
}
