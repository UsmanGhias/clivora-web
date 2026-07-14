"use client";

import { useMemo, useState } from "react";
import { PlayCircle, Zap } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  ExportImportAdd,
  KpiGrid,
  FilterBar,
  AdminTable,
  StatusPill,
  RowActions,
  PageLayout,
  SidePanel,
  SideCard,
  fmtDate,
  ErrorBanner,
} from "@/components/admin/ui";

export default function AdminJobsPage() {
  const { data, loading, refresh } = useAdminData();
  const jobs = data?.jobs ?? [];
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const kpis = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter(
      (j) =>
        Boolean(j.is_open) &&
        String(j.moderation_status || "").toLowerCase() === "approved",
    ).length;
    return { total, active };
  }, [jobs]);

  async function moderate(id: string, action: "approve" | "hide") {
    setBusyId(id);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          table: "connect_need_posts",
          id,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Moderation failed");
      await refresh?.();
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
        title="Jobs"
        subtitle="Connect need posts and open opportunities."
        actions={<ExportImportAdd entity="Jobs" addLabel="Add Job" />}
      />

      <KpiGrid
        items={[
          {
            label: "Total",
            value: kpis.total,
            icon: <Zap className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Active",
            value: kpis.active,
            icon: <PlayCircle className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search jobs…" onReset={() => undefined} />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading jobs…
              </div>
            ) : (
              <AdminTable
                headers={["Job title", "Status", "Budget", "Created", "Actions"]}
                footer={<span>Showing {jobs.length} jobs</span>}
              >
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((j) => {
                    const mod = String(j.moderation_status || "pending");
                    const status = j.is_open ? mod : "closed";
                    return (
                      <tr key={String(j.id)} className="hover:bg-slate-50/80">
                        <td className="px-3 py-3">
                          <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-slate-900">{String(j.title || "Untitled job")}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">
                            {String(j.summary || "")}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill status={status.replace(/_/g, " ")} />
                        </td>
                        <td className="px-3 py-3 text-sm font-semibold text-slate-700">
                          {String(j.budget_band || "—")}
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">{fmtDate(String(j.created_at ?? ""))}</td>
                        <td className="px-3 py-3">
                          <RowActions
                            busy={busyId === String(j.id)}
                            onApprove={
                              mod !== "approved"
                                ? () => void moderate(String(j.id), "approve")
                                : undefined
                            }
                            onHide={
                              mod !== "hidden"
                                ? () => void moderate(String(j.id), "hide")
                                : undefined
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </AdminTable>
            )}
          </div>
        }
        side={
          <SidePanel>
            <SideCard title="Moderation">
              <p className="text-xs text-slate-500">
                New jobs publish as approved so freelancers can apply immediately. Use Hide to
                remove a listing from Connect.
              </p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
