import { NextRequest } from "next/server";
import { adminErrorResponse, adminJson, requireAdminRequest } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export const runtime = "nodejs";

const ALLOWED_STATUS = new Set(["open", "in_progress", "resolved", "closed"]);
const ALLOWED_PRIORITY = new Set(["low", "normal", "high", "urgent"]);

export async function POST(req: NextRequest) {
  try {
    await requireAdminRequest(req, { requireAal2: true });
    const { url, serviceRoleKey } = requireAdminServiceConfig();

    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      id?: string;
      status?: string;
      admin_notes?: string;
      priority?: string;
    };

    const action = String(body.action ?? "update");
    const id = String(body.id ?? "").trim();
    if (!id) return adminJson({ error: "id required" }, { status: 400 });

    if (action !== "update") {
      return adminJson({ error: "Unknown action" }, { status: 400 });
    }

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof body.status === "string" && body.status.trim()) {
      const status = body.status.trim().toLowerCase();
      if (!ALLOWED_STATUS.has(status)) {
        return adminJson({ error: "Invalid status" }, { status: 400 });
      }
      patch.status = status;
    }
    if (typeof body.admin_notes === "string") {
      patch.admin_notes = body.admin_notes;
    }
    if (typeof body.priority === "string" && body.priority.trim()) {
      const priority = body.priority.trim().toLowerCase();
      if (!ALLOWED_PRIORITY.has(priority)) {
        return adminJson({ error: "Invalid priority" }, { status: 400 });
      }
      patch.priority = priority;
    }
    if (Object.keys(patch).length <= 1) {
      return adminJson({ error: "No fields to update" }, { status: 400 });
    }

    const res = await fetch(
      `${url}/rest/v1/support_tickets?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: adminServiceHeaders(serviceRoleKey, "return=representation"),
        body: JSON.stringify(patch),
      },
    );
    if (!res.ok) {
      return adminJson({ error: "Failed to update support ticket" }, { status: 400 });
    }
    const rows = (await res.json()) as unknown[];
    return adminJson({ ok: true, ticket: rows[0] ?? null });
  } catch (e) {
    return adminErrorResponse(e, "Support ticket update failed");
  }
}
