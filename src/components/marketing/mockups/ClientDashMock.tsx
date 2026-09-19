"use client";

import Link from "next/link";
import {
  Briefcase,
  FolderKanban,
  Receipt,
  ShieldCheck,
  Users,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function ClientDashMock({ compact = false }: { compact?: boolean }) {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)]">
      {/* OS Chrome Window Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-900 px-3.5 py-2 text-white">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-[10px] font-bold tracking-wider text-slate-300">
            CLIVORA OS · Client Enterprise Portal
          </span>
        </div>
        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
          Client Workspace
        </span>
      </div>

      <div className={compact ? "flex min-h-[300px]" : "flex min-h-[380px]"}>
        {/* Dark Sidebar */}
        <aside className="hidden w-36 shrink-0 flex-col justify-between bg-[#0B1220] p-2.5 text-white sm:flex">
          <div>
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-600 text-[8px] font-bold">
                NL
              </span>
              <div className="min-w-0">
                <p className="truncate text-[9px] font-bold">Nova Labs Inc</p>
                <p className="text-[7px] text-cyan-400">Enterprise</p>
              </div>
            </div>

            <nav className="mt-2.5 space-y-1">
              <div className="flex items-center gap-1.5 rounded-md bg-cyan-600/30 px-2 py-1 text-[9px] font-bold text-cyan-200">
                <LayoutDashboard className="h-3 w-3" />
                <span>Overview</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <Users className="h-3 w-3" />
                <span>Hired Talent</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <FolderKanban className="h-3 w-3" />
                <span>Projects</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <Receipt className="h-3 w-3" />
                <span>Invoices</span>
              </div>
            </nav>
          </div>

          <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/40 p-1.5 text-[8px]">
            <p className="font-bold text-cyan-300">Milestones Active</p>
            <p className="text-slate-400">Direct Settlement</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-slate-50/50 p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
              <p className="text-[9px] font-bold uppercase text-slate-500">Active Milestones</p>
              <p className="mt-0.5 font-display text-sm font-black text-navy">$9,450.00</p>
              <p className="mt-1 text-[9px] font-bold text-emerald-600">✓ In Progress</p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
              <p className="text-[9px] font-bold uppercase text-slate-500">Hired Engineers</p>
              <p className="mt-0.5 font-display text-sm font-black text-navy">3 Active</p>
              <p className="mt-1 text-[9px] font-bold text-cyan-700">Verified Skills</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
              <p className="text-[9px] font-bold uppercase text-slate-500">Marketplace Cut</p>
              <p className="mt-0.5 font-display text-sm font-black text-emerald-700">$0.00 Fee</p>
              <p className="mt-1 text-[8px] text-slate-400">Direct invoicing</p>
            </div>
          </div>

          {/* SOW & Project Scope Card */}
          <div className="mt-3 rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-teal-50 p-1.5 text-teal-700">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-navy">Instant Statement of Work Brief</p>
                  <p className="text-[8px] text-slate-500">Generate milestones, budget, and deliverables</p>
                </div>
              </div>
              <Link
                href="/start-a-project"
                className="rounded-lg bg-navy px-2.5 py-1 text-[9px] font-bold text-white hover:bg-navy/90"
              >
                Create SOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
