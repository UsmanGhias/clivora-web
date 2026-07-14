"use client";

import { useMemo, useState } from "react";
import { Ban, ShieldCheck, UserCheck, UserPlus, Users, UserX } from "lucide-react";
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
  fmtDate,
  relative,
  ErrorBanner,
} from "@/components/admin/ui";

function nameOf(u: Record<string, unknown>) {
  return String(u.full_name || u.name || u.display_name || u.email || "—");
}

export default function AdminUsersPage() {
  const { data, loading } = useAdminData();
  const [activeTab, setActiveTab] = useState("all");
  const users = data?.users ?? [];

  const kpis = useMemo(() => {
    const total = data?.overview?.totalUsers || users.length;
    const clients = data?.overview?.clients || users.filter((u) => String(u.account_type) === "client").length;
    const freelancers =
      data?.overview?.freelancers ||
      users.filter((u) => String(u.account_type ?? "freelancer") !== "client").length;
    const pro = users.filter((u) =>
      ["pro", "pro_plus", "premium"].includes(String(u.subscription_plan || u.plan || "").toLowerCase()),
    ).length;
    const suspended = users.filter((u) => u.is_blocked || u.is_restricted).length;
    const unverified = users.filter((u) => u.email_verified === false || u.email_confirmed === false).length;
    return { total, clients, freelancers, pro, suspended, unverified };
  }, [users, data?.overview]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const type = String(u.account_type ?? "freelancer").toLowerCase();
      const plan = String(u.subscription_plan || u.plan || "").toLowerCase();
      if (activeTab === "clients") return type === "client";
      if (activeTab === "freelancers") return type !== "client";
      if (activeTab === "pro") return ["pro", "premium"].includes(plan);
      if (activeTab === "suspended") return Boolean(u.is_blocked || u.is_restricted);
      return true;
    });
  }, [users, activeTab]);

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
        title="Users"
        subtitle="Manage clients, freelancers, and platform accounts."
        actions={<ExportImportAdd entity="Users" addLabel="Add User" />}
      />

      <KpiGrid
        items={[
          {
            label: "Total Users",
            value: kpis.total,
            icon: <Users className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Clients",
            value: kpis.clients,
            icon: <UserCheck className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "Freelancers",
            value: kpis.freelancers,
            icon: <UserPlus className="h-4 w-4" />,
            iconBg: "bg-violet-50 text-violet-600",
          },
          {
            label: "Pro",
            value: kpis.pro,
            icon: <ShieldCheck className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Suspended",
            value: kpis.suspended,
            icon: <Ban className="h-4 w-4" />,
            iconBg: "bg-red-50 text-red-600",
          },
          {
            label: "Unverified",
            value: kpis.unverified,
            icon: <UserX className="h-4 w-4" />,
            iconBg: "bg-amber-50 text-amber-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar
              searchPlaceholder="Search users by name or email…"
              tabs={[
                { id: "all", label: "All", count: kpis.total },
                { id: "clients", label: "Clients", count: kpis.clients },
                { id: "freelancers", label: "Freelancers", count: kpis.freelancers },
                { id: "pro", label: "Pro", count: kpis.pro },
                { id: "suspended", label: "Suspended", count: kpis.suspended },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onReset={() => setActiveTab("all")}
            />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading users…
              </div>
            ) : (
              <AdminTable
                headers={["User", "User Type", "Status", "Email Verified", "Joined", "Last Active", "Actions"]}
                footer={<span>Showing {filtered.length} of {users.length} users</span>}
              >
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-10 text-center text-sm text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => {
                    const type = String(u.account_type ?? "freelancer");
                    const suspended = Boolean(u.is_blocked || u.is_restricted);
                    const status = suspended ? "suspended" : "active";
                    const verified = u.email_verified !== false && u.email_confirmed !== false;
                    return (
                      <tr key={String(u.id)} className="hover:bg-slate-50/80">
                        <td className="px-3 py-3">
                          <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                        </td>
                        <td className="px-3 py-3">
                          <AvatarCell name={nameOf(u)} email={String(u.email ?? "")} />
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill status={type} />
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill status={status} />
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">
                          {verified ? "Yes" : "No"}
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">
                          {fmtDate(String(u.created_at ?? ""))}
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-500">
                          {relative(String(u.updated_at ?? u.created_at ?? "")) || "—"}
                        </td>
                        <td className="px-3 py-3">
                          <RowActions />
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
            <SideCard title="User breakdown">
              <div className="space-y-2 text-sm">
                <Row label="Clients" value={kpis.clients} />
                <Row label="Freelancers" value={kpis.freelancers} />
                <Row label="Pro plan" value={kpis.pro} />
                <Row label="Suspended" value={kpis.suspended} />
              </div>
            </SideCard>
            <SideCard title="Tips">
              <p className="text-xs leading-relaxed text-slate-500">
                Filter by account type using the tabs above. Suspended users are blocked or restricted.
              </p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  );
}
