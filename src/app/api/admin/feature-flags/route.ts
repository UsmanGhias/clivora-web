import { NextRequest } from "next/server";
import { adminErrorResponse, adminJson, requireAdminRequest } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      action?: "list" | "set" | "delete";
      key?: string;
      value?: unknown;
    };

    const { action } = body;
    await requireAdminRequest(req, { requireAal2: action !== "list" });

    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const headers = adminServiceHeaders(serviceRoleKey);

    if (action === "list") {
      const res = await fetch(
        `${url}/rest/v1/app_feature_flags?select=*&order=key.asc`,
        { headers, cache: "no-store" },
      );
      const flags = res.ok ? await res.json() : [];
      return adminJson({ flags });
    }

    if (action === "set") {
      const { key, value } = body;
      if (!key?.trim()) {
        return adminJson({ error: "key is required" }, { status: 400 });
      }
      const enabled =
        typeof value === "boolean"
          ? value
          : value && typeof value === "object" && "enabled" in (value as object)
            ? Boolean((value as { enabled?: boolean }).enabled)
            : Boolean(value);
      const payload = {
        key: key.trim(),
        enabled,
        updated_at: new Date().toISOString(),
      };
      const res = await fetch(`${url}/rest/v1/app_feature_flags`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return adminJson({ error: "Upsert failed" }, { status: 400 });
      }
      return adminJson({ ok: true, key: key.trim(), enabled });
    }

    if (action === "delete") {
      const { key } = body;
      if (!key?.trim()) {
        return adminJson({ error: "key is required" }, { status: 400 });
      }
      const res = await fetch(
        `${url}/rest/v1/app_feature_flags?key=eq.${encodeURIComponent(key.trim())}`,
        { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } },
      );
      if (!res.ok) {
        return adminJson({ error: "Delete failed" }, { status: 400 });
      }
      return adminJson({ ok: true });
    }

    return adminJson({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return adminErrorResponse(err, "Feature flags request failed");
  }
}
