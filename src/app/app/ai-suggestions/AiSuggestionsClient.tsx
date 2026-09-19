"use client";

import { useEffect, useState } from "react";
import {
  createAiSuggestion,
  listPendingAiSuggestions,
  reviewAiSuggestion,
  type AiSuggestion,
} from "@/lib/ai-suggestions";

export function AiSuggestionsClient() {
  const [rows, setRows] = useState<AiSuggestion[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setRows(await listPendingAiSuggestions());
  }

  useEffect(() => {
    void refresh().catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
  }, []);

  async function onSample() {
    setBusy(true);
    setError(null);
    try {
      await createAiSuggestion({
        entity_type: "customer",
        suggestion_type: "summary",
        payload: { summary: "Sample structured summary for review." },
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function onReview(id: string, accept: boolean) {
    setBusy(true);
    setError(null);
    try {
      await reviewAiSuggestion(id, accept);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => void onSample()}
        className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        Create sample suggestion
      </button>
      <ul className="space-y-2">
        {rows.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3"
          >
            <div className="text-sm">
              <p className="font-semibold text-navy">
                {s.suggestion_type} · {s.entity_type}
              </p>
              <pre className="mt-1 max-w-xl overflow-auto text-xs text-text-secondary">
                {JSON.stringify(s.payload, null, 2)}
              </pre>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void onReview(s.id, true)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-bold"
              >
                Accept
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void onReview(s.id, false)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-bold"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
