import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function readError(res: Response) {
  return (await res.text().catch(() => "")) || `Supabase request failed (${res.status})`;
}

export async function DELETE(_request: Request, context: RouteContext) {
  let admin;
  try {
    admin = await requireAdmin({ requireAal2: true });
  } catch (error) {
    return adminErrorResponse(error);
  }

  const { id } = await context.params;
  if (!id) {
    return adminJson({ error: "API key id is required" }, { status: 400 });
  }

  try {
    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const endpoint = new URL(`${url}/rest/v1/api_keys`);
    endpoint.searchParams.set("id", `eq.${id}`);
    endpoint.searchParams.set("owner_uid", `eq.${admin.id}`);
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: adminServiceHeaders(serviceRoleKey, "return=representation"),
      body: JSON.stringify({ revoked_at: new Date().toISOString() }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(await readError(res));
    }
    const rows = (await res.json()) as Array<{ id: string; revoked_at: string | null }>;
    if (!rows.length) {
      return adminJson({ error: "API key not found" }, { status: 404 });
    }
    return adminJson({ ok: true, id: rows[0].id, revokedAt: rows[0].revoked_at });
  } catch (error) {
    return adminErrorResponse(error, "Could not revoke API key");
  }
}
