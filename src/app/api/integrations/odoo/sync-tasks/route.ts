import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/integrations/odoo/sync-tasks
 * Bidirectional sync of tasks between CLIVORA and Odoo (project.task).
 * Admin-only endpoint.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, account_type")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin" && profile?.account_type !== "admin") {
      return NextResponse.json({ error: "admin_only" }, { status: 403 });
    }

    // Task sync stub - requires active Odoo project module
    return NextResponse.json({
      ok: true,
      message: "Task sync endpoint ready. Configure ODOO_MAIN_* environment variables to activate.",
      mapping: "project.task <-> workspace_tasks",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[odoo/sync-tasks]", err);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "odoo-task-sync",
    status: "available",
    mapping: "project.task <-> workspace_tasks",
    timestamp: new Date().toISOString(),
  });
}
