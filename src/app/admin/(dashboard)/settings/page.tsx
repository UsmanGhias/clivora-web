"use client";

import { useState } from "react";
import { Database, HardDrive, Save, Shield } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  AdminBtn,
  ExportImportAdd,
  FilterBar,
  PageLayout,
  SidePanel,
  SideCard,
  StatusPill,
  ErrorBanner,
} from "@/components/admin/ui";

export default function AdminSettingsPage() {
  const { data, loading } = useAdminData();
  const [activeTab, setActiveTab] = useState("general");
  const [siteName, setSiteName] = useState("CLIVORA");
  const [supportEmail, setSupportEmail] = useState("support@clivora.com");
  const [commission, setCommission] = useState("10");
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [freelancerSignup, setFreelancerSignup] = useState(true);
  const flags = data?.flags ?? [];

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

      <AdminPageHeader
        title="System Settings"
        subtitle="Configure platform defaults, email, and feature flags."
        actions={<ExportImportAdd entity="Settings" addLabel="Save Changes" />}
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
                    <h3 className="mb-4 text-sm font-bold text-slate-900">Site information</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Site name">
                        <input
                          value={siteName}
                          onChange={(e) => setSiteName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-400"
                        />
                      </Field>
                      <Field label="Support email">
                        <input
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-400"
                        />
                      </Field>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <AdminBtn variant="primary">
                        <Save className="h-3.5 w-3.5" /> Save general
                      </AdminBtn>
                    </div>
                  </section>
                )}

                {activeTab === "platform" && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">Platform</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Commission rate (%)">
                        <input
                          value={commission}
                          onChange={(e) => setCommission(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-400"
                        />
                      </Field>
                      <div className="space-y-3 sm:col-span-2">
                        <Toggle
                          label="Open registration"
                          checked={registrationOpen}
                          onChange={setRegistrationOpen}
                        />
                        <Toggle
                          label="Allow freelancer signup"
                          checked={freelancerSignup}
                          onChange={setFreelancerSignup}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <AdminBtn variant="primary">
                        <Save className="h-3.5 w-3.5" /> Save platform
                      </AdminBtn>
                    </div>
                  </section>
                )}

                {activeTab === "email" && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">Email</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="From name">
                        <input
                          defaultValue="CLIVORA"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-400"
                        />
                      </Field>
                      <Field label="From address">
                        <input
                          defaultValue="noreply@clivora.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-400"
                        />
                      </Field>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <AdminBtn variant="primary">
                        <Save className="h-3.5 w-3.5" /> Save email
                      </AdminBtn>
                    </div>
                  </section>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-bold text-slate-900">Feature flags</h3>
                  {flags.length === 0 ? (
                    <p className="text-sm text-slate-500">No feature flags loaded.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {flags.map((f) => (
                        <li key={String(f.id ?? f.key)} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800">{String(f.key)}</div>
                            <div className="truncate text-xs text-slate-500">{String(f.description || "")}</div>
                          </div>
                          <StatusPill status={f.value ? "active" : "inactive"} />
                        </li>
                      ))}
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
                  <span className="font-bold text-slate-800">v2.10.5</span>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <HardDrive className="h-3.5 w-3.5" /> Storage
                    </span>
                    <span className="font-semibold">42%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[42%] rounded-full bg-teal-500" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <AdminBtn variant="outline">
                    <Database className="h-3.5 w-3.5" /> Run backup
                  </AdminBtn>
                  <AdminBtn variant="dark">Download backup</AdminBtn>
                </div>
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</span>
      {children}
    </label>
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
