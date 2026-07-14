"use client";

import { Ticket } from "lucide-react";
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

export default function AdminSupportPage() {
  const { data, loading } = useAdminData();
  const tickets = data?.tickets ?? 0;

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
        title="Support Tickets"
        subtitle="Customer support queue and ticket volume."
        actions={<ExportImportAdd entity="Tickets" addLabel="New Ticket" />}
      />

      <KpiGrid
        items={[
          {
            label: "Tickets",
            value: tickets,
            icon: <Ticket className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          { label: "Users", value: data?.overview.totalUsers ?? 0 },
          { label: "Disputes", value: data?.disputes ?? 0 },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search tickets…" onReset={() => undefined} />
            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading support…
              </div>
            ) : (
              <AdminTable
                headers={["Ticket", "Requester", "Status", "Updated", "Actions"]}
                footer={<span>{tickets} tickets on record</span>}
              >
                {tickets === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                      No support tickets yet.
                    </td>
                  </tr>
                ) : (
                  Array.from({ length: Math.min(tickets, 10) }).map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3 font-bold text-slate-900">#{1000 + i}</td>
                      <td className="px-3 py-3">
                        <AvatarCell name="Support user" email="user@clivora.com" />
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={i % 3 === 0 ? "pending" : "active"} />
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600">
                        {fmtDate(new Date().toISOString())}
                        <span className="ml-1 text-xs text-slate-400">{relative(new Date().toISOString())}</span>
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
            <SideCard title="Support overview">
              <p className="text-xs text-slate-500">
                Ticket count from platform snapshot. Revenue context {money(data?.overview.totalRevenue ?? 0)}.
              </p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
