"use client";

import { useMemo, useState } from "react";
import { CreditCard, Landmark, Unlock } from "lucide-react";
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
  fmtDate,
  ErrorBanner,
  AdminBtn,
} from "@/components/admin/ui";

function nameOf(u: Record<string, unknown>) {
  return String(u.full_name || u.name || u.display_name || u.email || "-");
}

export default function AdminPaymentsPage() {
  const { data, loading, refresh } = useAdminData();
  const [activeTab, setActiveTab] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const payments = useMemo(() => data?.payments ?? [], [data?.payments]);

  const kpis = useMemo(() => {
    const volume = payments.reduce((s, p) => s + Number(p.amount_usd ?? p.amount ?? 0), 0);
    const escrow = data?.overview.escrowHeld ?? 0;
    const released = payments
      .filter((p) => ["approved", "paid", "released"].includes(String(p.status).toLowerCase()))
      .reduce((s, p) => s + Number(p.amount_usd ?? p.amount ?? 0), 0);
    return { volume, escrow, released };
  }, [payments, data?.overview.escrowHeld]);

  const statuses = useMemo(() => {
    const set = new Set(payments.map((p) => String(p.status || "pending").toLowerCase()));
    return Array.from(set);
  }, [payments]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return payments;
    return payments.filter((p) => String(p.status).toLowerCase() === activeTab);
  }, [payments, activeTab]);

  const tabs = [
    { id: "all", label: "All", count: payments.length },
    ...statuses.map((s) => ({
      id: s,
      label: s.replace(/_/g, " "),
      count: payments.filter((p) => String(p.status).toLowerCase() === s).length,
    })),
  ];

  async function approvePayment(p: Record<string, unknown>) {
    const id = String(p.id);
    const email = String(p.email || "").trim();
    if (!email) {
      setActionError("Payment row is missing an email.");
      return;
    }
    setBusyId(id);
    setActionError(null);
    try {
      const plan = String(p.plan || "pro").toLowerCase().includes("plus") ? "pro_plus" : "pro";
      const { assertClientUser, getVerifiedAccessToken } = await import(
        "@/lib/supabase/access-token"
      );
      await assertClientUser();
      const token = await getVerifiedAccessToken();
      const res = await fetch("/api/admin/grant-pro", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email,
          plan,
          paymentRequestId: id,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = String(json.error || "Approve failed");
        if (json.code === "MFA_REQUIRED" || /two-factor|mfa|aal2/i.test(err)) {
          throw new Error("Complete admin 2FA (MFA) first, then retry Approve.");
        }
        throw new Error(err);
      }
      await refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Approve failed");
    } finally {
      setBusyId(null);
    }
  }

  async function rejectPayment(p: Record<string, unknown>) {
    const id = String(p.id);
    setBusyId(id);
    setActionError(null);
    try {
      const { assertClientUser, getVerifiedAccessToken } = await import(
        "@/lib/supabase/access-token"
      );
      await assertClientUser();
      const token = await getVerifiedAccessToken();
      const res = await fetch("/api/admin/payment-requests", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status: "rejected" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Reject failed");
      await refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Reject failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {(data?.warning || actionError) && (
        <ErrorBanner
          message={actionError || data?.warning || ""}
          onViewLogs={() => {
            window.location.href = "/admin/events";
          }}
        />
      )}

      <AdminPageHeader
        title="Payments"
        subtitle="Pro payment requests and platform transactions - Approve grants live plans."
        actions={<ExportImportAdd entity="Payments" addLabel="Add Payment" />}
      />

      <KpiGrid
        items={[
          {
            label: "Volume",
            value: money(kpis.volume),
            icon: <CreditCard className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Escrow",
            value: money(kpis.escrow),
            icon: <Landmark className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
          {
            label: "Released",
            value: money(kpis.released),
            icon: <Unlock className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar
              searchPlaceholder="Search payments…"
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onReset={() => setActiveTab("all")}
            />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading payments…
              </div>
            ) : (
              <AdminTable
                headers={["Payment ID", "Type / Plan", "From", "Method", "Amount", "Status", "Date", "Actions"]}
                footer={
                  <span>
                    Showing {filtered.length} of {payments.length} payments
                  </span>
                }
              >
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-10 text-center text-sm text-slate-500">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const status = String(p.status || "pending").toLowerCase();
                    const pending =
                      status === "pending" || status === "submitted" || status === "review";
                    return (
                      <tr key={String(p.id)} className="hover:bg-slate-50/80">
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300"
                            aria-label="Select row"
                          />
                        </td>
                        <td className="px-3 py-3 font-mono text-xs font-bold text-slate-800">
                          {String(p.id).slice(0, 10)}
                        </td>
                        <td className="px-3 py-3 text-sm font-semibold capitalize text-slate-700">
                          {String(p.plan || p.type || "pro")}
                        </td>
                        <td className="px-3 py-3">
                          <AvatarCell name={nameOf(p)} email={String(p.email ?? "")} />
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">
                          {String(p.payment_method || "-")}
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-800">
                          {money(Number(p.amount_usd ?? p.amount ?? 0))}
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill status={status.replace(/_/g, " ")} />
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">
                          {fmtDate(String(p.created_at ?? ""))}
                        </td>
                        <td className="px-3 py-3">
                          {pending ? (
                            <div className="flex flex-wrap gap-1">
                              <AdminBtn
                                variant="primary"
                                disabled={busyId === String(p.id)}
                                onClick={() => void approvePayment(p)}
                              >
                                Approve
                              </AdminBtn>
                              <AdminBtn
                                variant="outline"
                                disabled={busyId === String(p.id)}
                                onClick={() => void rejectPayment(p)}
                              >
                                Reject
                              </AdminBtn>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">-</span>
                          )}
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
            <SideCard title="Payment summary">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Volume</span>
                  <span className="font-bold">{money(kpis.volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">In escrow</span>
                  <span className="font-bold text-blue-600">{money(kpis.escrow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Released</span>
                  <span className="font-bold text-teal-700">{money(kpis.released)}</span>
                </div>
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
