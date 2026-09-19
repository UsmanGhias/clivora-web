"use client";

import Link from "next/link";
import { Briefcase, Sparkles, Zap, ArrowUpRight, Search, CheckCircle2 } from "lucide-react";
import { useLivePlatformStats } from "@/lib/useLivePlatformStats";

const CATEGORIES = ["All Roles", "Development", "Design", "DevOps", "AI / ML"];

export function ConnectJobsMock() {
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
            CLIVORA OS · Connect Jobs Board
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-2 py-0.5 text-[9px] font-bold text-teal-300 border border-teal-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span>{stats.formattedJobs} Live Roles</span>
        </span>
      </div>

      <div className="flex min-h-[360px] flex-col sm:flex-row">
        {/* Dark Sidebar */}
        <aside className="hidden w-36 shrink-0 flex-col justify-between bg-[#0B1220] p-2.5 text-white sm:flex">
          <div>
            <p className="font-display text-[10px] font-bold tracking-wider text-teal-400 uppercase">Connect</p>
            <nav className="mt-2.5 space-y-1">
              <div className="flex items-center gap-1.5 rounded-md bg-teal-600/30 px-2 py-1 text-[9px] font-bold text-teal-200">
                <Briefcase className="h-3 w-3" />
                <span>Search Jobs</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <Zap className="h-3 w-3" />
                <span>My Proposals</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium text-slate-400 hover:bg-white/5">
                <Sparkles className="h-3 w-3" />
                <span>Saved Roles</span>
              </div>
            </nav>
          </div>

          <div className="rounded-lg border border-teal-500/20 bg-teal-950/40 p-1.5 text-[8px]">
            <p className="font-bold text-teal-300">$0 Platform Cut</p>
            <p className="text-slate-400">Keep 100% of your rate</p>
          </div>
        </aside>

        {/* Main Jobs Listing Area */}
        <div className="flex-1 bg-slate-50/50 p-3 sm:p-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 shadow-xs">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400">Search {stats.formattedJobs} remote jobs, technologies, or budgets...</span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1">
            {CATEGORIES.map((c, i) => (
              <span
                key={c}
                className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                  i === 0
                    ? "bg-teal-700 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {/* Featured Job 1 */}
            <div className="rounded-xl border border-teal-200 bg-white p-3 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-teal-100 px-1.5 py-px text-[7px] font-black uppercase text-teal-800">
                      Verified
                    </span>
                    <h3 className="text-[11px] font-bold text-navy">Full-Stack Next.js and Supabase Architect</h3>
                  </div>
                  <p className="mt-1 text-[9px] text-slate-500">
                    Nova Labs · Remote Worldwide · <strong>$4,500.00 Fixed</strong>
                  </p>
                </div>
                <Link
                  href="/jobs"
                  className="rounded-lg bg-teal-700 px-2.5 py-1 text-[9px] font-bold text-white hover:bg-teal-800 transition"
                >
                  Apply
                </Link>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {["Next.js", "TypeScript", "PostgreSQL", "TailwindCSS"].map((t) => (
                  <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-medium text-slate-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Job 2 */}
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 opacity-85 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-navy">Senior Mobile App Developer (Flutter / React Native)</p>
                  <p className="text-[8px] text-slate-500">Apex Studio · $65/hr · Direct Milestone</p>
                </div>
                <Link
                  href="/jobs"
                  className="text-[9px] font-bold text-teal-700 hover:underline"
                >
                  Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
