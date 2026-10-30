import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, HelpCircle, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { UpworkFeeCalculatorClient } from "./UpworkFeeCalculatorClient";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Upwork Fee Calculator: Calculate True Platform Cuts (2026)",
  description:
    "Calculate your exact fee deductions on Upwork including the 10% flat freelancer service fee, connects proposal tokens, and withdrawal charges vs $0 on Clivora.",
  alternates: { canonical: `${site.url}/tools/upwork-fee-calculator` },
  keywords: [
    "upwork fee calculator",
    "upwork commission calculator",
    "how much does upwork take",
    "upwork connects cost calculator",
    "upwork 10 percent fee",
    "upwork alternatives zero fee",
  ],
};

const FAQS = [
  {
    q: "What is Upwork's official fee structure in 2026?",
    a: "Upwork charges a flat 10% freelancer service fee on all contracts regardless of billable volume (the legacy 20%/10%/5% sliding scale was retired). Additionally, freelancers must purchase 'Connects' at $0.15 each to apply for jobs (typically 8 to 16 connects per bid). Clients also pay a 5% marketplace fee plus a one-time $4.99 contract initiation fee.",
  },
  {
    q: "How much does an average freelancer lose on Upwork annually?",
    a: "A freelancer billing $6,500/month ($78,000/year) forfeits $7,800 in direct commissions, plus $360 to $700 in proposal tokens and withdrawal charges. Over a 3-year freelance career, this totals more than $25,000 in lost earnings.",
  },
  {
    q: "How does Clivora eliminate deal fees without charging hidden commissions?",
    a: "Clivora is a Freelancer Operating System, not a rent-seeking marketplace broker. Invoices generated in Clivora are settled directly between client and freelancer via bank wire, ACH, Wise, or card. Clivora does not take a percentage cut of your transaction.",
  },
  {
    q: "Can I migrate existing Upwork clients to Clivora legally?",
    a: "Freelancers and clients frequently transition established long-term working relationships off marketplace platforms once mutual trust is proven. Clivora provides the complete business infrastructure (milestone tracking, PDF invoices, client CRM, and task boards) to run the relationship professionally.",
  },
];

export default function UpworkFeeCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Upwork Fee Calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Calculate total Upwork fee deductions including 10% service charges, connects costs, and payout processing fees.",
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-[#FFF1F2] via-[#F8FAFC] to-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-navy transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/tools" className="hover:text-navy transition-colors">
              Tools
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-slate-800">Upwork Fee Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-800">
              <ShieldCheck className="h-3.5 w-3.5 text-red-600" />
              <span>Platform Take-Rate Audit · Free Utility</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Upwork Marketplace Fee Calculator
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Calculate your exact dollar losses to Upwork&apos;s 10% service fee, connects bidding tokens, and withdrawal
              charges, and see the financial impact of keeping 100% of your earnings.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <UpworkFeeCalculatorClient />

          <div className="mt-12">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Educational Content & FAQ */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
            <h2 className="font-display text-2xl font-bold text-navy">
              The Real Cost of Freelance Marketplaces
            </h2>
            <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-slate-600">
              <p>
                When platform fees are marketed as &quot;just 10%&quot;, it sounds manageable. But in practice, that 10% comes
                directly off your top-line gross billables before accounting for income taxes, health insurance, or software expenses.
              </p>
              <p>
                When combined with pay-to-play bidding tokens (Connects) and payout withdrawal fees, full-time freelancers routinely
                forfeit between $8,000 and $20,000 every single year. That is capital that could fund health insurance, retirement
                contributions, or team expansion.
              </p>
            </div>

            {/* FAQs */}
            <div className="mt-10 border-t border-slate-100 pt-8">
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
