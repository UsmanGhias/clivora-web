"use client";

import { useMemo } from "react";
import { ScrollText } from "lucide-react";
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

export default function AdminAuditPage() {
  const { data, loading } = useAdminData();
  const events = useMemo(() => data?.events ?? [], [data?.events]);

  const audit = useMemo(
    () =>
      events.filter((e) => {
        const t = String(e.event_type ?? "").toLowerCase();
        return t.includes("audit") || t.startsWith("admin_") || t.includes("moderat");
      }),
    [events],
  );

  const rows = audit.length > 0 ? audit : events.slice(0, 40);

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
        title="Audit Logs"
        subtitle="Security and admin action trail."
        actions={<ExportImportAdd entity="Audit" />}
      />

      <KpiGrid
        items={[
          {
            label: "Audit events",
            value: audit.length || rows.length,
            icon: <ScrollText className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          { label: "All events", value: events.length },
          { label: "Source", value: data?.source ?? "—" },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search audit logs…" onReset={() => undefined} />
            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading audit logs…
              </div>
            ) : (
              <AdminTable
                headers={["Event", "Actor", "Type", "When", "Actions"]}
                footer={<span>Showing {rows.length} audit-related events</span>}
              >
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                      No audit events found.
                    </td>
                  </tr>
                ) : (
                  rows.map((e) => (
                    <tr key={String(e.id)} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3 font-bold text-slate-900">
                        {String(e.event_type ?? "event")}
                      </td>
                      <td className="px-3 py-3">
                        <AvatarCell
                          name={String(e.user_name || e.user_email || "system")}
                          email={String(e.user_email ?? "")}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={String(e.source || "system")} />
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
            <SideCard title="Audit scope">
              <p className="text-xs text-slate-500">
                Filtered from events where type includes audit / admin / moderation.
                Platform revenue reference: {money(data?.overview.totalRevenue ?? 0)}.
              </p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
