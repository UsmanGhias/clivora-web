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
  MessageSquare,
  Sparkles,
} from "lucide-react";

function MiniLineChart() {
  const points = [
    { month: "Jan", y: 38, label: "4.2k" },
    { month: "Feb", y: 30, label: "6.8k" },
    { month: "Mar", y: 22, label: "9.5k" },
    { month: "Apr", y: 16, label: "13.2k" },
    { month: "May", y: 10, label: "17.4k" },
    { month: "Jun", y: 4, label: "24.5k" },
  ];
  const xs = points.map((_, i) => Math.round(((i + 0.5) / points.length) * 176));
  const baseline = 46;
  const line = points.map((p, i) => `${xs[i]},${p.y}`).join(" ");
  const area = `${line} ${xs[xs.length - 1]},${baseline} ${xs[0]},${baseline}`;

  return (
    <div className="flex h-full min-h-[58px] flex-col">
      <svg viewBox="0 0 176 56" className="h-full w-full flex-1" aria-hidden>
        <defs>
          <linearGradient id="wsMockGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[12, 26, 40].map((y) => (
          <line key={y} x1="4" x2="172" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="2 3" />
        ))}
        <polygon fill="url(#wsMockGrad)" points={area} />
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

export function WorkspaceDesktopMock() {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)]">
      {/* OS Chrome Window Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-900 px-3.5 py-2 text-white">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-[10px] font-bold tracking-wider text-slate-300">
            CLIVORA OS · All-in-One Desk
          </span>
        </div>
        <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[9px] font-bold text-teal-300 border border-teal-500/30">
          Founder Access · $0 Fees
        </span>
      </div>

      <div className="flex min-h-[380px] flex-col sm:flex-row">
        {/* Dark Sidebar */}
        <aside className="hidden w-36 shrink-0 flex-col justify-between bg-[#0B1220] p-2.5 text-white sm:flex">
          <div>
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[8px] font-bold">
                UG
              </span>
              <div className="min-w-0">
                <p className="truncate text-[9px] font-bold">Usman Ghias</p>
                <p className="text-[7px] text-teal-400">Owner</p>
              </div>
            </div>

            <nav className="mt-2.5 space-y-1">
              <div className="flex items-center gap-1.5 rounded-md bg-teal-600/30 px-2 py-1 text-[9px] font-bold text-teal-200">
                <LayoutDashboard className="h-3 w-3" />
                <span>Dashboard</span>
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
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <MessageSquare className="h-3 w-3" />
                <span>Messages</span>
              </div>
            </nav>
          </div>

          <div className="rounded-lg border border-teal-500/20 bg-teal-950/40 p-1.5 text-[8px]">
            <p className="font-bold text-teal-300">Direct Invoicing</p>
            <p className="text-slate-400">$0 Platform Fees</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-slate-50/50 p-3 sm:p-4">
          <p className="text-[11px] font-bold text-navy">Good morning, Usman!</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["Total Earnings", "$24,560.00"],
              ["Active Projects", "6 In Delivery"],
              ["Pending Invoices", "$3,200.00"],
              ["Unread Briefs", "4 New"],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-slate-200/90 bg-white p-2 shadow-xs">
                <p className="text-[8px] font-bold uppercase text-slate-500">{l}</p>
                <p className="mt-0.5 text-[10px] font-black text-navy">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="sm:col-span-2 rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs">
              <p className="text-[9px] font-bold uppercase text-slate-500">Earnings Performance</p>
              <div className="mt-1">
                <MiniLineChart />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase text-slate-500">Deal Status</p>
                <p className="mt-1 font-display text-sm font-black text-emerald-700">100% Retained</p>
                <p className="mt-1 text-[8px] text-slate-500">Clients pay direct on your bank or Safepay terms.</p>
              </div>
              <div className="rounded-lg bg-teal-50 p-2 text-teal-800 text-[8px] font-bold">
                ✓ No fee cuts taken
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
