"use client";

import { useMemo } from "react";
import { CheckCircle2, Clock, Send } from "lucide-react";
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

export default function AdminProposalsPage() {
  const { data, loading } = useAdminData();
  const proposals = data?.proposals ?? [];

  const kpis = useMemo(() => {
    const total = proposals.length;
    const pending = proposals.filter((p) =>
      ["pending", "submitted", "review"].includes(String(p.status).toLowerCase()),
    ).length;
    const accepted = proposals.filter((p) =>
      ["accepted", "hired", "approved"].includes(String(p.status).toLowerCase()),
    ).length;
    return { total, pending, accepted };
  }, [proposals]);

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
        title="Proposals"
        subtitle="Freelancer proposals on Connect needs."
        actions={<ExportImportAdd entity="Proposals" addLabel="Add Proposal" />}
      />

      <KpiGrid
        items={[
          {
            label: "Total",
            value: kpis.total,
            icon: <Send className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Pending",
            value: kpis.pending,
            icon: <Clock className="h-4 w-4" />,
            iconBg: "bg-amber-50 text-amber-600",
          },
          {
            label: "Accepted",
            value: kpis.accepted,
            icon: <CheckCircle2 className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search proposals…" onReset={() => undefined} />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading proposals…
              </div>
            ) : (
              <AdminTable
                headers={["Proposal ID", "Status", "Amount", "Submitted", "Actions"]}
                footer={<span>Showing {proposals.length} proposals</span>}
              >
                {proposals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                      No proposals found.
                    </td>
                  </tr>
                ) : (
                  proposals.map((p) => (
                    <tr key={String(p.id)} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-mono text-xs font-bold text-slate-800">
                          {String(p.id).slice(0, 12)}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={String(p.status || "pending").replace(/_/g, " ")} />
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-800">
                        {money(Number(p.amount ?? 0), String(p.currency || "USD"))}
                      </td>
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
            <SideCard title="Proposal overview">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total</span>
                  <span className="font-bold">{kpis.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending</span>
                  <span className="font-bold text-amber-600">{kpis.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Accepted</span>
                  <span className="font-bold text-teal-700">{kpis.accepted}</span>
                </div>
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
