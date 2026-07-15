"use client";

import { useMemo } from "react";
import { Banknote, CheckCircle2, Clock } from "lucide-react";
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
  ErrorBanner,
} from "@/components/admin/ui";

function nameOf(u: Record<string, unknown>) {
  return String(u.full_name || u.name || u.display_name || u.email || "—");
}

export default function AdminPayoutsPage() {
  const { data, loading } = useAdminData();
  const payments = useMemo(() => data?.payments ?? [], [data?.payments]);

  const payouts = useMemo(
    () =>
      payments.filter((p) =>
        ["approved", "paid", "released"].includes(String(p.status).toLowerCase()),
      ),
    [payments],
  );

  const kpis = useMemo(() => {
    const total = data?.overview.totalPayouts ?? payouts.reduce((s, p) => s + Number(p.amount_usd ?? 0), 0);
    const completed = payouts.filter((p) =>
      ["paid", "released"].includes(String(p.status).toLowerCase()),
    ).length;
    const pending = payments.filter((p) =>
      ["pending", "processing"].includes(String(p.status).toLowerCase()),
    ).length;
    return { total, completed, pending };
  }, [data?.overview.totalPayouts, payouts, payments]);

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
        title="Payouts"
        subtitle="Approved payments released to freelancers and vendors."
        actions={<ExportImportAdd entity="Payouts" addLabel="Record Payout" />}
      />

      <KpiGrid
        items={[
          {
            label: "Total",
            value: money(kpis.total),
            icon: <Banknote className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Completed",
            value: kpis.completed,
            icon: <CheckCircle2 className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Pending",
            value: kpis.pending,
            icon: <Clock className="h-4 w-4" />,
            iconBg: "bg-amber-50 text-amber-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search payouts…" onReset={() => undefined} />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading payouts…
              </div>
            ) : (
              <AdminTable
                headers={["Payout ID", "Recipient", "Amount", "Status", "Date", "Actions"]}
                footer={<span>Showing {payouts.length} approved payouts</span>}
              >
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-500">
                      No payouts found.
                    </td>
                  </tr>
                ) : (
                  payouts.map((p) => (
                    <tr key={String(p.id)} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3 font-mono text-xs font-bold text-slate-800">
                        {String(p.id).slice(0, 10)}
                      </td>
                      <td className="px-3 py-3">
                        <AvatarCell name={nameOf(p)} email={String(p.email ?? "")} />
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-800">
                        {money(Number(p.amount_usd ?? p.amount ?? 0))}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={String(p.status || "completed").replace(/_/g, " ")} />
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
            <SideCard title="Payout overview">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total payouts</span>
                  <span className="font-bold text-teal-700">{money(kpis.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Completed</span>
                  <span className="font-bold">{kpis.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending</span>
                  <span className="font-bold text-amber-600">{kpis.pending}</span>
                </div>
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
