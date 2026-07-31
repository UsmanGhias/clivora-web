"use client";

import { useEffect, useMemo, useState } from "react";

type ApiKeyRow = {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

const SCOPES = [
  { value: "contacts:read", label: "Contacts read" },
  { value: "projects:read", label: "Projects read" },
];

function formatDate(value: string | null) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function AdminApiKeysPanel() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [name, setName] = useState("CRM read-only integration");
  const [expiresAt, setExpiresAt] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["contacts:read", "projects:read"]);

  const activeKeys = useMemo(() => keys.filter((key) => !key.revokedAt), [keys]);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/api-keys", { cache: "no-store" });
      const json = (await res.json()) as { keys?: ApiKeyRow[]; error?: string };
      if (!res.ok) {
        setMessage(json.error || "Could not load API keys");
        return;
      }
      setKeys(json.keys ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load API keys");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function createKey() {
    setBusy(true);
    setMessage(null);
    setRawToken(null);
    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          scopes: selectedScopes,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });
      const json = (await res.json()) as { token?: string; error?: string; warning?: string };
      if (!res.ok) {
        setMessage(json.error || "Could not create API key");
        return;
      }
      setRawToken(json.token ?? null);
      setMessage(json.warning || "API key created. Copy the token now.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create API key");
    } finally {
      setBusy(false);
    }
  }

  async function revokeKey(id: string) {
    if (!confirm("Revoke this API key? Existing integrations using it will stop working.")) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/api-keys/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMessage(json.error || "Could not revoke API key");
        return;
      }
      await refresh();
      setMessage("API key revoked.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not revoke API key");
    } finally {
      setBusy(false);
    }
  }

  function toggleScope(scope: string) {
    setSelectedScopes((current) =>
      current.includes(scope) ? current.filter((item) => item !== scope) : [...current, scope],
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Public Integrations API</h3>
        <p className="mt-1 text-xs text-slate-500">
          Create read-only bearer tokens for server-to-server integrations. Tokens are hashed before
          storage and shown once.
        </p>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-slate-600">
          Key name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-slate-600">
          Expires at (optional)
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(event) => setExpiresAt(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          />
        </label>
        <div className="space-y-2 sm:col-span-2">
          <p className="text-xs font-medium text-slate-600">Scopes</p>
          <div className="flex flex-wrap gap-2">
            {SCOPES.map((scope) => (
              <label
                key={scope.value}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={selectedScopes.includes(scope.value)}
                  onChange={() => toggleScope(scope.value)}
                />
                {scope.label}
              </label>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <button
            type="button"
            disabled={busy || !name.trim() || selectedScopes.length === 0}
            onClick={() => void createKey()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Working..." : "Create API key"}
          </button>
        </div>
      </div>

      {rawToken && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-900">Copy this token now.</p>
          <textarea
            readOnly
            value={rawToken}
            className="mt-2 h-20 w-full rounded-lg border border-amber-200 bg-white p-2 font-mono text-xs text-slate-800"
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      )}

      {message && <p className="text-xs text-slate-600">{message}</p>}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Active keys ({activeKeys.length})
          </p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="text-xs font-semibold text-teal-700"
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="p-3 text-sm text-slate-500">Loading API keys...</p>
        ) : keys.length === 0 ? (
          <p className="p-3 text-sm text-slate-500">No API keys yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {keys.map((key) => (
              <li key={key.id} className="flex flex-col gap-2 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-slate-900">
                    {key.name}
                    {key.revokedAt && (
                      <span className="ml-2 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        Revoked
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Prefix <code>{key.keyPrefix}</code> · {key.scopes.join(", ")} · Last used{" "}
                    {formatDate(key.lastUsedAt)} · Expires {formatDate(key.expiresAt)}
                  </div>
                </div>
                {!key.revokedAt && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void revokeKey(key.id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-50"
                  >
                    Revoke
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
