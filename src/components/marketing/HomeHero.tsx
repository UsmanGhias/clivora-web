"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { marketing } from "@/lib/marketing";
import { HeroWorkspacePreview } from "./HeroWorkspacePreview";
import { useLivePlatformStats } from "@/lib/useLivePlatformStats";
import { GitHubIcon } from "./SocialBrandIcons";

export function HomeHero() {
  const h = marketing.hero;
  const stats = useLivePlatformStats();

  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 pb-16 pt-8 sm:pb-24 lg:pb-32 lg:pt-14">
      {/* Dynamic ambient gradients */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_0%,rgba(13,148,136,0.14),transparent_60%),linear-gradient(180deg,#F0FDF9_0%,#FFFFFF_60%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:pr-4">
            {/* Live Status & Open Source Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://github.com/UsmanGhias/clivora"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-teal-300/80 bg-white px-3 py-1 shadow-xs transition hover:border-teal-500 hover:bg-teal-50/50"
                title="Star Clivora on GitHub - World's #1 Open-Source Client & Freelancer OS"
              >
                <GitHubIcon className="h-4 w-4 text-slate-800" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-navy">
                  World&apos;s #1 Open-Source Client OS
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 border border-amber-300/80 px-2 py-0.5 text-[10px] font-black text-amber-900 group-hover:bg-amber-200 transition">
                  ★ Star on GitHub
                </span>
              </a>

              <Link
                href="/open-source"
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-teal-50/80 px-3 py-1 text-[11px] font-bold text-teal-900 hover:bg-teal-100 transition shadow-xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />
                <span>100% Free · $0 Deal Fees</span>
              </Link>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 font-display text-[2.4rem] font-black leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.5rem]">
              <span className="block">{h.headline[0]}</span>
              <span className="mt-1 inline-block text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600">
                {h.headline[1]}
              </span>
            </h1>

            {/* Body */}
            <p className="mt-5 max-w-[36rem] text-[15px] leading-relaxed text-slate-600 sm:text-lg">
              {h.body}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <Link
                href={h.primaryCta.href}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-navy px-7 text-sm font-bold text-white shadow-xl shadow-navy/20 transition hover:bg-navy/90 hover:scale-[1.02]"
              >
                <span>{h.primaryCta.label}</span>
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href={h.secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300/80 bg-white/95 px-7 text-sm font-bold text-navy shadow-xs transition hover:border-teal-400 hover:text-teal-800 hover:bg-slate-50"
              >
                {h.secondaryCta.label}
              </Link>
            </div>

            {/* Live Interactive Bridges */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/90 px-3.5 py-1.5 text-xs font-bold text-teal-900 transition hover:bg-teal-100 hover:border-teal-300 shadow-xs"
              >
                <span className="h-2 w-2 rounded-full bg-teal-600 animate-ping" />
                <span>{stats.formattedJobs} Remote Jobs ($0 Fee)</span>
                <span className="text-teal-700 font-bold">→</span>
              </Link>
              <Link
                href="/jobs?lang=en"
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 shadow-xs"
              >
                <span>🇬🇧 English</span>
              </Link>
              <Link
                href="/jobs?lang=de"
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 shadow-xs"
              >
                <span>🇩🇪 Deutsch</span>
              </Link>
              <Link
                href="/jobs?lang=fr"
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 shadow-xs"
              >
                <span>🇫🇷 Français</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <li className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 p-3 text-[12px] font-bold text-slate-800 shadow-xs">
                <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />
                <span>$0 Platform Fee</span>
              </li>
              <li className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 p-3 text-[12px] font-bold text-slate-800 shadow-xs">
                <Zap className="h-4 w-4 shrink-0 text-cyan-600" />
                <span>Direct Invoicing</span>
              </li>
              <li className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 p-3 text-[12px] font-bold text-slate-800 shadow-xs">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Web + Android Sync</span>
              </li>
              <li className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/60 p-3 text-[12px] font-bold text-teal-950 shadow-xs">
                <GitHubIcon className="h-4 w-4 shrink-0 text-navy" />
                <span>100% Open Source</span>
              </li>
            </ul>

            <p className="mt-5 text-xs font-medium text-slate-500">{h.socialLine}</p>
          </div>

          {/* Right Column: Hero Interactive Workspace Showcase */}
          <div className="relative">
            <HeroWorkspacePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
