"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, FileText, Wallet } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  ExportImportAdd,
  KpiGrid,
  FilterBar,
  AdminTable,
  StatusPill,
  RowActions,
  PageLayout,
  SidePanel,
  SideCard,
  money,
  fmtDate,
  ErrorBanner,
} from "@/components/admin/ui";

export default function AdminInvoicesPage() {
  const { data, loading } = useAdminData();
  const [activeTab, setActiveTab] = useState("all");
  const invoices = data?.invoices ?? [];

  const kpis = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((i) => String(i.status).toLowerCase() === "paid").length;
    const pending = invoices.filter((i) =>
      ["pending", "sent", "unpaid", "draft"].includes(String(i.status).toLowerCase()),
    ).length;
    const overdue = invoices.filter((i) => String(i.status).toLowerCase() === "overdue").length;
    const amount = invoices.reduce((s, i) => s + Number(i.total ?? i.amount ?? 0), 0);
    return { total, paid, pending, overdue, amount };
  }, [invoices]);

  const statuses = useMemo(() => {
    const set = new Set(invoices.map((i) => String(i.status || "draft").toLowerCase()));
    return Array.from(set);
  }, [invoices]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return invoices;
    return invoices.filter((i) => String(i.status).toLowerCase() === activeTab);
  }, [invoices, activeTab]);

  const tabs = [
    { id: "all", label: "All", count: invoices.length },
    ...statuses.map((s) => ({
      id: s,
      label: s.replace(/_/g, " "),
      count: invoices.filter((i) => String(i.status).toLowerCase() === s).length,
    })),
  ];

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
        title="Invoices"
        subtitle="CRM invoices and billing status."
        actions={<ExportImportAdd entity="Invoices" addLabel="Add Invoice" />}
      />

      <KpiGrid
        items={[
          {
            label: "Total",
            value: kpis.total,
            icon: <FileText className="h-4 w-4" />,
            iconBg: "bg-teal-50 text-teal-600",
          },
          {
            label: "Paid",
            value: kpis.paid,
            icon: <CheckCircle2 className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Pending",
            value: kpis.pending,
            icon: <Clock className="h-4 w-4" />,
            iconBg: "bg-amber-50 text-amber-600",
          },
          {
            label: "Overdue",
            value: kpis.overdue,
            icon: <AlertTriangle className="h-4 w-4" />,
            iconBg: "bg-red-50 text-red-600",
          },
          {
            label: "Amount",
            value: money(kpis.amount),
            icon: <Wallet className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-600",
          },
        ]}
      />

      <PageLayout
        main={
          <div>
            <FilterBar
              searchPlaceholder="Search invoices…"
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onReset={() => setActiveTab("all")}
            />

            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading invoices…
              </div>
            ) : (
              <AdminTable
                headers={["Invoice #", "Status", "Amount", "Issue", "Due", "Actions"]}
                footer={<span>Showing {filtered.length} of {invoices.length} invoices</span>}
              >
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv) => (
                    <tr key={String(inv.id)} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                      </td>
                      <td className="px-3 py-3 font-bold text-slate-900">
                        {String(inv.invoice_number || inv.id).slice(0, 16)}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={String(inv.status || "draft").replace(/_/g, " ")} />
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-800">
                        {money(Number(inv.total ?? inv.amount ?? 0), String(inv.currency || "USD"))}
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600">
                        {fmtDate(String(inv.issue_date ?? inv.created_at ?? ""))}
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600">{fmtDate(String(inv.due_date ?? ""))}</td>
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
            <SideCard title="Invoice overview">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total invoices</span>
                  <span className="font-bold">{kpis.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paid</span>
                  <span className="font-bold text-emerald-600">{kpis.paid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending</span>
                  <span className="font-bold text-amber-600">{kpis.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Overdue</span>
                  <span className="font-bold text-red-600">{kpis.overdue}</span>
                </div>
                <div className="mt-2 border-t border-slate-100 pt-2 flex justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-teal-700">{money(kpis.amount)}</span>
                </div>
              </div>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
