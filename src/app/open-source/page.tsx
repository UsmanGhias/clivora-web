import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Database,
  Globe2,
  Layers,
  Lock,
  Server,
  ShieldCheck,
  Smartphone,
  Star,
  Zap,
  Download,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { site } from "@/lib/site";
import { GitHubIcon } from "@/components/marketing/SocialBrandIcons";

export const metadata: Metadata = {
  title: "World's #1 Open-Source Client & Freelancer OS | Clivora",
  description:
    "Clivora is the world's first complete open-source client and freelancer operating system. 0% platform fees, 7,150+ live remote jobs, self-hostable with Docker, Next.js 15, and Supabase.",
  alternates: { canonical: `${site.url}/open-source` },
  keywords: [
    "open source freelancer platform",
    "open source client portal",
    "open source Upwork alternative",
    "open source Fiverr alternative",
    "self hosted freelance CRM",
    "Clivora GitHub",
    "free remote jobs platform",
  ],
};

const COMPARISON_ROWS = [
  {
    feature: "Platform Take Rate on Deals",
    clivora: "0% ($0 middleman fee)",
    upwork: "10% to 20% + client fees",
    fiverr: "20% seller + buyer fees",
    bonsai: "$25 to $79 / month",
  },
  {
    feature: "Source Code Availability",
    clivora: "100% Open Source (GitHub)",
    upwork: "Proprietary / Closed",
    fiverr: "Proprietary / Closed",
    bonsai: "Proprietary / Closed",
  },
  {
    feature: "Self-Hostable Infrastructure",
    clivora: "Yes (Docker, Supabase, Postgres)",
    upwork: "No",
    fiverr: "No",
    bonsai: "No",
  },
  {
    feature: "Live Remote Jobs Harvester",
    clivora: "Built-in (7,150+ verified roles)",
    upwork: "Marketplace only (Paid Connects)",
    fiverr: "Gigs only (buyer requests retired)",
    bonsai: "None",
  },
  {
    feature: "Direct Client Invoicing & Payouts",
    clivora: "Direct bank, Stripe, Safepay",
    upwork: "Locked to platform escrow",
    fiverr: "Locked to platform balance",
    bonsai: "Stripe / PayPal",
  },
  {
    feature: "Data Sovereignty & DB Export",
    clivora: "Full SQL / JSON export anytime",
    upwork: "Limited CSV exports",
    fiverr: "Limited CSV exports",
    bonsai: "CSV exports",
  },
  {
    feature: "Mobile App Included",
    clivora: "Flutter native Android & web sync",
    upwork: "Marketplace app",
    fiverr: "Marketplace app",
    bonsai: "Mobile web / app",
  },
];

const openSourceJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Clivora Open-Source Client & Freelancer OS",
  description:
    "The world's first complete open-source client and freelancer operating system. 0% platform fees, 7,150+ live remote jobs, offline Drift SQLite CRM, and self-hostable Docker architecture.",
  codeRepository: "https://github.com/UsmanGhias/clivora",
  programmingLanguage: ["Dart", "Flutter", "TypeScript", "Next.js", "SQL"],
  license: "https://github.com/UsmanGhias/clivora/blob/main/LICENSE",
  runtimePlatform: "Android, Web, Linux, Docker",
  author: {
    "@type": "Person",
    name: "Usman Ghias",
    url: "https://usmanghias.co.uk",
  },
  publisher: {
    "@type": "Organization",
    name: "CODCrafters",
    url: "https://codcrafters.org",
  },
};

