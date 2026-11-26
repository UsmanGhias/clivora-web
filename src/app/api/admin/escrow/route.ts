import { NextRequest } from "next/server";
import { adminErrorResponse, adminJson, requireAdminRequest } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      action?: "admin_release" | "list_milestones";
      milestoneId?: string;
      requestId?: string;
      amount?: number;
      currency?: string;
      notes?: string;
    };

    const { action } = body;
    await requireAdminRequest(req, { requireAal2: action !== "list_milestones" });

    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const headers = adminServiceHeaders(serviceRoleKey);

    if (action === "list_milestones") {
      const res = await fetch(
        `${url}/rest/v1/connect_milestones?select=*&order=created_at.desc&limit=100`,
        { headers, cache: "no-store" },
      );
      const milestones = res.ok ? await res.json() : [];
      return adminJson({ milestones });
    }

    if (action === "admin_release") {
      return adminJson(
        { error: "Live escrow release is disabled until the transactional funds RPC is deployed." },
        { status: 410 },
      );
    }

    return adminJson({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return adminErrorResponse(err, "Escrow admin request failed");
  }
}
