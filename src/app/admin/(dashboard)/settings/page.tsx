"use client";

import { useEffect, useState } from "react";
import { Database, Save, Shield, Network } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  AdminBtn,
  FilterBar,
  PageLayout,
  SidePanel,
  SideCard,
  StatusPill,
  ErrorBanner,
} from "@/components/admin/ui";
import { AdminApiKeysPanel } from "@/components/admin/AdminApiKeysPanel";
import { OdooSyncButton } from "@/components/app/OdooSyncButton";
import { site } from "@/lib/site";

export default function AdminSettingsPage() {
  const { data, loading, refresh } = useAdminData();
  const [activeTab, setActiveTab] = useState("general");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [autoProfiles, setAutoProfiles] = useState(true);
  const [autoNeeds, setAutoNeeds] = useState(true);
  const [flagBusy, setFlagBusy] = useState<string | null>(null);
  const flags = data?.flags ?? [];

  useEffect(() => {
    setAutoProfiles(data?.settings?.connect_auto_approve_profiles !== false);
    setAutoNeeds(data?.settings?.connect_auto_approve_needs !== false);
  }, [data?.settings]);

  async function saveConnectSettings() {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const posts = [
        { target: "profiles", enabled: autoProfiles },
        { target: "needs", enabled: autoNeeds },
      ];
      for (const p of posts) {
        const res = await fetch("/api/admin/moderation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "set_auto_approve", ...p }),
        });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(json.error || "Could not save settings");
      }
      setMsg("Connect auto-approve settings saved.");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleFlag(key: string, enabled: boolean) {
    setFlagBusy(key);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set", key, value: !enabled }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Could not update flag");
      setMsg(`Feature flag ${key} ${!enabled ? "enabled" : "disabled"}.`);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Flag update failed");
    } finally {
      setFlagBusy(null);
    }
  }

  return (
    <div>
      {data?.warning && (
        <ErrorBanner
          message={data.warning}
          onViewLogs={() => {
            window.location.href = "/admin/events";
          }}
        />
      )}
      {err && <ErrorBanner message={err} />}
      {msg && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {msg}
        </div>
      )}

      <AdminPageHeader
        title="System Settings"
        subtitle="Configure Connect defaults, integrations, and feature flags."
        actions={
          <AdminBtn variant="primary" onClick={() => void refresh()}>
            <Save className="h-3.5 w-3.5" /> Refresh
          </AdminBtn>
        }
      />

      <PageLayout
        main={
          <div>
            <FilterBar
              searchPlaceholder="Search settings…"
              tabs={[
                { id: "general", label: "General" },
                { id: "platform", label: "Platform" },
                { id: "email", label: "Email" },
                { id: "integrations", label: "Integrations" },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onReset={() => setActiveTab("general")}
            />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading settings…
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === "general" && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-2 text-sm font-bold text-slate-900">Site information</h3>
                    <p className="mb-4 text-sm text-slate-600">
                      Brand and support identity are fixed in deployment config (
                      <code>site.name</code> / <code>v{site.appVersion}</code>). Use Platform for
                      live Connect moderation defaults.
                    </p>
                    <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <dt className="text-xs font-semibold text-slate-500">Site name</dt>
                        <dd className="font-bold text-slate-900">CLIVORA</dd>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <dt className="text-xs font-semibold text-slate-500">Support email</dt>
                        <dd className="font-bold text-slate-900">contact@clivora.io</dd>
                      </div>
                    </dl>
                  </section>
                )}

                {activeTab === "platform" && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">Connect auto-approve</h3>
                    <p className="mb-4 text-sm text-slate-600">
                      When enabled, new Connect profiles and need posts skip the moderation queue.
                    </p>
                    <div className="space-y-3">
                      <Toggle
                        label="Auto-approve Connect profiles"
                        checked={autoProfiles}
                        onChange={setAutoProfiles}
                      />
                      <Toggle
                        label="Auto-approve Connect needs"
                        checked={autoNeeds}
                        onChange={setAutoNeeds}
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <AdminBtn
                        variant="primary"
                        disabled={busy}
                        onClick={() => void saveConnectSettings()}
                      >
                        <Save className="h-3.5 w-3.5" /> Save platform
                      </AdminBtn>
                    </div>
                  </section>
                )}

                {activeTab === "email" && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">Email (Resend-first)</h3>
                    <p className="mb-4 text-sm text-slate-600">
                      Delivery uses Supabase Edge Function secrets <code>RESEND_API_KEY</code> and{" "}
                      <code>RESEND_FROM</code>. Password reset redirects to the website{" "}
                      <code>/auth/reset-password</code>. Optional Gmail SMTP is dashboard-only.
                    </p>
                    <div className="mt-4 flex justify-end">
                      <AdminBtn
                        variant="primary"
                        href="https://supabase.com/dashboard/project/jtzjwgovqczlccyeujhq/functions"
                      >
                        Open Edge Function secrets
                      </AdminBtn>
                    </div>
                  </section>
                )}

                {activeTab === "integrations" && (
                  <div className="space-y-4">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <AdminApiKeysPanel />
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-start gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <Network className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Odoo Phase 1-2</h3>
                          <p className="mt-1 text-xs text-slate-500">
                            Read-only health checks for Main and Social Odoo databases. Write sync is
                            disabled by default and requires an explicit admin action. Credentials
                            prefer database secrets over env so rotated API keys apply immediately.
                          </p>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <OdooSyncButton />
                      </div>
                    </section>
                  </div>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-bold text-slate-900">Feature flags</h3>
                  {flags.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No rows in <code>app_feature_flags</code> (or table missing). This is live DB
                      state - not demo content.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {flags.map((f) => {
                        const key = String(f.key);
                        const enabled = Boolean(f.enabled ?? f.value);
                        return (
                          <li
                            key={String(f.id ?? f.key)}
                            className="flex items-center justify-between gap-3 py-2.5 text-sm"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-slate-800">{key}</div>
                              <div className="truncate text-xs text-slate-500">
                                {String(f.description || "")}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusPill status={enabled ? "active" : "inactive"} />
                              <AdminBtn
                                variant="outline"
                                disabled={flagBusy === key}
                                onClick={() => void toggleFlag(key, enabled)}
                              >
                                {enabled ? "Disable" : "Enable"}
                              </AdminBtn>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              </div>
            )}
          </div>
        }
        side={
          <SidePanel>
            <SideCard title="System Overview">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal-600" />
                  <span className="font-bold text-slate-800">v{site.appVersion}</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  <p>
                    Users: <strong>{data?.overview.totalUsers ?? "-"}</strong>
                  </p>
                  <p className="mt-1">
                    Source: <strong>{data?.source ?? "unavailable"}</strong>
                  </p>
                  <p className="mt-1 text-slate-500">
                    Storage % is not measured in-app - check Supabase dashboard for DB size.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <AdminBtn
                    variant="outline"
                    onClick={() => {
                      window.location.href = "/admin/events";
                    }}
                  >
                    <Database className="h-3.5 w-3.5" /> View events
                  </AdminBtn>
                </div>
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700"
    >
      {label}
      <span
        className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-teal-600" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${checked ? "left-4" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}
