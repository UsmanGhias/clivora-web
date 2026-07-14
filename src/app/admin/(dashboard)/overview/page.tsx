"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

const chartDemo = [
  { d: "Jul 1", rev: 12, users: 8, freelancers: 5 },
  { d: "Jul 8", rev: 18, users: 12, freelancers: 7 },
  { d: "Jul 15", rev: 22, users: 16, freelancers: 10 },
  { d: "Jul 22", rev: 28, users: 20, freelancers: 14 },
  { d: "Jul 31", rev: 35, users: 24, freelancers: 18 },
];

export default function AdminOverviewPage() {
  const { data, loading, error, refresh } = useAdminData();
  const o = data?.overview;

  return (
    <div>
      {(data?.warning || error) && (
        <ErrorBanner
          message={data?.warning || error || "Stats request failed (503)"}
          onViewLogs={() => {
            window.location.href = "/admin/events";
          }}
        />
      )}

      <AdminPageHeader
        title="Overview"
        subtitle="Platform health, revenue, and growth across CLIVORA."
        actions={
          <>
            <AdminBtn variant="primary" onClick={() => void refresh()}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </AdminBtn>
            <AdminBtn
              variant="dark"
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify({ exportedAt: new Date().toISOString(), overview: o ?? null }, null, 2)],
                  { type: "application/json" },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `clivora-admin-overview-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export report
            </AdminBtn>
          </>
        }
      />

      <KpiGrid
        items={[
          {
            label: "Total Revenue",
            value: money(o?.totalRevenue ?? 0),
            trend: "↑ vs last 30 days",
            trendUp: true,
            icon: <Wallet className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Total Users",
            value: o?.totalUsers ?? 0,
            trend: "↑ growth",
            trendUp: true,
            icon: <Users className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "Freelancers",
            value: o?.freelancers ?? 0,
            trend: "↑ growth",
            trendUp: true,
            icon: <Briefcase className="h-4 w-4" />,
            iconBg: "bg-violet-50 text-violet-600",
          },
          {
            label: "Active Projects",
            value: o?.activeProjects ?? 0,
            trend: "↑ growth",
            trendUp: true,
            icon: <FolderKanban className="h-4 w-4" />,
            iconBg: "bg-orange-50 text-orange-600",
          },
          {
            label: "Total Jobs",
            value: o?.totalJobs ?? 0,
            trend: "↑ growth",
            trendUp: true,
            icon: <Zap className="h-4 w-4" />,
            iconBg: "bg-cyan-50 text-cyan-600",
          },
          {
            label: "Total Payments",
            value: money(o?.totalPayments ?? 0),
            trend: "↑ growth",
            trendUp: true,
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
                <h3 className="mb-3 text-sm font-bold">Revenue Overview</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartDemo}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0D9488" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#0D9488" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="d" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="rev" stroke="#0D9488" fill="url(#rev)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <Metric label="Total Revenue" value={money(o?.totalRevenue ?? 0)} />
                  <Metric label="Platform Fee" value={money(o?.platformFee ?? 0)} />
                  <Metric label="Escrow Held" value={money(o?.escrowHeld ?? 0)} />
                  <Metric label="Total Payouts" value={money(o?.totalPayouts ?? 0)} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-bold">User Growth</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDemo}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="d" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="freelancers" stroke="#10B981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <Metric label="Total Users" value={String(o?.totalUsers ?? 0)} />
                  <Metric label="New Users" value={String(o?.newUsers ?? 0)} />
                  <Metric label="Freelancers" value={String(o?.freelancers ?? 0)} />
                  <Metric label="New Freelancers" value={String(o?.newFreelancers ?? 0)} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
                <h3 className="mb-3 text-sm font-bold">Platform Health</h3>
                <HealthRow label="Server" ok />
                <HealthRow label="Database" ok />
                <HealthRow label="Queue" ok />
                <HealthRow label="Storage" ok={false} detail="78% Used" />
                <div className="mt-3 text-xs text-slate-500">Cache Hit Rate · 92.4%</div>
                <Link href="/admin/events" className="mt-3 inline-block text-xs font-bold text-teal-600">
                  View system logs →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
                <h3 className="mb-3 text-sm font-bold">Recent Activity</h3>
                <ul className="space-y-2.5">
                  {(data?.events ?? []).slice(0, 8).map((ev) => (
                    <li key={String(ev.id)} className="flex items-start justify-between gap-3 text-sm">
                      <div>
                        <div className="font-semibold text-slate-800">{String(ev.event_type ?? "event")}</div>
                        <div className="text-xs text-slate-500">
                          {String(ev.user_email || ev.user_name || "system")}
                        </div>
                      </div>
                      <div className="shrink-0 text-[11px] text-slate-400">{relative(String(ev.created_at))}</div>
                    </li>
                  ))}
                  {(data?.events?.length ?? 0) === 0 && (
                    <li className="text-sm text-slate-500">No recent events yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        }
        side={
          <SidePanel>
            <SideCard title="Quick links" footer={<Link href="/admin/settings">System settings →</Link>}>
              <div className="space-y-2 text-sm">
                <Link className="block font-semibold text-teal-700" href="/admin/users">Users</Link>
                <Link className="block font-semibold text-teal-700" href="/admin/payments">Payments</Link>
                <Link className="block font-semibold text-teal-700" href="/admin/escrow">Escrow</Link>
                <Link className="block font-semibold text-teal-700" href="/admin/connect">Connect</Link>
              </div>
            </SideCard>
            <SideCard title="Source">
              <p className="text-xs text-slate-500">
                Data source: <strong>{data?.source ?? "…"}</strong>
                {loading ? " · refreshing…" : ""}
              </p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-2.5 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="font-bold text-slate-800">{value}</div>
    </div>
  );
}

function HealthRow({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="mb-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 font-medium">
        <span className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-400"}`} />
        {label}
      </div>
      <span className="text-xs text-slate-500">{detail ?? (ok ? "Operational" : "Attention")}</span>
    </div>
  );
}
