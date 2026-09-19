"use client";

import Link from "next/link";
import {
  Briefcase,
  DollarSign,
  FolderKanban,
  Receipt,
  ShieldCheck,
  Timer,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";
import { useLivePlatformStats } from "@/lib/useLivePlatformStats";

function EarningsChart() {
  const points = [
    { month: "Jan", y: 44, label: "3.2k" },
    { month: "Feb", y: 36, label: "4.8k" },
    { month: "Mar", y: 28, label: "6.5k" },
    { month: "Apr", y: 20, label: "9.2k" },
    { month: "May", y: 14, label: "12.4k" },
    { month: "Jun", y: 8, label: "16.8k" },
  ];
  const xs = points.map((_, i) => Math.round(((i + 0.5) / points.length) * 176));
  const baseline = 48;
  const line = points.map((p, i) => `${xs[i]},${p.y}`).join(" ");
  const area = `${line} ${xs[xs.length - 1]},${baseline} ${xs[0]},${baseline}`;

  return (
    <div className="flex h-full min-h-[64px] flex-col">
      <svg viewBox="0 0 176 56" className="h-full w-full flex-1" aria-hidden>
        <defs>
          <linearGradient id="earnFillFMock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[14, 28, 42].map((y) => (
          <line key={y} x1="4" x2="172" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="2 3" />
        ))}
        <polygon fill="url(#earnFillFMock)" points={area} />
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

export function FreelancerDashMock({ compact = false }: { compact?: boolean }) {
  const stats = useLivePlatformStats();
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)]">
      {/* OS Chrome Window Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-900 px-3.5 py-2 text-white">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-[10px] font-bold tracking-wider text-slate-300">
            CLIVORA OS · Freelancer Workspace
          </span>
        </div>
        <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[9px] font-bold text-teal-300 border border-teal-500/30">
          Founder Access
        </span>
      </div>

      <div className={compact ? "flex min-h-[300px]" : "flex min-h-[380px]"}>
        {/* Dark Sidebar */}
        <aside className="hidden w-36 shrink-0 flex-col justify-between bg-[#0B1220] p-2.5 text-white sm:flex">
          <div>
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[8px] font-bold">
                UG
              </span>
              <div className="min-w-0">
                <p className="truncate text-[9px] font-bold">Usman Ghias</p>
                <p className="text-[7px] text-teal-400">Full Access</p>
              </div>
            </div>

            <nav className="mt-2.5 space-y-1">
              <div className="flex items-center gap-1.5 rounded-md bg-teal-600/30 px-2 py-1 text-[9px] font-bold text-teal-200">
                <LayoutDashboard className="h-3 w-3" />
                <span>Overview</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <Briefcase className="h-3 w-3" />
                <span>Jobs Board</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <FolderKanban className="h-3 w-3" />
                <span>Projects</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <Receipt className="h-3 w-3" />
                <span>Invoices</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <Timer className="h-3 w-3" />
                <span>Timesheets</span>
              </div>
            </nav>
          </div>

          <div className="rounded-lg border border-teal-500/20 bg-teal-950/40 p-1.5 text-[8px]">
            <p className="font-bold text-teal-300">Direct Deals</p>
            <p className="text-slate-400">$0 Platform Fees</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-slate-50/50 p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
              <p className="text-[9px] font-bold uppercase text-slate-500">Monthly Revenue</p>
              <p className="mt-0.5 font-display text-sm font-black text-navy">$16,840.00</p>
              <div className="mt-1">
                <EarningsChart />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
              <p className="text-[9px] font-bold uppercase text-slate-500">Active Deals</p>
              <p className="mt-0.5 font-display text-sm font-black text-navy">4 Funded</p>
              <p className="mt-1.5 text-[9px] font-bold text-emerald-600">✓ 100% Payouts</p>
              <p className="text-[8px] text-slate-400">Direct to bank/crypto</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
              <p className="text-[9px] font-bold uppercase text-slate-500">Live Roles</p>
              <p className="mt-0.5 font-display text-sm font-black text-navy">{stats.formattedJobs} Roles</p>
              <Link
                href="/jobs"
                className="mt-1.5 inline-block text-[9px] font-bold text-teal-700 hover:underline"
              >
                Browse Board →
              </Link>
            </div>
          </div>

          {/* Active Deliverable Tracker */}
          <div className="mt-3 rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-navy">Mobile App Backend Architecture</p>
                <p className="text-[8px] text-slate-500">Client: Horizon Ventures · $3,800 Funded</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-700 border border-emerald-200">
                Milestone 2/3
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-teal-600" style={{ width: "75%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
