import { NextRequest } from "next/server";
import { adminErrorResponse, adminJson, requireAdminRequest } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { email?: string };
    await requireAdminRequest(req, { requireAal2: true });

    const target = String(body.email ?? "").trim().toLowerCase();
    if (!target.includes("@")) {
      return adminJson({ error: "Valid email required" }, { status: 400 });
    }

    const { url, serviceRoleKey } = requireAdminServiceConfig();

    const profileRes = await fetch(
      `${url}/rest/v1/profiles?select=id,email&email=ilike.${encodeURIComponent(target)}&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      },
    );
    if (!profileRes.ok) {
      return adminJson({ error: "Failed to look up profile" }, { status: 500 });
    }
    const profiles = (await profileRes.json()) as Array<{ id: string }>;
    if (!profiles.length) {
      return adminJson({ error: "No profile found for that email." }, { status: 404 });
    }

    const patchRes = await fetch(
      `${url}/rest/v1/profiles?id=eq.${encodeURIComponent(profiles[0].id)}`,
      {
        method: "PATCH",
        headers: adminServiceHeaders(serviceRoleKey, "return=minimal"),
        body: JSON.stringify({ role: "admin", updated_at: new Date().toISOString() }),
      },
    );
    if (!patchRes.ok) {
      return adminJson({ error: "Failed to grant admin" }, { status: 400 });
    }

    return adminJson({ ok: true, email: target });
  } catch (e) {
    return adminErrorResponse(e, "Failed to grant admin role");
  }
}
