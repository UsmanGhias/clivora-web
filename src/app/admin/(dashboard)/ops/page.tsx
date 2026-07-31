import { createClient } from "@/lib/supabase/server";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { OpsClient } from "./OpsClient";

export default async function AdminOpsPage() {
  const enabled =
    (await isFeatureEnabled("admin_ops_dashboard")) ||
    (await isFeatureEnabled("phase9_admin_ops"));

  let queue: Array<Record<string, unknown>> = [];
  let audits: Array<Record<string, unknown>> = [];
  const errors: string[] = [];

  if (enabled) {
    const supabase = await createClient();
    const { data: q, error: qErr } = await supabase
      .from("automation_webhook_queue")
      .select("id, event_type, status, attempts, last_error, created_at, next_attempt_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (qErr) {
      // OPS-001: never show a false empty state; surface a safe, actionable error.
      console.error("[admin/ops] queue query failed", qErr);
      errors.push(`Automation queue could not be loaded (${qErr.code ?? "error"}).`);
    }
    queue = (q ?? []) as Array<Record<string, unknown>>;

    const { data: a, error: aErr } = await supabase
      .from("audit_events")
      .select("id, action, entity_type, entity_id, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (aErr) {
      console.error("[admin/ops] audit query failed", aErr);
      errors.push(`Audit events could not be loaded (${aErr.code ?? "error"}).`);
    }
    audits = (a ?? []) as Array<Record<string, unknown>>;
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-extrabold">Ops health</h1>
        <p className="text-sm text-slate-600">Queue + audit console (Phase 9, flag-gated).</p>
      </div>
      {enabled ? (
        <OpsClient initialQueue={queue} initialAudits={audits} errors={errors} />
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Admin ops dashboard flag is off. Enable <code>admin_ops_dashboard</code> after Gates 1–12.
        </p>
      )}
    </div>
  );
}
