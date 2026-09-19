import { ApiAuthError, requireApiKey } from "@/lib/api-v1/auth";
import { apiError, apiJson } from "@/lib/api-v1/responses";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export const runtime = "nodejs";

const PROJECT_FIELDS = [
  "id",
  "customer_id",
  "name",
  "description",
  "budget",
  "currency",
  "pricing_type",
  "start_date",
  "deadline",
  "priority",
  "status",
  "created_at",
  "updated_at",
].join(",");

function pageParams(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 50), 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
  return { limit, offset };
}

export async function GET(request: Request) {
  try {
    const principal = await requireApiKey(request, ["projects:read"]);
    const { limit, offset } = pageParams(request);
    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const endpoint = new URL(`${url}/rest/v1/crm_projects`);
    endpoint.searchParams.set("select", PROJECT_FIELDS);
    endpoint.searchParams.set("owner_uid", `eq.${principal.ownerUid}`);
    endpoint.searchParams.set("order", "updated_at.desc");
    endpoint.searchParams.set("limit", String(limit));
    endpoint.searchParams.set("offset", String(offset));

    const res = await fetch(endpoint, {
      headers: adminServiceHeaders(serviceRoleKey),
      cache: "no-store",
    });
    if (!res.ok) {
      return apiError("UPSTREAM_ERROR", "Could not load projects.", 502);
    }

    return apiJson({
      data: await res.json(),
      pagination: { limit, offset },
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return apiError(error.code, error.message, error.status);
    }
    console.error("public projects api failed", error);
    return apiError("INTERNAL_ERROR", "Projects request failed.", 500);
  }
}
