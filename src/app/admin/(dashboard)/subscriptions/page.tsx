"use client";

import { useMemo } from "react";
import { Wallet } from "lucide-react";
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

export default function AdminSubscriptionsPage() {
  const { data, loading } = useAdminData();
  const users = useMemo(() => data?.users ?? [], [data?.users]);

  const subs = useMemo(
    () =>
      users.filter((u) => {
        const plan = String(u.subscription_plan || u.plan || "").toLowerCase();
        return plan && plan !== "free" && plan !== "none";
      }),
    [users],
  );

  const pro = subs.filter((u) =>
    ["pro", "premium"].includes(String(u.subscription_plan || u.plan || "").toLowerCase()),
  ).length;

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
        title="Subscriptions"
        subtitle="Active plans and billing subscriptions."
        actions={<ExportImportAdd entity="Subscriptions" />}
      />

      <KpiGrid
        items={[
          {
            label: "Subscribers",
            value: subs.length,
            icon: <Wallet className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          { label: "Pro", value: pro, sub: "Paid plans" },
          { label: "Users", value: users.length, sub: "All accounts" },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search subscriptions…" onReset={() => undefined} />
            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading subscriptions…
              </div>
            ) : (
              <AdminTable
                headers={["User", "Plan", "Status", "Joined", "Actions"]}
                footer={<span>{subs.length} subscriptions</span>}
              >
                {subs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                      No subscriptions found.
                    </td>
                  </tr>
                ) : (
                  subs.map((u) => (
                    <tr key={String(u.id)} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3">
                        <AvatarCell name={nameOf(u)} email={String(u.email ?? "")} />
                      </td>
                      <td className="px-3 py-3 capitalize font-semibold text-slate-700">
                        {String(u.subscription_plan || u.plan || "pro")}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={u.is_blocked ? "suspended" : "active"} />
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600">
                        {fmtDate(String(u.updated_at ?? u.created_at ?? ""))}
                        <span className="ml-1 text-xs text-slate-400">{relative(String(u.updated_at ?? ""))}</span>
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
            <SideCard title="Subscription overview">
              <p className="text-xs text-slate-500">
                Derived from user plans. Revenue context: {money(data?.overview.totalRevenue ?? 0)}.
              </p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