export default function OpenSourcePage() {
  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(openSourceJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#F0FDF9] via-white to-white py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(13,148,136,0.18),transparent_70%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Pill Header */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2">
              <a
                href={site.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-teal-300 bg-white px-3.5 py-1.5 shadow-xs transition hover:border-teal-500 hover:bg-teal-50"
              >
                <GitHubIcon className="h-4 w-4 text-slate-900" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-navy">
                  GitHub Repository
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-black text-amber-900">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  ★ 1 Star
                </span>
              </a>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                Apache 2.0 / MIT Dual Licensed
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-navy sm:text-6xl lg:text-[4rem] leading-[1.08]">
              World&apos;s #1 Open-Source{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600">
                Client &amp; Freelancer OS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base text-slate-600 sm:text-xl leading-relaxed max-w-3xl mx-auto">
              Break free from 20% platform taxes. Clivora delivers a complete, production-grade operating system for client management, private Connect hiring, milestone invoicing, and 7,150+ live remote jobs with zero commission rake.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto">
              <a
                href={site.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-navy px-6 py-3 text-sm font-bold text-white shadow-xl shadow-navy/20 transition hover:bg-navy/90 hover:scale-[1.02] whitespace-nowrap shrink-0"
              >
                <GitHubIcon className="h-4 w-4 fill-white shrink-0" />
                <span className="whitespace-nowrap">Star on GitHub</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/25 px-2 py-0.5 text-xs font-extrabold text-amber-300 border border-amber-400/40 whitespace-nowrap">
                  ★ 1
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-navy shadow-xs transition hover:border-teal-400 hover:bg-teal-50 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Use Free Cloud Instance</span>
                <ArrowRight className="h-4 w-4 text-teal-700 shrink-0" />
              </Link>

              <Link
                href="/jobs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-teal-200 bg-teal-50/70 px-5 py-3 text-sm font-bold text-teal-900 transition hover:bg-teal-100 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Browse 7,150+ Remote Jobs</span>
              </Link>

              <a
                href={site.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-navy shadow-xs transition hover:border-teal-400 hover:bg-teal-50 whitespace-nowrap shrink-0"
              >
                <Smartphone className="h-4 w-4 text-teal-700 shrink-0" />
                <span className="whitespace-nowrap">Install on Google Play (v5.6.2)</span>
              </a>
            </div>
          </div>

          {/* Quickstart Terminal Card */}
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0B132B] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">quickstart.sh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-teal-500/20 px-2 py-0.5 font-mono text-[11px] text-teal-300">
                  Docker + Next.js 15
                </span>
              </div>
            </div>

            <pre className="mt-4 overflow-x-auto font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
              <code>
                <span className="text-slate-500"># 1. Clone the repository</span>
                {"\n"}
                <span className="text-teal-400">git clone</span> https://github.com/UsmanGhias/clivora.git
                {"\n"}
                <span className="text-teal-400">cd</span> clivora
                {"\n\n"}
                <span className="text-slate-500"># 2. Configure environment credentials</span>
                {"\n"}
                <span className="text-teal-400">cp</span> clivora-web/.env.example clivora-web/.env.local
                {"\n\n"}
                <span className="text-slate-500"># 3. Launch the web platform</span>
                {"\n"}
                <span className="text-teal-400">cd</span> clivora-web &amp;&amp; <span className="text-teal-400">npm</span> install &amp;&amp; <span className="text-teal-400">npm</span> run dev
                {"\n\n"}
                <span className="text-slate-500"># Ready at http://localhost:3000 with 0% platform fees</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Why Open Source Matters Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-teal-800">
              Zero Platform Commission
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Why an open-source operating system changes freelancing
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Proprietary marketplaces profit by locking you into closed messaging, taking 10% to 20% from every payment, and threatening account closures. Clivora replaces the middleman with transparent software.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "0% Commission Guarantee",
                description:
                  "Keep 100% of the money you earn. On a $10,000 project, legacy platforms extract $2,000 in fees. Clivora charges $0 on your completed invoices.",
              },
              {
                icon: Database,
                title: "Complete Data Sovereignty",
                description:
                  "All your clients, invoices, project timesheets, and contracts reside in a PostgreSQL schema you control. Export or migrate anytime without restrictions.",
              },
              {
                icon: Globe2,
                title: "7,150+ Remote Jobs Aggregated",
                description:
                  "Automated crawling pipeline pulls real-time engineering, design, and marketing roles directly from top companies. No paid tokens required to apply.",
              },
              {
                icon: Lock,
                title: "Private Connect Direct Hiring",
                description:
                  "Contact information is sealed until both freelancer and client accept the match. No spam, no cold outreach leaks, and no platform gatekeepers.",
              },
              {
                icon: Smartphone,
                title: "Native Android & Web Sync",
                description:
                  "Work on laptop or mobile. Cross-platform sync via Supabase and Flutter ensures your active contracts and invoices update everywhere in real time.",
              },
              {
                icon: Server,
                title: "Self-Hostable Anywhere",
                description:
                  "Deploy on your own VPS, Hostinger, AWS, or run locally via Docker. You never have to worry about a marketplace shutting down your livelihood.",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:border-teal-300 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-navy">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-teal-800">
              Feature Matrix
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Clivora Open Source vs Legacy Marketplaces
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Direct comparison of capabilities, licensing, data ownership, and financial terms.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 font-bold text-navy">Capability</th>
                  <th className="px-5 py-4 font-extrabold text-teal-900 bg-teal-50/70 border-x border-teal-200">
                    Clivora (Open Source)
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-700">Upwork</th>
                  <th className="px-5 py-4 font-semibold text-slate-700">Fiverr</th>
                  <th className="px-5 py-4 font-semibold text-slate-700">Hello Bonsai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 font-semibold text-navy">{row.feature}</td>
                    <td className="px-5 py-4 font-bold text-teal-900 bg-teal-50/40 border-x border-teal-200">
                      {row.clivora}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{row.upwork}</td>
                    <td className="px-5 py-4 text-slate-600">{row.fiverr}</td>
                    <td className="px-5 py-4 text-slate-600">{row.bonsai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Technical Architecture Blueprint */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-teal-800">
              Stack Architecture
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Engineered for speed, scale, and zero lock-in
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Built using battle-tested web and mobile technologies. Designed to be inspected, extended, and self-hosted with minimal operational friction.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800 mb-4">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-navy">Frontend &amp; SSR</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Next.js 15 App Router with React 19 server components, Tailwind CSS styling, and zero layout shift design.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-800 mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-navy">Database &amp; RLS</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Supabase PostgreSQL with strict Row Level Security (RLS) guaranteeing total multi-tenant data isolation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 mb-4">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-navy">Native Mobile</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Flutter 3.x cross-platform client for Android and iOS with offline-first data sync and biometric unlock.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href={site.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  <Smartphone className="h-3 w-3" />
                  Install on Google Play (v5.6.2)
                </a>
                <a
                  href="/download/apk"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-navy underline"
                >
                  Direct APK (v5.6.2) →
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-800 mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-navy">Jobs Harvester</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Automated ingestion engine indexing 7,150+ verified remote jobs across 12 categories with sub-second filtering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Engineering Oversight */}
      <section className="py-16 sm:py-20 bg-[#0B132B] text-white">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="rounded-3xl border border-slate-700 bg-white/[0.04] p-8 sm:p-12 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-500 font-display text-2xl font-black text-navy">
                UG
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">Usman Ghias</h3>
                  <span className="rounded-full bg-teal-500/20 px-3 py-0.5 text-xs font-semibold text-teal-300 border border-teal-500/30">
                    Lead Systems Architect &amp; Founder
                  </span>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  I created Clivora after seeing independent contractors and agencies lose tens of thousands of dollars each year to marketplace commissions, while dealing with delayed escrow releases and arbitrary account suspensions. Clivora is built as an open-source public good: complete code transparency, 0% platform take rates, and full data control for freelancers and clients worldwide.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-teal-300">
                  <a
                    href="https://usmanghias.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-white transition"
                  >
                    Personal Portfolio (usmanghias.co.uk) ↗
                  </a>
                  <a
                    href="https://codcrafters.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-white transition"
                  >
                    CODCrafters Studio ↗
                  </a>
                  <a
                    href={site.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-white transition"
                  >
                    GitHub: UsmanGhias/clivora ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-12 text-center">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
              Star the repository &amp; launch your workspace
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Join thousands of developers, designers, and hiring managers running their business on open-source rails.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={site.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-8 py-3.5 text-sm font-bold text-navy shadow-lg shadow-teal-900/30 hover:bg-teal-300 transition"
              >
                <GitHubIcon className="h-5 w-5" />
                <span>Star on GitHub (★ 1)</span>
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition"
              >
                <span>Launch Free Cloud Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
