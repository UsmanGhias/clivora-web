import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  Smartphone,
  CreditCard,
  Database,
  GitBranch,
  Cloud,
  ChevronRight,
  Home,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Ecosystem Integrations: Odoo, Google Play, Stripe | ${site.name}`,
  description:
    "Explore Clivora integrations. Connect your freelance business to Odoo ERP accounting, Google Play mobile billing, Stripe payments, and cloud file storage.",
  alternates: { canonical: `${site.url}/integrations` },
  keywords: [
    "clivora integrations",
    "odoo freelance integration",
    "freelance stripe integration",
    "google play subscription sync",
    "freelancer erp export",
  ],
};

const INTEGRATIONS = [
  {
    title: "Odoo ERP Business Suite",
    badge: "Enterprise Accounting",
    icon: Database,
    color: "from-purple-500/10 to-purple-500/5 text-purple-700 border-purple-200",
    description:
      "Seamlessly synchronize settled client invoices, tax ledgers, and contact profiles into Odoo's native res.partner and accounting tables.",
    features: ["Automated invoice synchronization", "Zero external addon dependency", "Direct chart-of-accounts export"],
  },
  {
    title: "Google Play Store & Android",
    badge: "Mobile Billing & Sync",
    icon: Smartphone,
    color: "from-emerald-500/10 to-emerald-500/5 text-emerald-700 border-emerald-200",
    description:
      "Manage Pro and Pro Plus subscriptions securely through Google Play Billing. Experience real-time bi-directional sync with the native Android app.",
    features: ["Official Google Play subscription security", "Instant cross-device hydration", "Offline-first timer cache"],
  },
  {
    title: "Stripe & Safepay Financial Rails",
    badge: "Payment Processing",
    icon: CreditCard,
    color: "from-blue-500/10 to-blue-500/5 text-blue-700 border-blue-200",
    description:
      "Accept credit cards, debit cards, and local wire transfers from international clients with PCI-DSS Level 1 tokenized security.",
    features: ["Direct bank payouts", "Zero platform middleman deductions", "Multi-currency invoicing"],
  },
  {
    title: "Supabase High-Scale Cloud Engine",
    badge: "Database & Auth",
    icon: Cloud,
    color: "from-teal-500/10 to-teal-500/5 text-teal-700 border-teal-200",
    description:
      "Powered by Postgres Row-Level Security, instant edge auth, and encrypted blob storage for your mission-critical business records.",
    features: ["Tenant-isolated data access", "AES-256 encrypted file vault", "Global edge caching"],
  },
  {
    title: "GitHub & Developer Tooling",
    badge: "Engineering Ecosystem",
    icon: GitBranch,
    color: "from-slate-700/10 to-slate-700/5 text-slate-800 border-slate-300",
    description:
      "Link GitHub pull requests and project repository deliverables directly to client milestone scopes and payment approvals.",
    features: ["Milestone deliverable verification", "Markdown project brief support", "Live code playground integration"],
  },
  {
    title: "Export to CSV & Standard Accounting",
    badge: "Data Portability",
    icon: Layers,
    color: "from-amber-500/10 to-amber-500/5 text-amber-700 border-amber-200",
    description:
      "Export complete client ledgers, expense reports, timesheet hours, and invoice histories in standardized CSV and PDF formats.",
    features: ["One-click complete ledger export", "Standardized spreadsheet schemas", "Zero platform lock-in"],
  },
];

export default function IntegrationsPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative border-b border-slate-200 bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFC] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-navy transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-slate-800">Integrations</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <Layers className="h-3.5 w-3.5 text-teal-600" />
              <span>Connected Business Ecosystem</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Integrations &amp; Infrastructure
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Clivora connects directly with the enterprise tools, mobile app stores, and financial payment rails
              you rely on to run your independent business.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {item.badge}
                      </span>
                    </div>

                    <h2 className="mt-5 font-display text-base font-bold text-navy">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                      {item.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Callout */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 sm:p-12 shadow-xs">
            <div className="max-w-3xl">
              <h3 className="font-display text-2xl font-bold text-navy">
                Looking for a custom API or ERP workflow?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                CODCrafters specializes in custom enterprise integrations, distributed ERP deployments, and
                high-volume API architectures. If your agency or enterprise requires private server hooks or custom
                accounting pipelines, get in touch with our engineering team.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-navy/90 transition shadow-sm"
                >
                  Contact Engineering Team
                </Link>
                <Link
                  href="/about"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-navy hover:border-teal-500 transition"
                >
                  About CODCrafters Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
