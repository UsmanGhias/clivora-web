"use client";

import { useMemo } from "react";
import { Landmark, Lock, Unlock } from "lucide-react";
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

export default function AdminEscrowPage() {
  const { data, loading } = useAdminData();
  const escrow = data?.escrow ?? [];

  const kpis = useMemo(() => {
    const total = escrow.reduce((s, e) => s + Number(e.amount ?? 0), 0);
    const inEscrow = escrow
      .filter((e) =>
        ["held", "in_escrow", "pending", "funded"].includes(String(e.status).toLowerCase()),
      )
      .reduce((s, e) => s + Number(e.amount ?? 0), 0);
    const released = escrow
      .filter((e) => ["released", "paid", "completed"].includes(String(e.status).toLowerCase()))
      .reduce((s, e) => s + Number(e.amount ?? 0), 0);
    return { total, inEscrow, released };
  }, [escrow]);

  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of escrow) {
      const s = String(e.status || "unknown").toLowerCase();
      map.set(s, (map.get(s) ?? 0) + 1);
    }
    return Array.from(map.entries());
  }, [escrow]);

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
        title="Escrow"
        subtitle="Milestone funds held and released on Connect."
        actions={<ExportImportAdd entity="Escrow" addLabel="Add Escrow" />}
      />

      <KpiGrid
        items={[
          {
            label: "Total Escrow",
            value: money(kpis.total),
            icon: <Landmark className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "In Escrow",
            value: money(kpis.inEscrow),
            icon: <Lock className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "Released",
            value: money(kpis.released),
            icon: <Unlock className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search escrow…" onReset={() => undefined} />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading escrow…
              </div>
            ) : (
              <AdminTable
                headers={["Escrow ID", "Title", "Amount", "Status", "Created", "Actions"]}
                footer={<span>Showing {escrow.length} escrow records</span>}
              >
                {escrow.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-500">
                      No escrow records found.
                    </td>
                  </tr>
                ) : (
                  escrow.map((e) => (
                    <tr key={String(e.id)} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3 font-mono text-xs font-bold text-slate-800">
                        {String(e.id).slice(0, 10)}
                      </td>
                      <td className="px-3 py-3 font-bold text-slate-900">{String(e.title || "Milestone")}</td>
                      <td className="px-3 py-3 font-semibold text-slate-800">
                        {money(Number(e.amount ?? 0), String(e.currency || "USD"))}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={String(e.status || "pending").replace(/_/g, " ")} />
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600">{fmtDate(String(e.created_at ?? ""))}</td>
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
            <SideCard title="Escrow by status">
              {byStatus.length === 0 ? (
                <p className="text-xs text-slate-500">No escrow status data yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {byStatus.map(([status, count]) => (
                    <li key={status} className="flex items-center justify-between">
                      <StatusPill status={status.replace(/_/g, " ")} />
                      <span className="font-bold text-slate-800">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
