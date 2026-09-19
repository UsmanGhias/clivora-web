"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  DollarSign,
  FileText,
  Layers,
  Sparkles,
  TrendingUp,
  Users,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Clock,
  LayoutDashboard,
  Receipt,
  MessageSquare,
  Timer,
  ChevronRight,
  FolderGit2,
} from "lucide-react";
import { useLivePlatformStats } from "@/lib/useLivePlatformStats";

function MiniEarningsChart() {
  const points = [
    { month: "Jan", y: 38, label: "3.2k" },
    { month: "Feb", y: 30, label: "4.8k" },
    { month: "Mar", y: 24, label: "6.1k" },
    { month: "Apr", y: 18, label: "8.4k" },
    { month: "May", y: 12, label: "11.2k" },
    { month: "Jun", y: 6, label: "14.8k" },
  ];
  const xs = points.map((_, i) => Math.round(((i + 0.5) / points.length) * 176));
  const baseline = 46;
  const line = points.map((p, i) => `${xs[i]},${p.y}`).join(" ");
  const area = `${line} ${xs[xs.length - 1]},${baseline} ${xs[0]},${baseline}`;

  return (
    <div className="flex h-full min-h-[58px] flex-col">
      <svg viewBox="0 0 176 56" className="h-full w-full flex-1" aria-hidden>
        <defs>
          <linearGradient id="heroEarnFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[12, 26, 40].map((y) => (
          <line key={y} x1="4" x2="172" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="2 3" />
        ))}
        <polygon fill="url(#heroEarnFill)" points={area} />
        <polyline
          fill="none"
          stroke="#0D9488"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={line}
        />
        {points.map((p, i) => (
          <g key={p.month}>
            <circle cx={xs[i]} cy={p.y} r={i === points.length - 1 ? 3 : 2} fill="#0D9488" />
            {i === points.length - 1 && (
              <text
                x={xs[i]}
                y={p.y - 4}
                textAnchor="middle"
                className="fill-teal-800"
                style={{ fontSize: 6.5, fontWeight: 800 }}
              >
                ${p.label}
              </text>
            )}
            <text
              x={xs[i]}
              y={52}
              textAnchor="middle"
              className="fill-slate-500"
              style={{ fontSize: 6.5, fontWeight: 600 }}
            >
              {p.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function HeroWorkspacePreview() {
  const [tab, setTab] = useState<"freelancer" | "client">("freelancer");
  const stats = useLivePlatformStats();

  return (
    <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
      {/* Background ambient light */}
      <div
        className="pointer-events-none absolute -top-10 -left-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        aria-hidden
      />

      {/* Main OS Window Mockup Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-15px_rgba(15,23,42,0.18)]">
        {/* Top OS Window Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-900 px-4 py-2.5 text-white">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-[11px] font-bold tracking-wider text-slate-300">
              CLIVORA OS · {tab === "freelancer" ? "Freelancer Workspace" : "Client Enterprise Portal"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-teal-300 border border-teal-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>{stats.formattedJobs} Live Roles</span>
            </span>
          </div>
        </div>

        {/* Workspace Dual Layout */}
        <div className="flex min-h-[440px] flex-col sm:flex-row">
          {/* Left Mini Sidebar */}
          <aside className="hidden w-44 shrink-0 flex-col justify-between border-r border-slate-100 bg-[#0B1220] p-3 text-white sm:flex">
            <div>
              {/* Workspace Selector */}
              <div className="mb-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-teal-400">Workspace</p>
                <div className="mt-1 flex rounded-lg bg-white/10 p-0.5">
                  <button
                    type="button"
                    onClick={() => setTab("freelancer")}
                    className={`flex-1 rounded py-1 text-[10px] font-bold transition ${
                      tab === "freelancer" ? "bg-teal-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Freelancer
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("client")}
                    className={`flex-1 rounded py-1 text-[10px] font-bold transition ${
                      tab === "client" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Client
                  </button>
                </div>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="space-y-1">
                <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white">
                  <LayoutDashboard className="h-3.5 w-3.5 text-teal-400" />
                  <span>Overview</span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Jobs Board</span>
                  </div>
                  <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-teal-300">
                    {stats.formattedJobs}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-white/5">
                  <FolderGit2 className="h-3.5 w-3.5" />
                  <span>Projects</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-white/5">
                  <Receipt className="h-3.5 w-3.5" />
                  <span>Invoices</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-white/5">
                  <Timer className="h-3.5 w-3.5" />
                  <span>Timesheets</span>
                </div>
              </nav>
            </div>

            {/* Bottom Founder Badge */}
            <div className="rounded-xl border border-teal-500/30 bg-teal-950/40 p-2.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                <p className="text-[10px] font-bold text-teal-300">Founder 1-Yr Free</p>
              </div>
              <p className="mt-0.5 text-[9px] text-slate-400">$0 Platform Fees</p>
            </div>
          </aside>

          {/* Right Main Panel Content */}
          <div className="flex-1 bg-slate-50/50 p-4 sm:p-5">
            {/* Mobile Tab Toggle */}
            <div className="mb-4 flex rounded-xl bg-slate-200/80 p-1 sm:hidden">
              <button
                type="button"
                onClick={() => setTab("freelancer")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  tab === "freelancer" ? "bg-white text-navy shadow-xs" : "text-slate-600"
                }`}
              >
                Freelancer OS
              </button>
              <button
                type="button"
                onClick={() => setTab("client")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  tab === "client" ? "bg-white text-navy shadow-xs" : "text-slate-600"
                }`}
              >
                Client Portal
              </button>
            </div>

            {tab === "freelancer" ? (
              <div className="space-y-3.5">
                {/* 3 Metric Cards with Mini Chart */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
                      <span>Monthly Revenue</span>
                      <DollarSign className="h-3 w-3 text-teal-600" />
                    </div>
                    <p className="mt-1 font-display text-lg font-black text-navy">$14,850.00</p>
                    <div className="mt-1">
                      <MiniEarningsChart />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
                      <span>Active Deals</span>
                      <Layers className="h-3 w-3 text-cyan-600" />
                    </div>
                    <p className="mt-1 font-display text-lg font-black text-navy">4 Active Milestones</p>
                    <p className="mt-2 text-[11px] font-bold text-emerald-600">✓ 100% Direct Payouts</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Zero marketplace commission</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
                      <span>Live Jobs Board</span>
                      <Zap className="h-3 w-3 text-amber-500" />
                    </div>
                    <p className="mt-1 font-display text-lg font-black text-navy">{stats.formattedJobs}</p>
                    <Link
                      href="/jobs"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:underline"
                    >
                      <span>1-Click Apply</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Live Milestone Tracker Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[9px] font-black text-teal-800 uppercase tracking-wide">
                          In Delivery
                        </span>
                        <p className="text-xs font-bold text-navy">Full-Stack SaaS Platform Architecture</p>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Client: Nova Global Labs · Milestone 2 of 3 · <strong>$4,500.00 Active</strong>
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      Direct Milestone
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600">
                      <span>Deliverables Completion</span>
                      <span className="text-teal-700">82% Completed</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500"
                        style={{ width: "82%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Instant Inbound Proposal & SOW Generator */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50/60 p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-teal-600 p-2 text-white shadow-xs">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy">AI Statement of Work (SOW) Engine</p>
                      <p className="text-[10px] text-slate-600">Generate structured scope, milestones, and contracts in 5s.</p>
                    </div>
                  </div>
                  <Link
                    href="/start-a-project"
                    className="inline-flex items-center gap-1 rounded-xl bg-navy px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy/90 transition shadow-xs"
                  >
                    <span>Try SOW Tool</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Client Enterprise Cards */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
                      <span>Milestone Balance</span>
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    </div>
                    <p className="mt-1 font-display text-lg font-black text-navy">$8,400.00</p>
                    <p className="mt-1 text-[11px] font-bold text-emerald-700">Milestone Tracked</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
                      <span>Hired Engineers</span>
                      <Users className="h-3 w-3 text-cyan-600" />
                    </div>
                    <p className="mt-1 font-display text-lg font-black text-navy">3 Verified</p>
                    <p className="mt-1 text-[11px] font-bold text-teal-700">Direct Communication</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
                      <span>Marketplace Fees</span>
                      <DollarSign className="h-3 w-3 text-emerald-600" />
                    </div>
                    <p className="mt-1 font-display text-lg font-black text-emerald-700">$0.00 Fee</p>
                    <p className="mt-1 text-[11px] font-bold text-slate-500">Save 20% vs Upwork</p>
                  </div>
                </div>

                {/* Client SOW Generator Feature */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-50 text-teal-700 font-black text-xs">
                        AI
                      </span>
                      <p className="text-xs font-bold text-navy">Instant Statement of Work Brief</p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                      Automated
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Draft project scope, milestones, budget estimates, and IP transfer terms without friction.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href="/start-a-project"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-800 transition"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Generate SOW</span>
                    </Link>
                    <Link
                      href="/connect"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-navy hover:bg-slate-100 transition"
                    >
                      <span>Find Talent</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
