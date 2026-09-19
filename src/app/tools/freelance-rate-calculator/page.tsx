import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, HelpCircle, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { RateCalculatorClient } from "./RateCalculatorClient";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Freelance Hourly & Day Rate Calculator (100% Free) | CLIVORA",
  description:
    "Calculate your exact target freelance hourly and day rate based on desired net income, national taxes, business overhead, and billable utilization.",
  alternates: { canonical: `${site.url}/tools/freelance-rate-calculator` },
  keywords: [
    "freelance rate calculator",
    "hourly rate calculator for freelancers",
    "how to calculate freelance day rate",
    "freelance pricing formula",
    "consultant billable rate calculator",
  ],
};

const FAQS = [
  {
    q: "Why do freelancers need to charge 2x to 3x an employee salary?",
    a: "Full-time employees receive employer-subsidized healthcare, paid time off, retirement contributions, and dedicated equipment. As an independent professional, you cover your own self-employment taxes (15.3% in the US), health insurance, software licenses, laptop upgrades, and unbillable sales time. Charging 2x to 3x your corporate hourly equivalent is the standard baseline to achieve financial parity.",
  },
  {
    q: "What is a realistic billable utilization rate?",
    a: "Most solo freelancers and independent consultants bill between 55% and 70% of their dedicated working hours. The remaining 30% to 45% is consumed by scoping calls, proposal drafting, invoicing, bookkeeping, code audits, and administrative coordination.",
  },
  {
    q: "Should I bill clients hourly, daily, or on fixed milestones?",
    a: "For exploratory architectural audits or ongoing staff augmentation, hourly or daily retainers work best. For well-scoped product builds, milestone-based fixed budgets protect both client cash flow and your delivery speed. Clivora supports both models with direct invoicing and $0 platform fees.",
  },
  {
    q: "How does traditional marketplace commission affect this rate?",
    a: "Marketplaces like Upwork and Fiverr extract 10% to 20% from every dollar you bill. If your target gross revenue is $100,000, you have to inflate your rates by $12,000 to $25,000 just to offset platform leakage and proposal token fees. Clivora maintains a $0 deal fee so your clients pay you directly on the invoice.",
  },
];

export default function FreelanceRateCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Freelance Hourly & Day Rate Calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Calculate your exact target freelance hourly rate, day rate, and annual billable revenue targets based on net income and overhead.",
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFC] to-white py-12 sm:py-16">
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
            <span className="font-semibold text-slate-800">Freelance Rate Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>Interactive Pricing Engine · Free Utility</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Freelance Hourly &amp; Day Rate Calculator
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Reverse-engineer your true billable hourly and day rates from desired take-home salary, income taxes,
              annual business overhead, and billable capacity.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <RateCalculatorClient />

          <div className="mt-12">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Educational Content & FAQ */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
            <h2 className="font-display text-2xl font-bold text-navy">
              The Freelance Pricing Formula Explained
            </h2>
            <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-slate-600">
              <p>
                Many professionals transitioning from full-time employment make the mistake of dividing their past salary by
                2,080 hours (40 hours × 52 weeks). This calculation produces an artificially depressed rate because it assumes
                100% billability, zero taxes, zero sick leave, and zero business expenses.
              </p>
              <div className="rounded-2xl bg-slate-50 p-5 font-mono text-xs sm:text-sm text-slate-800 border border-slate-200">
                Minimum Hourly Rate = (Desired Net Income ÷ (1 - Tax Rate) + Annual Overhead) ÷ (Billable Weeks × Billable Hours/Week)
              </div>
              <p>
                By accounting for non-billable client discovery, invoicing, and platform fees up front, you avoid undercharging
                and build sustainable cash reserves for your independent consultancy.
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
