"use client";

import { useState } from "react";
import { FileCheck2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContractRow = {
  id: string;
  title: string;
  status: "signed" | "sent";
  body: string;
  created_at: string | null;
  from_email: string | null;
  to_email: string | null;
};

export function ContractsClient({
  initial,
  isClient = false,
}: {
  initial: ContractRow[];
  isClient?: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(initial[0]?.id ?? null);
  const selected = initial.find((c) => c.id === selectedId) ?? null;
  const accent = isClient ? "text-client-accent" : "text-primary";
  const signedTone = "bg-emerald-100 text-emerald-800";
  const sentTone = isClient
    ? "bg-client-surface text-client-accent"
    : "bg-primary/10 text-primary";

  if (initial.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
        <FileText className="mx-auto h-10 w-10 text-text-muted" />
        <p className="mt-3 font-semibold text-navy">No contracts yet</p>
        <p className="mt-1 text-sm text-text-secondary">
          {isClient
            ? "When a freelancer sends an agreement, it will appear here."
            : "Send a contract from messages with a subject starting with [Contract]."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <ul className="space-y-2">
        {initial.map((c) => {
          const active = c.id === selectedId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left transition",
                  active
                    ? isClient
                      ? "border-client-accent/40 bg-client-surface"
                      : "border-primary/40 bg-primary/5"
                    : "border-border bg-surface hover:border-border",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-navy">{c.title}</p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      c.status === "signed" ? signedTone : sentTone,
                    )}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                  {c.body || "No terms provided."}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      {selected && (
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-navy">{selected.title}</h2>
              <p className="mt-1 text-xs text-text-muted">
                {selected.from_email && selected.to_email
                  ? `${selected.from_email} → ${selected.to_email}`
                  : selected.created_at
                    ? new Date(selected.created_at).toLocaleString()
                    : null}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase",
                selected.status === "signed" ? signedTone : sentTone,
              )}
            >
              {selected.status === "signed" ? (
                <FileCheck2 className="h-3.5 w-3.5" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              {selected.status}
            </span>
          </div>

          {selected.status === "signed" && (
            <p className={`mt-3 text-sm font-semibold ${accent}`}>
              This contract is signed and read-only.
            </p>
          )}

          <div className="mt-4 whitespace-pre-wrap rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary">
            {selected.body || "No terms provided."}
          </div>
        </div>
      )}
    </div>
  );
}
