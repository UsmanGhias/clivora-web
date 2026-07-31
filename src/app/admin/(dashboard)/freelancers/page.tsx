"use client";

import { useMemo } from "react";
import { BadgeCheck, Briefcase, DollarSign, UserCheck } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  ExportImportAdd,
  KpiGrid,
  FilterBar,
  AdminTable,
  StatusPill,
  AvatarCell,
  PageLayout,
  SidePanel,
  SideCard,
  money,
  ErrorBanner,
} from "@/components/admin/ui";
import { AdminUserActions, joinedDate } from "@/components/admin/AdminUserActions";

function nameOf(u: Record<string, unknown>) {
  return String(u.full_name || u.name || u.display_name || u.email || "-");
}

export default function AdminFreelancersPage() {
  const { data, loading, refresh } = useAdminData();
  const freelancers = useMemo(() => data?.freelancers ?? [], [data?.freelancers]);

  const kpis = useMemo(() => {
    const total = freelancers.length;
    const verified = freelancers.filter((f) => f.verified || f.email_verified).length;
    const active = freelancers.filter((f) => !f.is_blocked && !f.is_restricted).length;
    const earnings = freelancers.reduce((s, f) => s + Number(f.earnings ?? f.total_earned ?? 0), 0);
    return { total, verified, active, earnings };
  }, [freelancers]);

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
        title="Freelancers"
        subtitle="Talent profiles, verification, and earnings."
        actions={<ExportImportAdd entity="Freelancers" addLabel="Add Freelancer" />}
      />

      <KpiGrid
        items={[
          {
            label: "Total",
            value: kpis.total,
            icon: <Briefcase className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Verified",
            value: kpis.verified,
            icon: <BadgeCheck className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Active",
            value: kpis.active,
            icon: <UserCheck className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "Earnings",
            value: money(kpis.earnings),
            icon: <DollarSign className="h-4 w-4" />,
            iconBg: "bg-amber-50 text-amber-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar searchPlaceholder="Search freelancers…" onReset={() => undefined} />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading freelancers…
              </div>
            ) : (
              <AdminTable
                headers={["Freelancer", "Skills", "Status", "Joined", "Actions"]}
                footer={<span>Showing {freelancers.length} freelancers</span>}
              >
                {freelancers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                      No freelancers found.
                    </td>
                  </tr>
                ) : (
                  freelancers.map((f) => {
                    const skills = Array.isArray(f.skills)
                      ? (f.skills as string[]).slice(0, 3).join(", ")
                      : String(f.headline || f.skills || "-");
                    const status = f.is_blocked || f.is_restricted ? "suspended" : f.verified ? "verified" : "active";
                    return (
                      <tr key={String(f.id)} className="hover:bg-slate-50/80">
                        <td className="px-3 py-3">
                          <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                        </td>
                        <td className="px-3 py-3">
                          <AvatarCell name={nameOf(f)} email={String(f.email ?? "")} />
                        </td>
                        <td className="max-w-[220px] truncate px-3 py-3 text-sm text-slate-600">{skills}</td>
                        <td className="px-3 py-3">
                          <StatusPill status={status} />
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">{joinedDate(f)}</td>
                        <td className="px-3 py-3">
                          <AdminUserActions user={f} onRefresh={() => void refresh()} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </AdminTable>
            )}
          </div>
        }
        side={
          <SidePanel>
            <SideCard title="Top skills">
              <p className="text-xs text-slate-500">Top skills placeholder - skill analytics coming soon.</p>
              <ul className="mt-3 space-y-2 text-sm">
                {["UI/UX Design", "React", "Copywriting", "Video Editing"].map((s) => (
                  <li key={s} className="flex items-center justify-between">
                    <span className="text-slate-600">{s}</span>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">-</span>
                  </li>
                ))}
              </ul>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
