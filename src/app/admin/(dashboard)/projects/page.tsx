"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderKanban, PlayCircle, Wallet } from "lucide-react";
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

export default function AdminProjectsPage() {
  const { data, loading } = useAdminData();
  const [activeTab, setActiveTab] = useState("all");
  const projects = useMemo(() => data?.projects ?? [], [data?.projects]);

  const kpis = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) =>
      ["in_progress", "active", "open"].includes(String(p.status).toLowerCase()),
    ).length;
    const completed = projects.filter((p) =>
      ["completed", "done", "closed"].includes(String(p.status).toLowerCase()),
    ).length;
    const budget = projects.reduce((s, p) => s + Number(p.budget ?? 0), 0);
    return { total, active, completed, budget };
  }, [projects]);

  const statuses = useMemo(() => {
    const set = new Set(projects.map((p) => String(p.status || "unknown").toLowerCase()));
    return Array.from(set);
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return projects;
    return projects.filter((p) => String(p.status).toLowerCase() === activeTab);
  }, [projects, activeTab]);

  const tabs = [
    { id: "all", label: "All", count: projects.length },
    ...statuses.map((s) => ({
      id: s,
      label: s.replace(/_/g, " "),
      count: projects.filter((p) => String(p.status).toLowerCase() === s).length,
    })),
  ];

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
        title="Projects"
        subtitle="CRM projects across clients and freelancers."
        actions={<ExportImportAdd entity="Projects" addLabel="Add Project" />}
      />

      <KpiGrid
        items={[
          {
            label: "Total",
            value: kpis.total,
            icon: <FolderKanban className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Active",
            value: kpis.active,
            icon: <PlayCircle className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "Completed",
            value: kpis.completed,
            icon: <CheckCircle2 className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Budget",
            value: money(kpis.budget),
            icon: <Wallet className="h-4 w-4" />,
            iconBg: "bg-amber-50 text-amber-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar
              searchPlaceholder="Search projects…"
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onReset={() => setActiveTab("all")}
            />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading projects…
              </div>
            ) : (
              <AdminTable
                headers={["Project", "Status", "Budget", "Deadline", "Created", "Actions"]}
                footer={<span>Showing {filtered.length} of {projects.length} projects</span>}
              >
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-500">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={String(p.id)} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-bold text-slate-900">{String(p.name || "Untitled")}</div>
                        <div className="text-xs text-slate-400">{String(p.id).slice(0, 8)}…</div>
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={String(p.status || "draft").replace(/_/g, " ")} />
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-800">
                        {money(Number(p.budget ?? 0), String(p.currency || "USD"))}
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600">{fmtDate(String(p.deadline ?? ""))}</td>
                      <td className="px-3 py-3 text-sm text-slate-600">{fmtDate(String(p.created_at ?? ""))}</td>
                      <td className="px-3 py-3">
                        <RowActions />
                      </td>
                    </tr>
                  ))
                )}
              </AdminTable>
            )}
          </div>
        }
        side={
          <SidePanel>
            <SideCard title="Project overview">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Active</span>
                  <span className="font-bold">{kpis.active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Completed</span>
                  <span className="font-bold">{kpis.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total budget</span>
                  <span className="font-bold text-teal-700">{money(kpis.budget)}</span>
                </div>
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
