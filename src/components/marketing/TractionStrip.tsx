"use client";

import Link from "next/link";
import { marketing } from "@/lib/marketing";
import { useLivePlatformStats } from "@/lib/useLivePlatformStats";
import { GitHubIcon } from "./SocialBrandIcons";

export function TractionStrip() {
  const items = marketing.traction;
  const stats = useLivePlatformStats();

  const dynamicStats = [
    { value: stats.formattedJobs, label: "Active Remote Jobs" },
    { value: "$0", label: "Deal Platform Fee" },
    { value: "100%", label: "Open Source Client OS" },
    { value: "Direct", label: "Milestones & Payouts" },
  ];

  return (
    <section className="border-y border-slate-200/90 bg-white py-9">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="max-w-md">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-teal-800">
            World&apos;s #1 Open-Source Client &amp; Freelance OS
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">{items.line}</p>
        </div>
        <ul className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {dynamicStats.map((s) => (
            <li
              key={s.label}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-center sm:text-left transition hover:border-teal-300 hover:bg-teal-50/30"
            >
              <p className="font-display text-xl font-black text-navy sm:text-2xl">{s.value}</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-4 max-w-7xl px-5 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        <a
          href="https://github.com/UsmanGhias/clivora"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-teal-700 transition"
        >
          <GitHubIcon className="h-4 w-4 text-slate-800" />
          <span>Officially Open Source: Star on GitHub (★ 1.2k+) →</span>
        </a>
        <div className="flex items-center gap-4">
          <Link href="/compare" className="text-xs font-bold text-teal-700 hover:underline">
            Why businesses move off fee-heavy marketplaces →
          </Link>
          <Link href="/jobs" className="text-xs font-bold text-slate-500 hover:text-navy">
            Explore {stats.formattedJobs} open positions →
          </Link>
        </div>
      </div>
    </section>
  );
}
