import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Lock,
  Layers,
  FileText,
  UserCheck,
  EyeOff,
  Building2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trust, Safety & Payment Standards",
  description:
    "Discover how Clivora safeguards freelancers and clients: $0 platform deal fees, direct milestone payment settlement, transparent job provenance, and verified reviews.",
  alternates: { canonical: `${site.url}/trust` },
  keywords: [
    "clivora trust",
    "freelancer payment safety",
    "zero platform fee marketplace",
    "direct client invoicing",
    "verified freelance contracts",
    "freelance escrow alternative",
  ],
};

const TRUST_PILLARS = [
  {
    icon: DollarSign,
    badge: "Financial Integrity",
    title: "Zero Platform Deal Fee ($0 Take Rate)",
    desc: "Traditional freelance platforms deduct between 10% and 20% of your billable earnings on every contract. Clivora operates on a 0% deal tax model. When you bill a client $5,000, you receive $5,000. Our platform is sustained through optional Pro workspace subscriptions and team tools, not by taxing your labor.",
  },
  {
    icon: FileText,
    badge: "Direct Settlement",
    title: "Direct Client Invoicing & Milestone Verification",
    desc: "Payments settle directly between clients and freelancers through standard financial rails including Stripe, ACH, wire transfers, and local banks. Clivora provides structured contract scopes, milestone deliverables, and verification workflows without holding funds in restrictive 14-day escrow hold periods.",
  },
  {
    icon: Layers,
    badge: "Job Provenance",
    title: "Strict Separation of Internal & Curated Opportunities",
    desc: "We maintain complete transparency regarding job origin. Clivora Client Projects originate from verified registered clients and support direct internal proposals. Curated Remote Opportunities are indexed from official tech employer job boards, clearly disclosing their original source and official portal application links.",
  },
  {
    icon: EyeOff,
    badge: "Privacy First",
    title: "Private Connect Two-Way Acceptance",
    desc: "Contact information including emails and direct messaging remains masked during initial talent discovery and proposal review. Contact details are revealed only when both parties mutually accept the engagement, protecting both sides from unsolicited spam, scraping, and unwanted cold solicitations.",
  },
  {
    icon: UserCheck,
    badge: "Reputation Integrity",
    title: "Closed-Loop Verified Reviews",
    desc: "Public ratings and reviews on Clivora cannot be purchased, fabricated, or submitted anonymously. Every review is tied directly to a completed project milestone and recorded payment receipt, ensuring that freelancer ratings reflect genuine client satisfaction and verified work.",
  },
  {
    icon: Lock,
    badge: "Data Sovereignty",
    title: "Complete Client & Work Ownership",
    desc: "You own your client relationships, project files, and invoicing history. Unlike traditional platforms that threaten bans for communicating outside their walled gardens, Clivora encourages long-term direct client relationships. You can export your data or close your account at any time.",
  },
];

const FAQS = [
  {
    q: "How does Clivora operate with a 0% fee on contracts?",
    a: "Clivora is built as a complete Freelancer Business OS under a 100% free model during our Founder Launch. We never take a percentage cut of your project billings or client deals. Funds flow directly from clients to your own accounts, allowing you to retain 100% of your earnings.",
  },
  {
    q: "Is Clivora an escrow agent or bank?",
    a: "No. Clivora is not a bank, licensed escrow agent, or money transmitter. We provide milestone tracking, digital sign-offs, and professional invoicing software. Funds flow directly from your client to your designated bank account or Stripe/Safepay merchant account, giving you immediate control over your cash flow without intermediaries holding your earnings.",
  },
  {
    q: "How do you verify companies posting jobs on Clivora?",
    a: "Companies posting internal projects on Clivora Connect undergo domain verification and work history validation. External curated opportunities are checked against official employer career portals to confirm role availability, compensation accuracy, and legitimacy before indexing.",
  },
  {
    q: "What happens if there is a dispute on a milestone?",
    a: "Clivora provides a structured milestone review record where deliverables, timestamps, and approved scopes are logged. If a disagreement arises, both parties have complete access to the project documentation and agreed-upon milestone deliverables to resolve terms directly.",
  },
];

export default function TrustPage() {
  return (
    <MarketingShell>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            <span>CLIVORA TRUST & SAFETY FRAMEWORK</span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Built for Transparency, Direct Payments, and Zero Platform Tax
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Traditional marketplaces trap freelancers behind commission paywalls and restrictive holding periods. 
            Clivora is architected around financial transparency, direct client relationships, and verified work.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-teal-700 transition-colors"
            >
              Start Free on Clivora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/security"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
            >
              Security Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Main Pillars Grid */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              The 6 Principles of Clivora Trust
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              How we protect your earnings, preserve client relationships, and ensure authenticity across the platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-xs hover:border-teal-500/50 hover:bg-white transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100/80 text-teal-800">
                        <Icon className="h-5 w-5 text-teal-700" />
                      </div>
                      <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AdSense Unit */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 my-6">
        <JobAdSenseSlot slotId="trust-page-mid-slot" format="banner" />
      </div>

      {/* Comparison Strip: Traditional vs Clivora */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Traditional Marketplaces vs Clivora
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              See the difference in economics and autonomy when you run your business on Clivora.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-100/70 text-slate-700">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Standard Platform Feature</th>
                  <th className="py-3.5 px-4 font-bold text-slate-500">Legacy Marketplaces</th>
                  <th className="py-3.5 px-4 font-bold text-teal-800 bg-teal-50/60">CLIVORA OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-slate-600">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Platform Take Rate</td>
                  <td className="py-3.5 px-4 text-rose-600 font-semibold">10% to 20% on all contracts</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">$0 Platform Deal Fee</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Payment Holding Period</td>
                  <td className="py-3.5 px-4 text-slate-500">5 to 14 days mandatory hold</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Instant direct settlement to bank</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Client Communication</td>
                  <td className="py-3.5 px-4 text-slate-500">Restricted, monitored under penalty of bans</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Unrestricted once mutual connection is accepted</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Job Transparency</td>
                  <td className="py-3.5 px-4 text-slate-500">Often obscured behind bidding tokens</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Explicit internal vs curated source tags</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Tooling Included</td>
                  <td className="py-3.5 px-4 text-slate-500">Basic chat only, requires external CRM</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Full CRM, projects, invoices, Android app</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Frequently Asked Questions About Trust & Payments
          </h2>
          <div className="space-y-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
                <h3 className="text-base font-bold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-slate-200 bg-slate-900 py-16 text-white text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Ready to Keep 100% of What You Earn?
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Create your free account today. Start billing clients directly, managing deliverables on milestones, and keeping your hard-earned revenue.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-teal-400 transition-colors"
            >
              Open Free Workspace
            </Link>
            <Link
              href="/jobs"
              className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              Browse Remote Jobs
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
