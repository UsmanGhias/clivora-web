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

type ProjectOption = { id: string; name: string; pricing_type?: string | null; budget?: number | null };

export function LiveTimer({
  ownerUid,
  projectName,
  projectId,
  projects = [],
  defaultHourlyRate = 0,
}: {
  ownerUid: string;
  projectName?: string;
  projectId?: string;
  projects?: ProjectOption[];
  defaultHourlyRate?: number;
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || projects[0]?.id || "");
  const startedAt = useRef<number | null>(null);
  const startedAtIso = useRef<string | null>(null);

  const selected =
    projects.find((p) => p.id === selectedProjectId) ||
    (projectId
      ? { id: projectId, name: projectName || "Project", pricing_type: "hourly", budget: defaultHourlyRate }
      : null);

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
      if (!startedAtIso.current) startedAtIso.current = new Date().toISOString();
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
      const minutes = Math.max(1, Math.round(elapsed / 60000));
      const rate =
        selected?.pricing_type === "hourly" && Number(selected.budget) > 0
          ? Number(selected.budget)
          : defaultHourlyRate > 0
            ? defaultHourlyRate
            : 0;
      const supabase = createClient();
      const { error } = await supabase.from("crm_time_entries").insert({
        owner_uid: ownerUid,
        description: `Timer · ${selected?.name || projectName || "Work session"}`,
        hours: Math.max(0.01, hours),
        minutes,
        hourly_rate: rate,
        date: new Date().toISOString().slice(0, 10),
        work_date: new Date().toISOString().slice(0, 10),
        status: "pending",
        approval_status: "pending",
        project_id: selectedProjectId || projectId || null,
        billable: true,
      });
      if (error) throw error;
      setElapsed(0);
      startedAt.current = null;
      startedAtIso.current = null;
      setRunning(false);
      setMsg(`Saved ${hours.toFixed(2)}h${rate > 0 ? ` @ ${rate}/hr` : ""}`);
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
      {projects.length > 0 ? (
        <label className="mt-3 block text-xs text-white/70">
          Project
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={running}
            className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="text-navy">
                {p.name}
                {p.pricing_type === "hourly" ? " · Hourly" : " · Fixed"}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="mt-2 text-sm text-white/70">{projectName || "General work"}</p>
      )}
      {startedAtIso.current && (
        <p className="mt-1 text-[11px] text-white/50">
          Started {new Date(startedAtIso.current).toLocaleTimeString()}
        </p>
      )}
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
          onClick={saveEntry}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save entry"}
        </button>
      </div>
      {msg && <p className="mt-3 text-xs text-white/80">{msg}</p>}
    </div>
  );
}
