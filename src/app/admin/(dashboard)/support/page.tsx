"use client";

import { useMemo, useState } from "react";
import { Ticket } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  AdminBtn,
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
  relative,
  ErrorBanner,
} from "@/components/admin/ui";

export default function AdminSupportPage() {
  const { data, loading, refresh } = useAdminData();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const ticketRows = useMemo(() => data?.ticketRows ?? [], [data?.ticketRows]);
  const tickets = data?.tickets ?? ticketRows.length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ticketRows;
    return ticketRows.filter((t) => {
      const hay = [
        t.id,
        t.subject,
        t.body,
        t.status,
        t.priority,
        t.user_id,
        t.admin_notes,
      ]
        .map((v) => String(v ?? "").toLowerCase())
        .join(" ");
      return hay.includes(q);
    });
  }, [ticketRows, query]);

  async function updateTicket(id: string, status: string) {
    setBusyId(id);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id, status }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Update failed");
      await refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

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
      {actionError && <ErrorBanner message={actionError} />}

      <AdminPageHeader
        title="Support Tickets"
        subtitle="Live queue from support_tickets."
        actions={
          <AdminBtn variant="outline" onClick={() => void refresh()}>
            Refresh
          </AdminBtn>
        }
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
            <FilterBar
              searchPlaceholder="Search tickets…"
              onReset={() => setQuery("")}
              onSearchChange={setQuery}
              searchValue={query}
            />
            {!data && loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Loading support…
              </div>
            ) : (
              <AdminTable
                headers={["Ticket", "Requester", "Status", "Updated", "Actions"]}
                footer={<span>{filtered.length} of {tickets} tickets</span>}
              >
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                      No support tickets yet.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => {
                    const id = String(t.id);
                    const subject = String(t.subject || "Untitled");
                    const status = String(t.status || "open");
                    const updated = String(t.updated_at || t.created_at || "");
                    const userId = String(t.user_id || "");
                    return (
                      <tr key={id} className="hover:bg-slate-50/80">
                        <td className="px-3 py-3">
                          <input type="checkbox" className="rounded border-slate-300" aria-label="Select row" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-slate-900">{subject}</div>
                          <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                            {String(t.body || "").slice(0, 120)}
                          </div>
                          <div className="mt-1 font-mono text-[10px] text-slate-400">{id.slice(0, 8)}</div>
                        </td>
                        <td className="px-3 py-3">
                          <AvatarCell
                            name={String(t.user_name || t.user_email || userId.slice(0, 8) || "User")}
                            email={String(t.user_email || userId)}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill status={status} />
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">
                          {fmtDate(updated)}
                          <span className="ml-1 text-xs text-slate-400">{relative(updated)}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1">
                            {status !== "in_progress" && (
                              <AdminBtn
                                variant="outline"
                                disabled={busyId === id}
                                onClick={() => void updateTicket(id, "in_progress")}
                              >
                                Start
                              </AdminBtn>
                            )}
                            {status !== "resolved" && (
                              <AdminBtn
                                variant="primary"
                                disabled={busyId === id}
                                onClick={() => void updateTicket(id, "resolved")}
                              >
                                Resolve
                              </AdminBtn>
                            )}
                            {status !== "closed" && (
                              <AdminBtn
                                variant="outline"
                                disabled={busyId === id}
                                onClick={() => void updateTicket(id, "closed")}
                              >
                                Close
                              </AdminBtn>
                            )}
                          </div>
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
            <SideCard title="Support overview">
              <p className="text-xs text-slate-500">
                Ticket rows load from <code>support_tickets</code>. Revenue context{" "}
                {money(data?.overview.totalRevenue ?? 0)}.
              </p>
            </SideCard>
          </SidePanel>
        }
      />
    </div>
  );
}
