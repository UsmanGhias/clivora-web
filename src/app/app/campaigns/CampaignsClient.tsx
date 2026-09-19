"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  addCampaignBlock,
  listCampaigns,
  publishCampaign,
  upsertCampaign,
  type Campaign,
} from "@/lib/campaigns";

export function CampaignsClient() {
  const [rows, setRows] = useState<Campaign[]>([]);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setRows(await listCampaigns());
  }

  useEffect(() => {
    void refresh().catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const id = await upsertCampaign({ title });
      await addCampaignBlock({
        campaign_id: id,
        block_type: "text",
        content: { text: title },
      });
      setTitle("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function onPublish(id: string) {
    setBusy(true);
    setError(null);
    try {
      await publishCampaign(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <form onSubmit={onCreate} className="flex flex-wrap gap-2">
        <input
          className="min-w-[14rem] flex-1 rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Campaign title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Campaign title"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          New draft
        </button>
      </form>
      <ul className="space-y-2">
        {rows.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3"
          >
            <div>
              <p className="font-semibold text-navy">{c.title}</p>
              <p className="text-xs text-text-muted">
                {c.status} · {c.platform}
                {c.ab_variant ? ` · variant ${c.ab_variant}` : ""}
              </p>
            </div>
            {c.status === "draft" || c.status === "failed" ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void onPublish(c.id)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-bold disabled:opacity-60"
              >
                Publish
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
