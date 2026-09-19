"use client";

import { Flag } from "lucide-react";
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

export default function AdminEventsPage() {
  const { data, loading } = useAdminData();
  const events = data?.events ?? [];

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
        title="Events"
        subtitle="Live platform event stream."
        actions={<ExportImportAdd entity="Events" />}
      />

      <KpiGrid
        items={[
          {
            label: "Events",
            value: events.length,
            icon: <Flag className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          { label: "Source", value: data?.source ?? "-" },
          { label: "Revenue tagged", value: money(data?.overview.totalRevenue ?? 0) },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search events…" onReset={() => undefined} />
            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading events…
              </div>
            ) : (
              <AdminTable
                headers={["Event", "User", "Amount", "When", "Actions"]}
                footer={<span>Showing {events.length} events</span>}
              >
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                      No events found.
                    </td>
                  </tr>
                ) : (
                  events.map((e) => (
                    <tr key={String(e.id)} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-bold text-slate-900">{String(e.event_type ?? "event")}</div>
                        <div className="text-xs text-slate-400">{String(e.source ?? "")}</div>
                      </td>
                      <td className="px-3 py-3">
                        <AvatarCell
                          name={String(e.user_name || e.user_email || "system")}
                          email={String(e.user_email ?? "")}
                        />
                      </td>
                      <td className="px-3 py-3 text-sm font-semibold text-slate-700">
                        {e.amount != null ? money(Number(e.amount)) : "-"}
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600">
                        {fmtDate(String(e.created_at ?? ""))}
                        <span className="ml-1 text-xs text-slate-400">{relative(String(e.created_at ?? ""))}</span>
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
            <SideCard title="Event stream">
              <div className="space-y-2">
                {events.slice(0, 5).map((e) => (
                  <div key={String(e.id)} className="flex items-center justify-between text-xs">
                    <StatusPill status={String(e.event_type ?? "event").slice(0, 18)} />
                    <span className="text-slate-400">{relative(String(e.created_at ?? ""))}</span>
                  </div>
                ))}
                {events.length === 0 && <p className="text-xs text-slate-500">No recent events.</p>}
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
