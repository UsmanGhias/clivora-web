"use client";

import { FileText } from "lucide-react";
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
  money,
  fmtDate,
  relative,
  ErrorBanner,
} from "@/components/admin/ui";

export default function AdminReportsPage() {
  const { data, loading } = useAdminData();
  const o = data?.overview;

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
        subtitle="Exportable platform summaries and KPIs."
        actions={<ExportImportAdd entity="Reports" addLabel="Generate Report" />}
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
            <FilterBar searchPlaceholder="Search reports…" onReset={() => undefined} />
            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading reports…
              </div>
            ) : (
              <AdminTable
                headers={["Report", "Period", "Status", "Generated", "Actions"]}
                footer={<span>Built-in report templates</span>}
              >
                {[
                  { id: "rev", name: "Revenue summary", period: "Last 30 days" },
                  { id: "users", name: "User growth", period: "Last 30 days" },
                  { id: "escrow", name: "Escrow balance", period: "Current" },
                ].map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-3 py-3">
                      <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                    </td>
                    <td className="px-3 py-3">
                      <AvatarCell name={r.name} subtitle={r.period} />
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-600">{r.period}</td>
                    <td className="px-3 py-3">
                      <StatusPill status="active" />
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-600">
                      {fmtDate(new Date().toISOString())}
                      <span className="ml-1 text-xs text-slate-400">{relative(new Date().toISOString())}</span>
                    </td>
                    <td className="px-3 py-3">
                      <RowActions />
                    </td>
                  </tr>
                ))}
              </AdminTable>
            )}
          </div>
        }
        side={
          <SidePanel>
            <SideCard title="Report tips">
              <p className="text-xs text-slate-500">Use Export to download CSV snapshots of live KPIs.</p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
