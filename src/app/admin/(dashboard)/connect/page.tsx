"use client";

import { useMemo, useState } from "react";
import { Network, Send, UserCircle2, Zap } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  ExportImportAdd,
  KpiGrid,
  FilterBar,
  AdminTable,
  StatusPill,
  AvatarCell,
  RowActions,
  PageLayout,
  SidePanel,
  SideCard,
  fmtDate,
  ErrorBanner,
} from "@/components/admin/ui";

function nameOf(u: Record<string, unknown>) {
  return String(
    u.display_title || u.full_name || u.name || u.display_name || u.headline || u.email || "—",
  );
}

export default function AdminConnectPage() {
  const { data, loading, refresh } = useAdminData();
  const [activeTab, setActiveTab] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const connect = data?.connect;
  const profiles = connect?.profiles ?? [];
  const needs = connect?.needs ?? [];
  const requests = connect?.requests ?? [];

  const connections = useMemo(() => {
    return [
      ...profiles.map((p) => ({ kind: "profile" as const, row: p })),
      ...needs.map((n) => ({ kind: "need" as const, row: n })),
      ...requests.map((r) => ({ kind: "request" as const, row: r })),
    ];
  }, [profiles, needs, requests]);

  const kpis = {
    connections: connections.length,
    profiles: profiles.length,
    needs: needs.length,
    requests: requests.length,
  };

  async function moderate(
    table: "connect_profiles" | "connect_need_posts",
    id: string,
    action: "approve" | "hide" | "verify",
  ) {
    setBusyId(id);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          table,
          id,
          verify: action === "verify",
          verified: true,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Moderation failed");
      await refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Moderation failed");
    } finally {
      setBusyId(null);
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
      {actionError && <ErrorBanner message={actionError} />}

      <AdminPageHeader
        title="Connect"
        subtitle="Profiles, needs, and connection requests."
        actions={<ExportImportAdd entity="Connect" addLabel="Add Connection" />}
      />

      <KpiGrid
        items={[
          {
            label: "Connections",
            value: kpis.connections,
            icon: <Network className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Profiles",
            value: kpis.profiles,
            icon: <UserCircle2 className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "Needs",
            value: kpis.needs,
            icon: <Zap className="h-4 w-4" />,
            iconBg: "bg-violet-50 text-violet-600",
          },
          {
            label: "Requests",
            value: kpis.requests,
            icon: <Send className="h-4 w-4" />,
            iconBg: "bg-amber-50 text-amber-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar
              searchPlaceholder="Search connect…"
              tabs={[
                { id: "all", label: "All Connections", count: kpis.connections },
                { id: "profiles", label: "Profiles", count: kpis.profiles },
                { id: "needs", label: "Needs", count: kpis.needs },
                { id: "requests", label: "Requests", count: kpis.requests },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onReset={() => setActiveTab("all")}
            />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading connect data…
              </div>
            ) : (
              <>
                {(activeTab === "all" || activeTab === "profiles") && (
                  <div className="mb-4">
                    {activeTab === "all" && (
                      <h3 className="mb-2 text-sm font-bold text-slate-800">Profiles</h3>
                    )}
                    <AdminTable
                      headers={["Profile", "Headline", "Status", "Joined", "Actions"]}
                      footer={<span>{profiles.length} profiles</span>}
                    >
                      {profiles.length === 0 ? (
                        <EmptyRows cols={6} />
                      ) : (
                        profiles.map((p) => {
                          const mod = String(p.moderation_status || "pending");
                          return (
                            <tr key={String(p.id)} className="hover:bg-slate-50/80">
                              <td className="px-3 py-3">
                                <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                              </td>
                              <td className="px-3 py-3">
                                <AvatarCell
                                  name={nameOf(p)}
                                  subtitle={p.is_verified ? "Verified" : undefined}
                                />
                              </td>
                              <td className="max-w-[200px] truncate px-3 py-3 text-sm text-slate-600">
                                {String(p.headline || "—")}
                              </td>
                              <td className="px-3 py-3">
                                <StatusPill status={mod.replace(/_/g, " ")} />
                              </td>
                              <td className="px-3 py-3 text-sm text-slate-600">
                                {fmtDate(String(p.created_at ?? ""))}
                              </td>
                              <td className="px-3 py-3">
                                <RowActions
                                  busy={busyId === String(p.id)}
                                  onApprove={
                                    mod !== "approved"
                                      ? () => void moderate("connect_profiles", String(p.id), "approve")
                                      : undefined
                                  }
                                  onVerify={
                                    !p.is_verified
                                      ? () => void moderate("connect_profiles", String(p.id), "verify")
                                      : undefined
                                  }
                                  onHide={
                                    mod !== "hidden"
                                      ? () => void moderate("connect_profiles", String(p.id), "hide")
                                      : undefined
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </AdminTable>
                  </div>
                )}

                {(activeTab === "all" || activeTab === "needs") && (
                  <div className="mb-4">
                    {activeTab === "all" && (
                      <h3 className="mb-2 text-sm font-bold text-slate-800">Needs</h3>
                    )}
                    <AdminTable
                      headers={["Need", "Budget", "Status", "Created", "Actions"]}
                      footer={<span>{needs.length} needs</span>}
                    >
                      {needs.length === 0 ? (
                        <EmptyRows cols={6} />
                      ) : (
                        needs.map((n) => {
                          const mod = String(n.moderation_status || "pending");
                          const status = n.is_open ? mod : "closed";
                          return (
                            <tr key={String(n.id)} className="hover:bg-slate-50/80">
                              <td className="px-3 py-3">
                                <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                              </td>
                              <td className="px-3 py-3 font-bold text-slate-900">
                                {String(n.title || "Need")}
                              </td>
                              <td className="px-3 py-3 text-sm font-semibold text-slate-700">
                                {String(n.budget_band || "—")}
                              </td>
                              <td className="px-3 py-3">
                                <StatusPill status={String(status).replace(/_/g, " ")} />
                              </td>
                              <td className="px-3 py-3 text-sm text-slate-600">
                                {fmtDate(String(n.created_at ?? ""))}
                              </td>
                              <td className="px-3 py-3">
                                <RowActions
                                  busy={busyId === String(n.id)}
                                  onApprove={
                                    mod !== "approved"
                                      ? () => void moderate("connect_need_posts", String(n.id), "approve")
                                      : undefined
                                  }
                                  onHide={
                                    mod !== "hidden"
                                      ? () => void moderate("connect_need_posts", String(n.id), "hide")
                                      : undefined
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </AdminTable>
                  </div>
                )}

                {(activeTab === "all" || activeTab === "requests") && (
                  <div>
                    {activeTab === "all" && (
                      <h3 className="mb-2 text-sm font-bold text-slate-800">Requests</h3>
                    )}
                    <AdminTable
                      headers={["Request ID", "From → To", "Status", "Created", "Actions"]}
                      footer={<span>{requests.length} requests</span>}
                    >
                      {requests.length === 0 ? (
                        <EmptyRows cols={6} />
                      ) : (
                        requests.map((r) => (
                          <tr key={String(r.id)} className="hover:bg-slate-50/80">
                            <td className="px-3 py-3">
                              <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                            </td>
                            <td className="px-3 py-3 font-mono text-xs font-bold text-slate-800">
                              {String(r.id).slice(0, 10)}
                            </td>
                            <td className="px-3 py-3 text-xs text-slate-600">
                              {String(r.from_user_id ?? "—").slice(0, 8)} →{" "}
                              {String(r.to_user_id ?? "—").slice(0, 8)}
                            </td>
                            <td className="px-3 py-3">
                              <StatusPill status={String(r.status || "pending").replace(/_/g, " ")} />
                            </td>
                            <td className="px-3 py-3 text-sm text-slate-600">
                              {fmtDate(String(r.created_at ?? ""))}
                            </td>
                            <td className="px-3 py-3">
                              <RowActions />
                            </td>
                          </tr>
                        ))
                      )}
                    </AdminTable>
                  </div>
                )}
              </>
            )}
          </div>
        }
        side={
          <SidePanel>
            <SideCard title="Connection overview">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Profiles</span>
                  <span className="font-bold">{kpis.profiles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Needs</span>
                  <span className="font-bold">{kpis.needs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Requests</span>
                  <span className="font-bold">{kpis.requests}</span>
                </div>
                <div className="mt-2 border-t border-slate-100 pt-2 flex justify-between">
                  <span className="text-slate-500">All</span>
                  <span className="font-bold text-teal-700">{kpis.connections}</span>
                </div>
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}

function EmptyRows({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="px-3 py-10 text-center text-sm text-slate-500">
        No rows found.
      </td>
    </tr>
  );
}
