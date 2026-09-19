import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Minus,
  ChevronRight,
  Home,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clivora vs Upwork: 2026 In-Depth Freelance Platform Comparison | CLIVORA",
  description:
    "Compare Clivora and Upwork side-by-side. See why professional freelancers and hiring clients are moving away from Upwork's 10% commission, paid connects, and payout holds to Clivora's $0 fee operating system.",
  alternates: { canonical: `${site.url}/compare/upwork` },
  keywords: [
    "clivora vs upwork",
    "upwork alternative zero fee",
    "upwork vs clivora comparison",
    "freelance platform without fees",
    "upwork commission alternative",
  ],
};

const COMPARISON_ROWS = [
  {
    feature: "Platform Deal Fee / Commission",
    clivora: "$0 (0% on negotiated deals)",
    upwork: "0% to 15% variable fee (10% standard marketplace)",
    clivoraWins: true,
  },
  {
    feature: "Job Application Cost (Connects)",
    clivora: "Free / No token bidding required",
    upwork: "$0.15/token (8–16+ connects per bid, up to 50+ auction boost)",
    clivoraWins: true,
  },
  {
    feature: "Client Marketplace Surcharge",
    clivora: "$0 client fee",
    upwork: "Up to 7.99% Marketplace Fee + $0.99–$14.99 initiation fee",
    clivoraWins: true,
  },
  {
    feature: "Payment Method & Flow",
    clivora: "Direct invoice settlement (Bank, ACH, Wise, Card)",
    upwork: "Locked inside Upwork escrow ledger",
    clivoraWins: true,
  },
  {
    feature: "Payout Release Timeline",
    clivora: "Instant upon client payment (no hold)",
    upwork: "5 to 14 days mandatory escrow hold",
    clivoraWins: true,
  },
  {
    feature: "Client Relationship Ownership",
    clivora: "Full ownership (Direct email, CRM, contacts)",
    upwork: "Non-circumvention terms (2-year lockout unless conversion paid)",
    clivoraWins: true,
  },
  {
    feature: "Integrated Client CRM & Pipeline",
    clivora: "Included (Full business command center)",
    upwork: "None (Bidding stream only)",
    clivoraWins: true,
  },
  {
    feature: "Native Mobile Operating App",
    clivora: "Android app + Web with cloud sync",
    upwork: "Separate Freelancer & Client apps",
    clivoraWins: true,
  },
  {
    feature: "Private Contact Protocol",
    clivora: "Contact private until mutual proposal accept",
    upwork: "Heavily monitored chat with keyword filters",
    clivoraWins: true,
  },
];

const FAQS = [
  {
    q: "Why did Upwork switch to a flat 10% fee?",
    a: "Upwork previously offered a tiered model where fees dropped from 20% to 10% after $500, and to 5% after $10,000 billed with a single client. In 2023, Upwork simplified this to a flat 10% across all billings, which effectively raised fees on long-term relationships from 5% to 10%. Clivora replaces this with a $0 platform fee on negotiated deals.",
  },
  {
    q: "Can I bring my existing Upwork clients to Clivora?",
    a: "Upwork's Terms of Service enforce a non-circumvention rule requiring a formal conversion fee if transitioning a relationship originated on Upwork off-platform during the first two years. For independent clients you source directly, alumni contracts outside the compliance window, or inbound leads, Clivora provides the complete $0-fee operating system with zero lockouts.",
  },
  {
    q: "How does Clivora protect against non-payment without an escrow lock?",
    a: "Clivora provides structured contract drafting with milestone delivery schedules, clear acceptance criteria, and integrated invoice tracking. For large scopes, independent contractors work on upfront milestone deposits (e.g. 50% upfront, 50% on delivery), which is the enterprise industry standard.",
  },
  {
    q: "Does Clivora have a public job board like Upwork?",
    a: "Yes. Clivora Connect is an active directory of verified tech, design, marketing, and engineering roles. Freelancers can apply directly without buying proposal tokens or bidding on boost ranks.",
  },
];

export default function CompareUpworkPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative border-b border-slate-200 bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFC] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Breadcrumbs */}
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
            <span className="font-semibold text-slate-800">Clivora vs Upwork</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>Platform Comparison · 2026 Edition</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Clivora vs Upwork: Which Platform Is Right for You?
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Explore why seasoned developers, consultants, and clients are choosing a sovereign Freelancer OS
              over pay-to-play bidding tokens and 10% commission leakage.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
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
                    Upwork Marketplace
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
                        <span>{row.upwork}</span>
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

          {/* Mathematical Breakdown Box */}
          <div className="mt-12 rounded-3xl border border-teal-200/80 bg-gradient-to-br from-[#F0FDFA] to-white p-8 sm:p-12 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">The Hard Financial Math</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                  On a $10,000 / month freelance contract:
                </h2>
                <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
                  <p>
                    <strong>On Upwork:</strong> You lose $1,000 in service commission, $30–$50 in connects tokens, and $30 in withdrawal fees every month. Your client pays an extra $500 in marketplace fees. Total capital extracted: <strong>$18,000+ per year</strong>.
                  </p>
                  <p>
                    <strong>On Clivora:</strong> Platform fee stays $0. Your client pays you directly against your invoice. You retain $10,000. Total annual capital saved: <strong>$18,000+ per year</strong>.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/tools/upwork-fee-calculator"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 underline"
                  >
                    <span>Run your own numbers in our Upwork Fee Calculator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-teal-200 bg-white p-6 shadow-sm text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Annual Freelancer Savings
                </span>
                <p className="mt-2 font-display text-4xl sm:text-5xl font-extrabold text-teal-800">
                  +$18,000
                </p>
                <p className="mt-1 text-xs text-slate-500">Based on $10k/mo steady client volume</p>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <Link
                    href="/signup"
                    className="block w-full rounded-xl bg-navy py-3 px-4 text-xs font-bold text-white transition hover:bg-navy/90"
                  >
                    Open Free Clivora Workspace
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Editorial Comparison */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy">
                Why Independent Professionals Are Moving Away from Marketplace Intermediaries
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                In the early 2010s, marketplaces like Elance and oDesk provided real value by solving trust and payment processing
                across borders. Today, global banking rails (Wise, Stripe, SEPA, ACH) are standardized and secure. 
                Yet platforms continue to increase fees, restrict client communication, and charge freelancers to bid on contracts.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                <h3 className="font-display text-base font-bold text-navy">The Connects Pay-to-Play Bottleneck</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                  Upwork increasingly monetizes proposal tokens. With bidding auctions where top spots cost up to 50 connects,
                  freelancers are forced to gamble money just to have their proposals viewed by clients who may never open them.
                  Clivora provides direct discovery on Connect with zero paid bidding mechanics.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                <h3 className="font-display text-base font-bold text-navy">True Operating System vs Gig Broker</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                  Upwork is an advertising and brokerage board; once a contract starts, its tools for client relationship management,
                  custom invoices, and timesheet exports are minimal. Clivora gives you a complete operating system: client CRM,
                  task boards, milestone tracking, timesheets, and direct PDF invoicing all in one workspace.
                </p>
              </div>
            </div>

            {/* FAQs */}
            <div className="border-t border-slate-100 pt-8">
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
        </div>
      </section>
    </MarketingShell>
  );
}
