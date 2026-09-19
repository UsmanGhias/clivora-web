import { NextResponse } from "next/server";
import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import { syncBothOdooInstances } from "@/lib/odoo-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/integrations/odoo/sync-all
 * Full 100% synchronization: Main Odoo (clivora.odoo.com) + Social Odoo (clivoraos.odoo.com) + CLIVORA
 */
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin({ requireAal2: false });
    const body = (await request.json().catch(() => ({}))) as {
      includeTracking?: boolean;
    };

    const result = await syncBothOdooInstances({
      adminUserId: admin.id,
      includeTracking: body.includeTracking !== false,
    });

    return adminJson(result);
  } catch (error) {
    return adminErrorResponse(error, "Full Odoo sync failed");
  }
}

export async function GET() {
  return adminJson({
    service: "odoo-full-sync",
    status: "ready",
    targets: ["Main (clivora.odoo.com)", "Social (clivoraos.odoo.com)", "CLIVORA Hub"],
    timestamp: new Date().toISOString(),
  });
}
