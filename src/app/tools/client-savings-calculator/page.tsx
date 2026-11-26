import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Home, HelpCircle, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { ClientSavingsCalculatorClient } from "./ClientSavingsCalculatorClient";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Client Fee Savings Calculator: Audit Upwork Marketplace Surcharges (2026)",
  description:
    "Calculate how much companies, startups, and hiring managers save by eliminating Upwork's 7.99% client marketplace fee, contract initiation surcharges, and payment fees.",
  alternates: { canonical: `${site.url}/tools/client-savings-calculator` },
  keywords: [
    "client fee savings calculator",
    "upwork client fee calculator",
    "how much does upwork charge clients",
    "upwork marketplace fee for companies",
    "hire contractors without platform fees",
    "clivora client savings",
  ],
};

const FAQS = [
  {
    q: "How much does Upwork charge clients and companies?",
    a: "Upwork charges clients a Marketplace Fee of up to 7.99% on every invoice payment. Additionally, clients pay a contract initiation fee of $4.99 to $14.99 per hire, plus optional fees for premium talent badges or enterprise compliance. On an annual external contractor budget of $100,000, client surcharges alone total roughly $8,000 to $10,000 in non-billable overhead.",
  },
  {
    q: "Why does Clivora charge $0 in client marketplace fees?",
    a: "Clivora is a decentralized Freelancer and Client Operating System, not a rent-seeking marketplace broker. Invoices generated in Clivora are settled directly between client and contractor via bank wire, ACH, Wise, or card. Clivora does not take a percentage cut of your transaction.",
  },
  {
    q: "Are there contract initiation or conversion penalties on Clivora?",
    a: "No. Clivora does not enforce 2-year non-circumvention lockouts or charge conversion ransom fees. You have full ownership of your contractor relationships, direct email contacts, and project data.",
  },
  {
    q: "Can my company manage multiple contractor milestones and timesheets on Clivora?",
    a: "Yes. Clivora Client Workspace includes milestone tracking, timesheet review, contract drafting, and multi-currency invoicing all in a unified dashboard.",
  },
];

export default function ClientSavingsCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Client Fee Savings Calculator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Calculate corporate cost savings by eliminating Upwork's 7.99% client marketplace fee and contractor initiation surcharges.",
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
      <JsonLd data={jsonLd} />

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-[#F0FDF4] via-[#F8FAFC] to-white py-12 sm:py-16">
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
            <span className="font-semibold text-slate-800">Client Savings Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Corporate Procurement Audit · Free Tool</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Client Marketplace Fee Savings Calculator
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Calculate how much your company saves by eliminating Upwork&apos;s 7.99% client marketplace fee, contract initiation
              surcharges, and escrow holds.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Suspense fallback={<div className="h-96 rounded-3xl bg-slate-100 animate-pulse" />}>
            <ClientSavingsCalculatorClient />
          </Suspense>

          <div className="mt-12">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Educational Content & FAQ */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
            <h2 className="font-display text-2xl font-bold text-navy">
              Why Companies Are Moving Away from Marketplace Brokerages
            </h2>
            <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-slate-600">
              <p>
                When traditional platforms like Upwork started, they justified their fees by helping clients find global talent
                and providing basic escrow protection. Over time, however, fees have expanded on both sides of the transaction:
                freelancers pay a 10% commission, and clients pay an additional 7.99% markup plus contract initiation fees.
              </p>
              <p>
                For a technology company spending $100,000 annually on external contractors, this structure results in roughly
                $18,000 of lost capital every year between client surcharges and freelancer deductions. Clivora eliminates these
                arbitrary fees entirely, allowing companies to work directly with vetted professionals at true market rates.
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
