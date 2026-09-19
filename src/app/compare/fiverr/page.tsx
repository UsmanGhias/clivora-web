import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Minus,
  ChevronRight,
  Home,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clivora vs Fiverr: 2026 Freelancer & Agency Comparison | CLIVORA",
  description:
    "Compare Clivora and Fiverr. Learn why high-value consultants, engineers, and digital studios choose Clivora's $0 fee operating system over Fiverr's 20% commission cut and 14-day payout delays.",
  alternates: { canonical: `${site.url}/compare/fiverr` },
  keywords: [
    "clivora vs fiverr",
    "fiverr alternative zero commission",
    "fiverr fee comparison",
    "fiverr 20 percent fee alternative",
    "freelance retainer software",
  ],
};

const COMPARISON_ROWS = [
  {
    feature: "Seller Commission Cut",
    clivora: "$0 (0% on all negotiated deals)",
    fiverr: "20% flat deducted from all orders",
    clivoraWins: true,
  },
  {
    feature: "Buyer Order Surcharge",
    clivora: "$0 client fee",
    fiverr: "5.5% + $2 to $3 order processing fee",
    clivoraWins: true,
  },
  {
    feature: "Project Type & Engagement",
    clivora: "Custom retainers, hourly rates, & milestones",
    fiverr: "Pre-packaged micro-gigs & tiered bundles",
    clivoraWins: true,
  },
  {
    feature: "Fund Clearance & Payout Hold",
    clivora: "Instant upon invoice settlement (no hold)",
    fiverr: "14 days mandatory escrow clearance",
    clivoraWins: true,
  },
  {
    feature: "Client CRM & Contact Portability",
    clivora: "Full client records, email, phone, notes",
    fiverr: "Strictly forbidden (messaging filters)",
    clivoraWins: true,
  },
  {
    feature: "Direct Professional Invoicing",
    clivora: "Custom PDF invoices with tax and discounts",
    fiverr: "Fiverr standard checkout receipts only",
    clivoraWins: true,
  },
  {
    feature: "Built-In Project Time Tracker",
    clivora: "Included (Web & Android timer sync)",
    fiverr: "None (Deliverable files only)",
    clivoraWins: true,
  },
];

const FAQS = [
  {
    q: "Why does Fiverr take 20% from sellers?",
    a: "Fiverr originally started as a $5 micro-task board where a 20% cut equaled $1.00. As freelancers began selling $1,000 to $5,000 technical projects on the platform, Fiverr maintained that same 20% take rate, extracting hundreds or thousands of dollars from each high-ticket engagement.",
  },
  {
    q: "Is Clivora suitable for complex engineering contracts?",
    a: "Yes. Unlike Fiverr's rigid gig tiers, Clivora is built specifically for software developers, designers, and agency studios. You can structure complex project milestones, track billable hours with a live timer, manage client tasks, and send itemized professional invoices.",
  },
  {
    q: "Can clients hire talent directly on Clivora?",
    a: "Yes. Clivora Connect allows clients to post project briefs or hire talent directly. Profiles are vetted, and contact details stay private until both parties review and mutually accept the engagement.",
  },
];

export default function CompareFiverrPage() {
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
            <Link href="/compare" className="hover:text-navy transition-colors">
              Compare
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-slate-800">Clivora vs Fiverr</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>Platform Comparison · 2026 Edition</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Clivora vs Fiverr: Stop Giving Up 20% of Every Deal
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Compare the economics of selling pre-packaged gigs under heavy commission cuts versus running
              a high-ticket freelance business with direct invoicing and $0 fees.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-4 px-6 font-bold text-navy">Capability</th>
                  <th className="py-4 px-6 font-bold text-teal-800 bg-teal-50/40 w-1/3">
                    CLIVORA (Freelancer OS)
                  </th>
                  <th className="py-4 px-6 font-bold text-slate-500 w-1/3">
                    Fiverr Marketplace
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-navy text-xs sm:text-sm">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 bg-teal-50/20 text-xs sm:text-sm font-semibold text-teal-950">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-teal-700 shrink-0" />
                        <span>{row.clivora}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs sm:text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Minus className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{row.fiverr}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Mathematical Contrast Box */}
          <div className="mt-12 rounded-3xl border border-teal-200/80 bg-gradient-to-br from-[#F0FDFA] to-white p-8 sm:p-12 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">The 20% Take Rate Reality</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                  On a $5,000 engineering milestone:
                </h2>
                <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
                  <p>
                    <strong>On Fiverr:</strong> Fiverr deducts $1,000 (20%) directly from your payout, and holds the remaining $4,000 for 14 days before you can withdraw it. Your client is also billed $275 in processing fees.
                  </p>
                  <p>
                    <strong>On Clivora:</strong> Platform fee is $0. You invoice the client for $5,000, they pay you directly, and you keep all $5,000 immediately without clearance holds.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/tools/freelance-rate-calculator"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 underline"
                  >
                    <span>Calculate your true billable rate with our free calculator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-teal-200 bg-white p-6 shadow-sm text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Direct Cash Retained per $5,000
                </span>
                <p className="mt-2 font-display text-4xl sm:text-5xl font-extrabold text-teal-800">
                  +$1,000
                </p>
                <p className="mt-1 text-xs text-slate-500">Zero clearance delay · 100% direct</p>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <Link
                    href="/signup"
                    className="block w-full rounded-xl bg-navy py-3 px-4 text-xs font-bold text-white transition hover:bg-navy/90"
                  >
                    Create Free Workspace
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
            <h3 className="font-display text-xl font-bold text-navy">Frequently Asked Questions</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {FAQS.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <h4 className="flex items-start gap-2 text-sm font-bold text-navy">
                    <HelpCircle className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
