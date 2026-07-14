"use client";

import { useMemo } from "react";
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
  money,
  fmtDate,
  ErrorBanner,
} from "@/components/admin/ui";

export default function AdminJobsPage() {
  const { data, loading } = useAdminData();
  const jobs = data?.jobs ?? [];

  const kpis = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter((j) =>
      ["open", "active", "published"].includes(String(j.status).toLowerCase()),
    ).length;
    return { total, active };
  }, [jobs]);

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
                headers={["Job title", "Status", "Budget range", "Created", "Actions"]}
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
                    const min = Number(j.budget_min ?? 0);
                    const max = Number(j.budget_max ?? 0);
                    const range =
                      min || max
                        ? `${money(min)} – ${money(max)}`
                        : "—";
                    return (
                      <tr key={String(j.id)} className="hover:bg-slate-50/80">
                        <td className="px-3 py-3">
                          <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-slate-900">{String(j.title || "Untitled job")}</div>
                          <div className="text-xs text-slate-400">{String(j.category || j.budget_type || "")}</div>
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill status={String(j.status || "draft").replace(/_/g, " ")} />
                        </td>
                        <td className="px-3 py-3 text-sm font-semibold text-slate-700">{range}</td>
                        <td className="px-3 py-3 text-sm text-slate-600">{fmtDate(String(j.created_at ?? ""))}</td>
                        <td className="px-3 py-3">
                          <RowActions />
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
            <SideCard title="Jobs by category">
              <p className="text-xs text-slate-500">Jobs by category placeholder — category charts coming soon.</p>
              <ul className="mt-3 space-y-2 text-sm">
                {["Design", "Development", "Marketing", "Writing"].map((c) => (
                  <li key={c} className="flex items-center justify-between">
                    <span className="text-slate-600">{c}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">—</span>
                  </li>
                ))}
              </ul>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
