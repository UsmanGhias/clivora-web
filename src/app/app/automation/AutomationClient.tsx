"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  enqueueAutomationJob,
  listAutomationRules,
  upsertAutomationRule,
  type AutomationRule,
} from "@/lib/automation-rules";

export function AutomationClient() {
  const [rows, setRows] = useState<AutomationRule[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setRows(await listAutomationRules());
  }

  useEffect(() => {
    void refresh().catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const id = await upsertAutomationRule({
        name,
        trigger_type: "manual",
        action_type: "webhook_queue",
        enabled: false,
      });
      await enqueueAutomationJob({
        rule_id: id,
        payload: { note: "rule_created" },
        idempotency_key: `rule-create-${id}`,
      });
      setName("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <form onSubmit={onCreate} className="flex flex-wrap gap-2">
        <input
          className="min-w-[12rem] flex-1 rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Rule name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Rule name"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          Add rule
        </button>
      </form>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            <p className="font-semibold text-navy">{r.name}</p>
            <p className="text-text-muted">
              {r.trigger_type} → {r.action_type} · {r.enabled ? "enabled" : "disabled"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
