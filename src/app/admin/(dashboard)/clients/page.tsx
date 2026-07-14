"use client";

import { useMemo } from "react";
import { Building2, UserPlus, Users } from "lucide-react";
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
  relative,
  ErrorBanner,
} from "@/components/admin/ui";

function nameOf(u: Record<string, unknown>) {
  return String(u.full_name || u.name || u.display_name || u.email || "—");
}

export default function AdminClientsPage() {
  const { data, loading } = useAdminData();
  const clients = data?.clients ?? [];

  const kpis = useMemo(() => {
    const total = clients.length;
    const active = clients.filter((c) => !c.is_blocked && !c.is_restricted).length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newCount = clients.filter((c) => {
      const t = new Date(String(c.created_at ?? "")).getTime();
      return !Number.isNaN(t) && t >= weekAgo;
    }).length;
    return { total, active, newCount };
  }, [clients]);

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
        title="Clients"
        subtitle="Companies and buyers hiring on CLIVORA."
        actions={<ExportImportAdd entity="Clients" addLabel="Add Client" />}
      />

      <KpiGrid
        items={[
          {
            label: "Total",
            value: kpis.total,
            icon: <Users className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Active",
            value: kpis.active,
            icon: <Building2 className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "New",
            value: kpis.newCount,
            icon: <UserPlus className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
            sub: "Last 7 days",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search clients…" onReset={() => undefined} />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading clients…
              </div>
            ) : (
              <AdminTable
                headers={["Client", "Company / Email", "Status", "Joined", "Actions"]}
                footer={<span>Showing {clients.length} clients</span>}
              >
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  clients.map((c) => {
                    const status = c.is_blocked || c.is_restricted ? "suspended" : "active";
                    return (
                      <tr key={String(c.id)} className="hover:bg-slate-50/80">
                        <td className="px-3 py-3">
                          <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                        </td>
                        <td className="px-3 py-3">
                          <AvatarCell name={nameOf(c)} email={String(c.email ?? "")} />
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">
                          {String(c.company || c.email || "—")}
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill status={status} />
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">{fmtDate(String(c.created_at ?? ""))}</td>
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
            <SideCard title="Client activity">
              <ul className="space-y-2.5">
                {clients.slice(0, 6).map((c) => (
                  <li key={String(c.id)} className="flex items-start justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-800">{nameOf(c)}</div>
                      <div className="text-xs text-slate-500">{String(c.email ?? "")}</div>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">
                      {relative(String(c.updated_at ?? c.created_at ?? ""))}
                    </span>
                  </li>
                ))}
                {clients.length === 0 && (
                  <li className="text-xs text-slate-500">No recent client activity.</li>
                )}
              </ul>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
