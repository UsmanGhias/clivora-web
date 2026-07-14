"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Headphones,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Star,
  Plus,
  UserPlus,
  Bookmark,
  Settings,
} from "lucide-react";
import { proposalStatusLabel, type ProposalRow } from "@/lib/connect-proposals-shared";
import { cn } from "@/lib/utils";
import {
  ClientCard,
  ClientPageHeader,
  ClientStatCard,
  ClientStatusPill,
  money,
} from "@/components/client/ui";

const TABS = ["all", "shortlisted", "hired", "declined", "withdrawn"] as const;

function statusBucket(status: string) {
  const s = status.toLowerCase();
  if (s === "accepted") return "hired";
  if (s === "shortlisted") return "shortlisted";
  if (s === "declined") return "declined";
  if (s === "withdrawn") return "withdrawn";
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
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = { all: proposals.length, shortlisted: 0, hired: 0, declined: 0, withdrawn: 0 };
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

  return (
    <div className="space-y-6 pb-10">
      <ClientPageHeader
        title="Proposals"
        subtitle="Review and manage proposals from freelancers."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <ClientStatCard
          label="Total proposals"
          value={counts.all}
          trend={counts.all > 0 ? "+18%" : undefined}
          icon={Star}
          iconTone="bg-sky-100 text-sky-800"
        />
        <ClientStatCard
          label="Shortlisted"
          value={counts.shortlisted}
          trend="+12%"
          icon={Bookmark}
          iconTone="bg-violet-100 text-violet-700"
        />
        <ClientStatCard
          label="Hired"
          value={counts.hired}
          trend="+25%"
          icon={CheckCircle2}
          iconTone="bg-emerald-100 text-emerald-700"
        />
        <ClientStatCard
          label="Declined"
          value={counts.declined}
          trend={counts.declined > 0 ? "-8%" : undefined}
          trendDown
          icon={Star}
          iconTone="bg-red-100 text-red-700"
        />
        <ClientStatCard
          label="Withdrawn"
          value={counts.withdrawn}
          trend={counts.withdrawn > 0 ? "-4%" : undefined}
          trendDown
          icon={Star}
          iconTone="bg-slate-100 text-slate-600"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="flex gap-1 overflow-x-auto border-b border-border">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold capitalize",
                  tab === t
                    ? "border-client-accent text-navy"
                    : "border-transparent text-text-muted",
                )}
              >
                {t === "all" ? `All (${counts.all})` : `${t} (${counts[t]})`}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search proposals, skills, freelancers…"
                className="w-full rounded-xl border border-border py-2.5 pl-10 pr-3 text-sm outline-none ring-client-accent focus:ring-2"
              />
            </div>
            <select className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text-secondary">
              <option>Sort by: Newest first</option>
              <option>Highest bid</option>
              <option>Lowest bid</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
              <p className="font-semibold text-navy">No proposals in this view</p>
              <p className="mt-2 text-sm text-text-secondary">
                Post a job on Connect to start receiving freelancer bids.
              </p>
              <Link
                href="/app/connect/manage"
                className="mt-4 inline-block text-sm font-semibold text-client-accent"
              >
                Post a job →
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {filtered.map((p) => {
                const bucket = statusBucket(p.status);
                return (
                  <li
                    key={p.id}
                    className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-client-accent/30"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                      <div className="flex min-w-0 flex-1 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
                          {(p.from_name || "F").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-navy">{p.from_name}</h3>
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                              <ShieldCheck className="h-3 w-3" />
                              Verified
                            </span>
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
                              {bucket === "all" ? "New" : bucket}
                            </ClientStatusPill>
                          </div>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                            <MapPin className="h-3 w-3" />
                            {p.from_headline || "Freelancer"}
                          </p>
                          <p className="mt-2 font-semibold text-navy">
                            {p.need_title || "Open job"}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{p.message}</p>
                        </div>
                      </div>
                      <div className="shrink-0 space-y-1 text-right lg:w-40">
                        <p className="text-xs text-text-muted">Proposal · {relTime(p.created_at)}</p>
                        <p className="font-display text-xl font-extrabold text-navy">
                          {money(Number(p.amount ?? 0), 0)}
                        </p>
                        <p className="text-xs text-text-muted">Bid amount</p>
                        <p className="text-xs font-semibold text-text-secondary">
                          Delivery · 10 days
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                      <div className="flex items-center gap-1 text-xs text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        5.0 · 100% job success
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-xl px-4 py-2 text-sm font-semibold text-client-accent"
                        >
                          Shortlist
                        </button>
                        <Link
                          href="/app/messages"
                          className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
                        >
                          View proposal
                        </Link>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-text-muted hover:bg-client-surface"
                          aria-label="More"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="space-y-4">
          <ClientCard
            title="Proposal insights"
            action={
              <select className="rounded-lg border border-border px-2 py-1 text-[10px] font-semibold">
                <option>This month</option>
              </select>
            }
          >
            <ul className="space-y-4 text-sm">
              {[
                { label: "Response rate", value: "75%", pct: 75 },
                { label: "Avg. bid amount", value: money(avgBid || 1120, 0), pct: 62 },
                { label: "Avg. delivery time", value: "9 days", pct: 80 },
              ].map((m) => (
                <li key={m.label}>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{m.label}</span>
                    <span className="font-bold text-navy">{m.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-client-accent"
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </li>
              ))}
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

          <ClientCard>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-client-surface text-client-accent">
                <Headphones className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-navy">Need help?</p>
                <Link
                  href="/app/support"
                  className="mt-2 inline-flex rounded-xl bg-client-accent px-3 py-2 text-xs font-bold text-white"
                >
                  Visit Help Center
                </Link>
              </div>
            </div>
          </ClientCard>
        </aside>
      </div>
    </div>
  );
}
