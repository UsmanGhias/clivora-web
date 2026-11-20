import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Home, HelpCircle, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { FiverrFeeCalculatorClient } from "./FiverrFeeCalculatorClient";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fiverr Fee Calculator: Calculate Your 20% Platform Cut (2026)",
  description:
    "Calculate your exact dollar losses to Fiverr's 20% flat seller commission, buyer service fees, and withdrawal charges vs $0 platform fees on Clivora.",
  alternates: { canonical: `${site.url}/tools/fiverr-fee-calculator` },
  keywords: [
    "fiverr fee calculator",
    "fiverr commission calculator",
    "how much does fiverr take",
    "fiverr 20 percent fee",
    "fiverr seller fees 2026",
    "fiverr alternatives zero fee",
  ],
};

const FAQS = [
  {
    q: "Does Fiverr really take 20% of every order?",
    a: "Yes. Fiverr charges a flat 20% seller service fee on every order regardless of tier or volume. If you complete a $1,000 gig order, Fiverr deducts $200 immediately, leaving you with $800 before taxes and payout fees.",
  },
  {
    q: "Does Fiverr take 20% of tips given by buyers?",
    a: "Yes. Many sellers are surprised to learn that Fiverr deducts the exact same 20% commission on client gratuities and tips. If a happy client tips you $100, you only receive $80.",
  },
  {
    q: "How much does an average freelancer lose on Fiverr annually?",
    a: "A freelancer averaging $4,500/month on Fiverr forfeits $10,800 every year in seller cuts alone, plus $50 to $200 in payout processing. Over 3 years, that is more than $32,000 lost to a single platform.",
  },
  {
    q: "How does Clivora compare to Fiverr for established sellers?",
    a: "Clivora is a Freelancer Operating System with $0 platform fees. Clients pay you directly on your own milestone invoices through Stripe or bank transfer. You keep 100% of your earnings, host private white-label client portals, and manage contracts professionally.",
  },
];

export default function FiverrFeeCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Fiverr Fee Calculator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Calculate total Fiverr deductions including the 20% seller commission, buyer fees, and payout withdrawal costs.",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-[#FFF7ED] via-[#F8FAFC] to-white py-12 sm:py-16">
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
            <span className="font-semibold text-slate-800">Fiverr Fee Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
              <span>Platform Take-Rate Audit · Free Utility</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Fiverr 20% Seller Fee Calculator
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Model your true financial loss from Fiverr&apos;s 20% commission on orders and tips, and see how much you save
              by billing clients directly on Clivora with 0% platform fees.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-slate-100" />}>
            <FiverrFeeCalculatorClient />
          </Suspense>

          <div className="mt-12">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Educational Content & FAQ */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
            <h2 className="font-display text-2xl font-bold text-navy">
              Why Fiverr&apos;s 20% Cut Costs More Than You Think
            </h2>
            <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-slate-600">
              <p>
                A 20% commission is double what most other platforms charge. On top of that, Fiverr charges buyers an additional
                5.5% plus a $3 order fee, making your services 25% more expensive to your clients while reducing what ends up
                in your bank account.
              </p>
              <p>
                When you transition ongoing clients to your own private Clivora client portal, you keep 100% of every invoice.
                There are no middleman fee cuts, no delayed 14-day clearance holding periods, and no bidding tokens.
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
