"use client";

import Link from "next/link";
import {
  Briefcase,
  CreditCard,
  FolderKanban,
  RefreshCw,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminBtn,
  AdminPageHeader,
  ErrorBanner,
  KpiGrid,
  PageLayout,
  SideCard,
  SidePanel,
  money,
  relative,
} from "@/components/admin/ui";

export default function AdminOverviewPage() {
  const { data, loading, error, refresh } = useAdminData();
  const o = data?.overview;
  const hasLive = Boolean(data && data.source !== "degraded");

  return (
    <div>
      {(data?.warning || error) && (
        <ErrorBanner
          message={data?.warning || error || "Could not load live platform stats"}
          onViewLogs={() => {
            window.location.href = "/admin/events";
          }}
        />
      )}

      <AdminPageHeader
        title="Overview"
        subtitle="Platform health from live Supabase counts — no demo metrics."
        actions={
          <>
            <AdminBtn variant="primary" onClick={() => void refresh()}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </AdminBtn>
            <AdminBtn
              variant="dark"
              onClick={() => {
                const blob = new Blob(
                  [
                    JSON.stringify(
                      {
                        exportedAt: new Date().toISOString(),
                        purpose: "platform-migration-snapshot",
                        overview: o ?? null,
                        users: data?.users ?? [],
                        freelancers: data?.freelancers ?? [],
                        clients: data?.clients ?? [],
                        customers: data?.customers ?? [],
                        projects: data?.projects ?? [],
                        invoices: data?.invoices ?? [],
                        payments: data?.payments ?? [],
                        jobs: data?.jobs ?? [],
                        proposals: data?.proposals ?? [],
                        connect: data?.connect ?? null,
                        events: data?.events ?? [],
                      },
                      null,
                      2,
                    ),
                  ],
                  { type: "application/json" },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `clivora-platform-export-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export full snapshot
            </AdminBtn>
          </>
        }
      />

      {!hasLive && !loading && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Live platform snapshot is unavailable. Numbers below stay at zero until{" "}
          <code className="rounded bg-white px-1">/api/admin/platform</code> succeeds.
        </div>
      )}

      <KpiGrid
        items={[
          {
            label: "Total Revenue",
            value: money(o?.totalRevenue ?? 0),
            icon: <Wallet className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Total Users",
            value: o?.totalUsers ?? 0,
            icon: <Users className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "Freelancers",
            value: o?.freelancers ?? 0,
            icon: <Briefcase className="h-4 w-4" />,
            iconBg: "bg-violet-50 text-violet-600",
          },
          {
            label: "Active Projects",
            value: o?.activeProjects ?? 0,
            icon: <FolderKanban className="h-4 w-4" />,
            iconBg: "bg-orange-50 text-orange-600",
          },
          {
            label: "Total Jobs",
            value: o?.totalJobs ?? 0,
            icon: <Zap className="h-4 w-4" />,
            iconBg: "bg-cyan-50 text-cyan-600",
          },
          {
            label: "Total Payments",
            value: money(o?.totalPayments ?? 0),
            icon: <CreditCard className="h-4 w-4" />,
            iconBg: "bg-pink-50 text-pink-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-bold">Revenue snapshot</h3>
                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <Metric label="Total Revenue" value={money(o?.totalRevenue ?? 0)} />
                  <Metric label="Platform Fee" value={money(o?.platformFee ?? 0)} />
                  <Metric label="Escrow Held" value={money(o?.escrowHeld ?? 0)} />
                  <Metric label="Total Payouts" value={money(o?.totalPayouts ?? 0)} />
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Figures are live database aggregates. Charts stay off until a daily time-series
                  table exists — no fabricated curves.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-bold">User snapshot</h3>
                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <Metric label="Total Users" value={String(o?.totalUsers ?? 0)} />
                  <Metric label="New Users" value={String(o?.newUsers ?? 0)} />
                  <Metric label="Freelancers" value={String(o?.freelancers ?? 0)} />
                  <Metric label="New Freelancers" value={String(o?.newFreelancers ?? 0)} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-bold">Recent Activity</h3>
              {(data?.events?.length ?? 0) === 0 ? (
                <p className="text-sm text-slate-500">No recent events in the database.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {(data?.events ?? []).slice(0, 8).map((ev) => (
                    <li
                      key={String(ev.id)}
                      className="flex items-start justify-between gap-3 py-2.5 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {String(ev.eventType ?? "event")}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {String(ev.userName || ev.userEmail || "—")}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] text-slate-400">
                        {ev.createdAt ? relative(String(ev.createdAt)) : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/admin/events"
                className="mt-3 inline-block text-sm font-semibold text-teal-700"
              >
                View all activity →
              </Link>
            </div>
          </div>
        }
        side={
          <SidePanel>
            <SideCard title="Quick links">
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/admin/users" className="rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  Users
                </Link>
                <Link href="/admin/payments" className="rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  Payments
                </Link>
                <Link href="/admin/connect" className="rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  Connect
                </Link>
                <Link href="/admin/settings" className="rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  Settings / Odoo
                </Link>
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
