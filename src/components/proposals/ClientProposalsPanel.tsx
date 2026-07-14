"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  MessageSquare,
  Search,
  Star,
  Plus,
  UserPlus,
  Bookmark,
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { proposalStatusLabel, type ProposalRow } from "@/lib/connect-proposals-shared";
import { parseConnectCreditError } from "@/lib/connect-credits";
import { cn } from "@/lib/utils";
import {
  ClientCard,
  ClientPageHeader,
  ClientStatCard,
  ClientStatusPill,
  money,
} from "@/components/client/ui";

const TABS = ["all", "pending", "shortlisted", "hired", "declined"] as const;

function statusBucket(status: string) {
  const s = status.toLowerCase();
  if (s === "accepted") return "hired";
  if (s === "shortlisted") return "shortlisted";
  if (s === "declined") return "declined";
  if (s === "pending" || s === "viewed") return "pending";
  return "all";
}

function relTime(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(0, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return d.toLocaleDateString();
}

export function ClientProposalsPanel({ proposals }: { proposals: ProposalRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const c = { all: proposals.length, pending: 0, shortlisted: 0, hired: 0, declined: 0 };
    for (const p of proposals) {
      const b = statusBucket(p.status);
      if (b !== "all") c[b as keyof typeof c] += 1;
    }
    return c;
  }, [proposals]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return proposals.filter((p) => {
      if (tab !== "all" && statusBucket(p.status) !== tab) return false;
      if (!q) return true;
      const hay = [p.from_name, p.from_headline, p.need_title, p.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [proposals, tab, query]);

  const avgBid =
    proposals.length > 0
      ? Math.round(
          proposals.reduce((s, p) => s + (Number(p.amount) || 0), 0) / proposals.length,
        )
      : 0;

  async function runAction(id: string, action: "accept" | "decline" | "shortlist") {
    setBusyId(id);
    setActionError(null);
    try {
      const supabase = createClient();
      const rpc =
        action === "accept"
          ? "connect_accept_proposal"
          : action === "decline"
            ? "connect_decline_proposal"
            : "connect_shortlist_proposal";
      const { error } = await supabase.rpc(rpc, { p_proposal_id: id });
      if (error) throw error;
      startTransition(() => router.refresh());
    } catch (e) {
      setActionError(parseConnectCreditError(e).message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <ClientPageHeader
        title="Proposals"
        subtitle="Review freelancer proposals, shortlist, hire, or message after accept."
      />

      {actionError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {actionError}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ClientStatCard label="Total" value={counts.all} />
        <ClientStatCard label="Pending" value={counts.pending} />
        <ClientStatCard label="Shortlisted" value={counts.shortlisted} />
        <ClientStatCard label="Hired" value={counts.hired} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-bold capitalize",
                  tab === t
                    ? "bg-navy text-white"
                    : "bg-client-surface text-text-secondary hover:bg-slate-100",
                )}
              >
                {t} ({counts[t as keyof typeof counts] ?? 0})
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search proposals…"
                className="w-40 bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <ClientCard title="No proposals">
              <p className="text-sm text-text-secondary">
                Post a job on Connect to receive proposals from freelancers.
              </p>
              <Link
                href="/app/connect/manage"
                className="mt-3 inline-flex rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
              >
                Post a job
              </Link>
            </ClientCard>
          ) : (
            <ul className="space-y-3">
              {filtered.map((p) => {
                const bucket = statusBucket(p.status);
                const busy = busyId === p.id || pending;
                return (
                  <li
                    key={p.id}
                    className="rounded-2xl border border-border bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display text-lg font-bold text-navy">
                            {p.from_name || "Freelancer"}
                          </p>
                          <ClientStatusPill
                            tone={
                              bucket === "hired"
                                ? "green"
                                : bucket === "shortlisted"
                                  ? "violet"
                                  : bucket === "declined"
                                    ? "red"
                                    : "blue"
                            }
                          >
                            {proposalStatusLabel(p.status)}
                          </ClientStatusPill>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                          <MapPin className="h-3 w-3" />
                          {p.from_headline || "Freelancer"}
                        </p>
                        <p className="mt-2 font-semibold text-navy">
                          {p.need_title || "Open job"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                          {p.message}
                        </p>
                      </div>
                      <div className="shrink-0 space-y-1 text-right lg:w-40">
                        <p className="text-xs text-text-muted">
                          Proposal · {relTime(p.created_at)}
                        </p>
                        <p className="font-display text-xl font-extrabold text-navy">
                          {money(Number(p.amount ?? 0), 0)}
                        </p>
                        <p className="text-xs text-text-muted">Bid amount</p>
                        <p className="text-xs font-semibold text-text-secondary">
                          Delivery · {p.timeline_days ?? "—"} days
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                      <div className="flex items-center gap-1 text-xs text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {proposalStatusLabel(p.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {(bucket === "pending" || bucket === "shortlisted") && (
                          <>
                            {bucket === "pending" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => void runAction(p.id, "shortlist")}
                                className="rounded-xl px-4 py-2 text-sm font-semibold text-client-accent disabled:opacity-50"
                              >
                                Shortlist
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void runAction(p.id, "accept")}
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                            >
                              Hire
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void runAction(p.id, "decline")}
                              className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {bucket === "hired" && (
                          <Link
                            href={`/app/messages?to=${encodeURIComponent(p.from_user_id)}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> Message
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="space-y-4">
          <ClientCard title="Proposal insights">
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span className="text-text-secondary">Avg. bid</span>
                <span className="font-bold text-navy">{money(avgBid, 0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-text-secondary">Pending</span>
                <span className="font-bold text-navy">{counts.pending}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-text-secondary">Hired</span>
                <span className="font-bold text-navy">{counts.hired}</span>
              </li>
            </ul>
          </ClientCard>

          <ClientCard title="Quick actions">
            <ul className="space-y-2">
              {[
                { href: "/app/connect/manage", label: "Post a new job", icon: Plus },
                { href: "/app/connect", label: "Invite freelancers", icon: UserPlus },
                { href: "/app/bookmarks", label: "Manage saved searches", icon: Bookmark },
                { href: "/app/settings", label: "Proposal settings", icon: Settings },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <li key={a.href}>
                    <Link
                      href={a.href}
                      className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-navy hover:bg-client-surface"
                    >
                      <Icon className="h-4 w-4 text-client-accent" />
                      {a.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </ClientCard>
        </aside>
      </div>
    </div>
  );
}
