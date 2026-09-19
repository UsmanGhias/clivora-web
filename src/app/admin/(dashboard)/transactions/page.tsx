"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
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

function nameOf(u: Record<string, unknown>) {
  return String(u.full_name || u.name || u.display_name || u.email || "-");
}

export default function AdminTransactionsPage() {
  const { data, loading } = useAdminData();
  const payments = useMemo(() => data?.payments ?? [], [data?.payments]);

  const volume = useMemo(
    () => payments.reduce((s, p) => s + Number(p.amount_usd ?? p.amount ?? 0), 0),
    [payments],
  );

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
        title="Transactions"
        subtitle="Payment ledger across the platform."
        actions={<ExportImportAdd entity="Transactions" />}
      />

      <KpiGrid
        items={[
          {
            label: "Transactions",
            value: payments.length,
            icon: <Activity className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          { label: "Volume", value: money(volume) },
          { label: "Escrow held", value: money(data?.overview.escrowHeld ?? 0) },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search transactions…" onReset={() => undefined} />
            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading transactions…
              </div>
            ) : (
              <AdminTable
                headers={["ID", "From", "Amount", "Status", "Date", "Actions"]}
                footer={<span>{payments.length} transactions</span>}
              >
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={String(p.id)} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3 font-mono text-xs font-bold">{String(p.id).slice(0, 10)}</td>
                      <td className="px-3 py-3">
                        <AvatarCell name={nameOf(p)} email={String(p.email ?? "")} />
                      </td>
                      <td className="px-3 py-3 font-semibold">{money(Number(p.amount_usd ?? 0))}</td>
                      <td className="px-3 py-3">
                        <StatusPill status={String(p.status || "pending")} />
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600">
                        {fmtDate(String(p.created_at ?? ""))}
                        <span className="ml-1 text-xs text-slate-400">{relative(String(p.created_at ?? ""))}</span>
                      </td>
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
            <SideCard title="Ledger summary">
              <p className="text-xs text-slate-500">Mirrors payment requests as platform transactions.</p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
