"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export type TaskRow = {
  id: string;
  title?: string | null;
  status?: string | null;
  description?: string | null;
  is_read?: boolean | null;
  created_at?: string | null;
};

const STATUSES = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
] as const;

function normalizeStatus(status?: string | null) {
  const s = (status || "open").toLowerCase().replace(/\s+/g, "_");
  if (s === "pending" || s === "todo") return "open";
  if (s === "completed" || s === "complete") return "done";
  if (s === "in_progress" || s === "open" || s === "done") return s;
  return "open";
}

export function TasksClient({
  initial,
  isClient = false,
}: {
  initial: TaskRow[];
  isClient?: boolean;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const accentBtn = isClient
    ? "bg-client-accent hover:bg-client-header"
    : "bg-primary hover:bg-primary-dark";
  const activeRing = isClient
    ? "ring-2 ring-client-accent"
    : "ring-2 ring-primary";

  async function updateStatus(id: string, status: string) {
    setBusyId(id);
    try {
      const supabase = createClient();
      const payload: { status: string; is_read?: boolean } = { status };
      // is_read exists on client_tasks (see cloud_notification_repository)
      payload.is_read = true;
      const { error } = await supabase
        .from("client_tasks")
        .update(payload)
        .eq("id", id);
      if (error) {
        // Retry without is_read if column missing
        if (error.message?.includes("is_read")) {
          const { error: err2 } = await supabase
            .from("client_tasks")
            .update({ status })
            .eq("id", id);
          if (err2) throw err2;
        } else {
          throw error;
        }
      }
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status, is_read: true } : r,
        ),
      );
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function markRead(id: string) {
    const row = rows.find((r) => r.id === id);
    if (!row || row.is_read) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("client_tasks")
        .update({ is_read: true })
        .eq("id", id);
      if (error) {
        if (!error.message?.includes("is_read")) throw error;
        return;
      }
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_read: true } : r)),
      );
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
        <p className="font-semibold">No shared tasks yet</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {rows.map((r) => {
        const status = normalizeStatus(r.status);
        const unread = r.is_read === false;
        return (
          <li
            key={r.id}
            className={cn(
              "rounded-xl border bg-surface px-4 py-3",
              unread
                ? isClient
                  ? "border-client-accent/30 bg-client-surface"
                  : "border-primary/30 bg-primary/5"
                : "border-border",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy">{r.title || "Task"}</p>
                {r.description && (
                  <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                    {r.description}
                  </p>
                )}
              </div>
              {unread && (
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => void markRead(r.id)}
                  className="text-xs font-semibold text-text-muted hover:text-navy disabled:opacity-50"
                >
                  Mark read
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => void updateStatus(r.id, s.value)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-50",
                    status === s.value
                      ? cn("text-white", accentBtn, activeRing)
                      : "border border-border bg-background text-text-secondary hover:bg-surface",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
