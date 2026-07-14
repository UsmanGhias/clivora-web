"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function formatElapsed(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function LiveTimer({
  ownerUid,
  projectName,
  projectId,
}: {
  ownerUid: string;
  projectName?: string;
  projectId?: string;
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (startedAt.current != null) {
        setElapsed(Date.now() - startedAt.current);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  function toggle() {
    setMsg(null);
    if (!running) {
      startedAt.current = Date.now() - elapsed;
      setRunning(true);
      return;
    }
    setRunning(false);
  }

  async function saveEntry() {
    if (elapsed < 1000) {
      setMsg("Timer needs at least 1 second.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const hours = Math.round((elapsed / 3600000) * 100) / 100;
      const supabase = createClient();
      const { error } = await supabase.from("crm_time_entries").insert({
        owner_uid: ownerUid,
        description: `Timer · ${projectName || "Work session"}`,
        hours: Math.max(0.01, hours),
        minutes: Math.round(elapsed / 60000),
        date: new Date().toISOString().slice(0, 10),
        work_date: new Date().toISOString().slice(0, 10),
        status: "pending",
        approval_status: "pending",
        project_id: projectId || null,
      });
      if (error) throw error;
      setElapsed(0);
      startedAt.current = null;
      setRunning(false);
      setMsg(`Saved ${hours.toFixed(2)}h`);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not save timer");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-navy p-5 text-white shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-white/60">Current timer</p>
      <p className="mt-2 font-display text-3xl font-extrabold tracking-wider">
        {formatElapsed(elapsed)}
      </p>
      <p className="mt-2 text-sm text-white/70">{projectName || "General work"}</p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary bg-primary text-sm font-bold text-white hover:bg-primary-dark"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          disabled={busy || elapsed < 1000}
          onClick={() => void saveEntry()}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20 disabled:opacity-40"
        >
          {busy ? "Saving…" : "Save entry"}
        </button>
      </div>
      {msg && <p className="mt-3 text-xs text-primary-light">{msg}</p>}
    </div>
  );
}
