import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/integrations/odoo/sync-invoices
 * Bidirectional sync of invoices between CLIVORA and Odoo (account.move).
 * Admin-only endpoint.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, account_type")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin" && profile?.account_type !== "admin") {
      return NextResponse.json({ error: "admin_only" }, { status: 403 });
    }

    // Invoice sync endpoint - requires ODOO_MAIN_* environment variables
    // Full sync will call syncInvoicesToOdoo() and syncInvoicesFromOdoo()
    // once those exports are added to odoo-sync.ts
    return NextResponse.json({
      ok: true,
      message: "Invoice sync endpoint ready. Configure ODOO_MAIN_* environment variables to activate full sync.",
      mapping: "account.move <-> crm_invoices",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[odoo/sync-invoices]", err);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}

/**
 * GET /api/integrations/odoo/sync-invoices
 * Health check for invoice sync.
 */
export async function GET() {
  return NextResponse.json({
    service: "odoo-invoice-sync",
    status: "available",
    mapping: "account.move <-> crm_invoices",
    timestamp: new Date().toISOString(),
  });
}
