"use client";

import { useEffect, useState } from "react";

type SyncDirection = "push" | "pull" | "both";
type OdooTarget = "main" | "social" | "legacy";

type OdooHealth = {
  target: OdooTarget;
  configTarget: OdooTarget | null;
  configured: boolean;
  ready: boolean;
  source: "env" | "db" | null;
  missing: string[];
  url: string | null;
  db: string | null;
  username: string | null;
  authOk: boolean | null;
  authError: string | null;
  partnerCount: number | null;
};

const TARGET_LABEL: Record<"main" | "social", string> = {
  main: "Main Odoo",
  social: "Social Odoo",
};

/** Admin Odoo health + bidirectional Contacts sync for Main and Social. */
export function OdooSyncButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [health, setHealth] = useState<Record<"main" | "social", OdooHealth> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formTarget, setFormTarget] = useState<"main" | "social">("main");
  const [formUrl, setFormUrl] = useState("");
  const [formDb, setFormDb] = useState("");
  const [formUser, setFormUser] = useState("");
  const [formKey, setFormKey] = useState("");
  const [syncTarget, setSyncTarget] = useState<"main" | "social">("main");
  const [forceWriteSync, setForceWriteSync] = useState(false);

  async function refreshStatus() {
    try {
      const res = await fetch("/api/integrations/odoo/sync-contacts", { cache: "no-store" });
      const json = (await res.json()) as {
        configured?: boolean;
        ready?: boolean;
        error?: string;
        code?: string;
        hint?: string;
        syncEnabled?: boolean;
        targets?: Record<"main" | "social", OdooHealth>;
        note?: string;
      };
      if (res.status === 401 || res.status === 403) {
        setMsg(json.error || "Admin sign-in required");
        return;
      }
      if (res.status >= 500 && json.code) {
        setMsg(json.error || `Admin auth error (${json.code})`);
        return;
      }
      setSyncEnabled(!!json.syncEnabled);
      setHealth(json.targets ?? null);
      const mainReady = json.targets?.main?.ready;
      const socialReady = json.targets?.social?.ready;
      if (mainReady || socialReady) {
        setMsg(json.note || "Odoo health checks are available.");
      } else if (!json.configured) {
        setMsg(json.hint || "Odoo is not configured. Save credentials below or set secrets.");
        setShowForm(true);
      } else {
        setMsg("Odoo credentials are present but health checks are not ready.");
      }
    } catch {
      setMsg("Could not reach Odoo status endpoint");
    }
  }

  useEffect(() => {
    void refreshStatus();
  }, []);

  async function saveCredentials() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/integrations/odoo/sync-contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: formTarget,
          url: formUrl,
          db: formDb,
          username: formUser,
          apiKey: formKey,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; saved?: boolean };
      if (!res.ok) {
        setMsg(json.error || "Could not save Odoo credentials");
        return;
      }
      setFormKey("");
      setShowForm(false);
      setMsg(`${TARGET_LABEL[formTarget]} credentials saved and verified.`);
      await refreshStatus();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function sync(direction: SyncDirection) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/integrations/odoo/sync-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direction,
          includeTracking: true,
          force: !syncEnabled || forceWriteSync,
          target: syncTarget,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        hint?: string;
        push?: { created?: number; updated?: number; linked?: number; total?: number };
        pull?: { created?: number; updated?: number; skipped?: number; total?: number };
        warnings?: string[];
        note?: string;
      };
      if (!res.ok) {
        setMsg(json.hint || json.error || "Sync failed");
        return;
      }
      const parts: string[] = [`${TARGET_LABEL[syncTarget]}:`];
      if (json.pull) {
        parts.push(
          `Odoo→CLIVORA created ${json.pull.created ?? 0}, updated ${json.pull.updated ?? 0} (scanned ${json.pull.total ?? 0})`,
        );
      }
      if (json.push) {
        parts.push(
          `CLIVORA→Odoo created ${json.push.created ?? 0}, updated ${json.push.updated ?? 0} (scanned ${json.push.total ?? 0})`,
        );
      }
      if (json.warnings?.length) {
        parts.push(`Warnings: ${json.warnings.join("; ")}`);
      }
      setMsg(parts.join(" · ") || json.note || "Sync complete");
      await refreshStatus();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setBusy(false);
    }
  }

  const targetReady = !!health?.[syncTarget]?.ready;
  const canSync = targetReady && (syncEnabled || forceWriteSync);

  return (
    <div className="space-y-3">
      <div
        className={`rounded-xl border p-3 text-xs ${
          syncEnabled
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        {syncEnabled ? (
          <>
            <strong>Write sync enabled.</strong> Health checks and Contacts push/pull are available
            for Main and Social Odoo databases.
          </>
        ) : (
          <>
            <strong>Write sync disabled.</strong> Health checks still run. Set{" "}
            <code>ODOO_SYNC_ENABLED=true</code> in secrets (or check Force below) to write.
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(["main", "social"] as const).map((target) => (
          <HealthCard key={target} label={TARGET_LABEL[target]} health={health?.[target] ?? null} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void refreshStatus()}
          className="inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
        >
          Refresh health
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
        >
          {showForm ? "Hide credentials" : "Save credentials"}
        </button>
      </div>

      {showForm && (
        <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-600">
            Target
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              value={formTarget}
              onChange={(e) => setFormTarget(e.target.value === "social" ? "social" : "main")}
            >
              <option value="main">Main (ODOO_MAIN_*)</option>
              <option value="social">Social (ODOO_SOCIAL_*)</option>
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">
            URL
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://your-company.odoo.com"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Database
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              value={formDb}
              onChange={(e) => setFormDb(e.target.value)}
              placeholder="odoo database name"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Username (email)
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              value={formUser}
              onChange={(e) => setFormUser(e.target.value)}
              placeholder="admin@example.com"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            API key (not interactive password)
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              value={formKey}
              onChange={(e) => setFormKey(e.target.value)}
              placeholder="Paste Odoo API key"
              autoComplete="off"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={busy || !formUrl.trim() || !formDb.trim() || !formUser.trim() || !formKey.trim()}
              onClick={() => void saveCredentials()}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Verify & save
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
        <h4 className="text-sm font-bold text-slate-900">Contacts sync</h4>
        <label className="block text-xs font-medium text-slate-600">
          Sync target
          <select
            className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            value={syncTarget}
            onChange={(e) => setSyncTarget(e.target.value === "social" ? "social" : "main")}
          >
            <option value="main">Main Odoo</option>
            <option value="social">Social Odoo</option>
          </select>
        </label>
        {!syncEnabled && (
          <label className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <input
              type="checkbox"
              checked={forceWriteSync}
              onChange={(event) => setForceWriteSync(event.target.checked)}
            />
            <span>Force write sync even though ODOO_SYNC_ENABLED is false.</span>
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy || !canSync}
            onClick={() => void sync("both")}
            className="inline-flex rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Syncing..." : "Two-way sync"}
          </button>
          <button
            type="button"
            disabled={busy || !canSync}
            onClick={() => void sync("pull")}
            className="inline-flex rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 disabled:opacity-50"
          >
            Odoo → CLIVORA
          </button>
          <button
            type="button"
            disabled={busy || !canSync}
            onClick={() => void sync("push")}
            className="inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 disabled:opacity-50"
          >
            CLIVORA → Odoo
          </button>
        </div>
        {!targetReady && (
          <p className="text-xs text-amber-700">
            {TARGET_LABEL[syncTarget]} must be Ready before sync. Use Refresh health / Save credentials.
          </p>
        )}
      </div>

      {msg && <p className="text-xs text-slate-600">{msg}</p>}
    </div>
  );
}

function HealthCard({ label, health }: { label: string; health: OdooHealth | null }) {
  if (!health) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-500">
        {label}: loading...
      </div>
    );
  }

  const status = health.ready ? "Ready" : health.configured ? "Auth failed" : "Not configured";
  const statusClass = health.ready
    ? "bg-emerald-50 text-emerald-700"
    : health.configured
      ? "bg-rose-50 text-rose-700"
      : "bg-amber-50 text-amber-800";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-900">{label}</h4>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClass}`}>
          {status}
        </span>
      </div>
      <div className="mt-2 space-y-1 text-xs text-slate-600">
        <p>
          Source: <strong>{health.source ?? "none"}</strong>
          {health.configTarget && health.configTarget !== health.target
            ? ` (fallback: ${health.configTarget})`
            : ""}
        </p>
        {health.url && <p>URL: {health.url.replace(/^https?:\/\//, "")}</p>}
        {health.db && <p>DB: {health.db}</p>}
        {health.username && <p>User: {health.username}</p>}
        {health.partnerCount != null && <p>Active partners: {health.partnerCount}</p>}
        {!health.configured && health.missing.length > 0 && (
          <p>Missing: {health.missing.slice(0, 4).join(", ")}</p>
        )}
        {health.authError && <p className="text-rose-700">{health.authError}</p>}
      </div>
    </div>
  );
}
