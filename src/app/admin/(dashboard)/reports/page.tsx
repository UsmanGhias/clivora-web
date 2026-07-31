"use client";

import { FileText } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  AdminBtn,
  KpiGrid,
  PageLayout,
  SidePanel,
  SideCard,
  money,
  ErrorBanner,
} from "@/components/admin/ui";

export default function AdminReportsPage() {
  const { data, loading, refresh } = useAdminData();
  const o = data?.overview;

  function downloadCsv() {
    if (!data) return;
    const lines = [
      "metric,value",
      `total_users,${o?.totalUsers ?? 0}`,
      `freelancers,${o?.freelancers ?? 0}`,
      `clients,${o?.clients ?? 0}`,
      `active_projects,${o?.activeProjects ?? 0}`,
      `jobs,${o?.totalJobs ?? 0}`,
      `revenue,${o?.totalRevenue ?? 0}`,
      `escrow_held,${o?.escrowHeld ?? 0}`,
      `payouts,${o?.totalPayouts ?? 0}`,
      `tickets,${data.tickets ?? 0}`,
      `disputes,${data.disputes ?? 0}`,
      `exported_at,${data.meta?.exportedAt ?? new Date().toISOString()}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clivora-platform-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

      <AdminPageHeader
        title="Reports"
        subtitle="Live platform KPIs from the admin snapshot."
        actions={
          <div className="flex gap-2">
            <AdminBtn variant="outline" onClick={() => void refresh()}>
              Refresh
            </AdminBtn>
            <AdminBtn variant="primary" onClick={downloadCsv} disabled={!data}>
              Export CSV
            </AdminBtn>
          </div>
        }
      />

      <KpiGrid
        items={[
          {
            label: "Revenue",
            value: money(o?.totalRevenue ?? 0),
            icon: <FileText className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          { label: "Users", value: o?.totalUsers ?? 0 },
          { label: "Projects", value: o?.activeProjects ?? 0 },
          { label: "Payments", value: money(o?.totalPayments ?? 0) },
        ]}
      />

      <PageLayout
        main={
          <div>
            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading reports…
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-slate-900">Snapshot summary</h3>
                <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                  {[
                    ["Freelancers", o?.freelancers ?? 0],
                    ["Clients", o?.clients ?? 0],
                    ["Jobs", o?.totalJobs ?? 0],
                    ["Escrow held", money(o?.escrowHeld ?? 0)],
                    ["Payouts", money(o?.totalPayouts ?? 0)],
                    ["Support tickets", data?.tickets ?? 0],
                    ["Disputes", data?.disputes ?? 0],
                    ["Source", data?.source ?? "-"],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
                      <dd className="font-bold text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        }
        side={
          <SidePanel>
            <SideCard title="Export">
              <p className="text-xs text-slate-500">
                CSV export uses the same live counts as Overview — not template placeholders.
              </p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
