import { NextResponse } from "next/server";
import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import { listOdooSocialAccounts } from "@/lib/odoo-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/integrations/odoo/social/accounts
 * Lists all connected social media accounts in clivoraos.odoo.com
 */
export async function GET() {
  try {
    await requireAdmin({ requireAal2: false });
    const result = await listOdooSocialAccounts();
    return adminJson(result);
  } catch (error) {
    return adminErrorResponse(error, "Failed to load Odoo social accounts");
  }
}
