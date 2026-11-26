import { NextRequest } from "next/server";
import { adminErrorResponse, adminJson, requireAdminRequest } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      email?: string;
      revoke?: boolean;
      plan?: string;
      paymentRequestId?: string;
    };
    await requireAdminRequest(req, { requireAal2: true });

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
      return adminJson(
        { error: "Plan must be pro, pro_plus, or free (via revoke)." },
        { status: 400 },
      );
    }
    if (!target.includes("@")) {
      return adminJson({ error: "Valid email required" }, { status: 400 });
    }

    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const svcHeaders = adminServiceHeaders(serviceRoleKey, "return=minimal");

    const profileRes = await fetch(
      `${url}/rest/v1/profiles?select=id,email,subscription_plan,account_type&email=ilike.${encodeURIComponent(target)}&limit=1`,
      {
        headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
        cache: "no-store",
      },
    );
    if (!profileRes.ok) {
      return adminJson({ error: "Failed to look up profile" }, { status: 500 });
    }
    const profiles = (await profileRes.json()) as Array<{
      id: string;
      email: string;
      account_type?: string | null;
    }>;
    if (!profiles.length) {
      return adminJson({ error: "No profile found for that email." }, { status: 404 });
    }
    const userId = profiles[0].id;
    const accountType = String(profiles[0].account_type ?? "freelancer").toLowerCase();
    if (accountType && !["freelancer", "client", "admin"].includes(accountType)) {
      return adminJson(
        { error: `Unsupported account type for plan grants: ${accountType}` },
        { status: 400 },
      );
    }

    const nowIso = new Date().toISOString();
    const patchRes = await fetch(`${url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      headers: svcHeaders,
      body: JSON.stringify({ subscription_plan: plan, updated_at: nowIso }),
    });
    if (!patchRes.ok) {
      return adminJson({ error: "Failed to update plan" }, { status: 400 });
    }

    if (plan === "pro" || plan === "pro_plus") {
      const delRes = await fetch(
        `${url}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(userId)}&product_id=like.admin_grant_*`,
        {
          method: "DELETE",
          headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
        },
      );
      if (!delRes.ok) {
        return adminJson({ error: "Failed to clear prior admin grants" }, { status: 400 });
      }
      const insertRes = await fetch(`${url}/rest/v1/subscriptions`, {
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
      if (!insertRes.ok) {
        return adminJson({ error: "Failed to create subscription grant" }, { status: 400 });
      }
    } else {
      const cancelRes = await fetch(
        `${url}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(userId)}&status=eq.active`,
        {
          method: "PATCH",
          headers: svcHeaders,
          body: JSON.stringify({ status: "canceled", updated_at: nowIso }),
        },
      );
      if (!cancelRes.ok) {
        return adminJson({ error: "Failed to revoke active subscriptions" }, { status: 400 });
      }
    }

    if (body.paymentRequestId) {
      const payRes = await fetch(
        `${url}/rest/v1/pro_payment_requests?id=eq.${encodeURIComponent(String(body.paymentRequestId))}`,
        {
          method: "PATCH",
          headers: svcHeaders,
          body: JSON.stringify({
            status: revoke ? "rejected" : "approved",
            reviewed_at: nowIso,
          }),
        },
      );
      if (!payRes.ok) {
        return adminJson(
          { error: "Plan updated but payment request review failed" },
          { status: 400 },
        );
      }
    }

    return adminJson({
      ok: true,
      plan,
      email: target,
      account_type: accountType,
      granted_at: nowIso,
    });
  } catch (e) {
    return adminErrorResponse(e, "Failed to update subscription grant");
  }
}
