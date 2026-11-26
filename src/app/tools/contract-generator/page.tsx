import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FileText, Home, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ContractGeneratorClient } from "./ContractGeneratorClient";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Free Freelance Contract & Milestone Agreement Generator",
  description:
    "Generate legally sound freelance service contracts and milestone agreements in minutes. Plain-English terms, 100% intellectual property transfer, and zero platform middleman fees.",
  alternates: { canonical: `${site.url}/tools/contract-generator` },
  keywords: [
    "freelance contract generator",
    "milestone agreement generator",
    "independent contractor agreement",
    "zero fee freelance contract",
    "freelance scope of work contract",
    "direct client agreement template",
  ],
};

const FAQS = [
  {
    q: "Is this freelance contract legally binding?",
    a: "Yes. When both contractor and client sign or exchange written acceptance (via email, electronic signature, or counter-signature), this agreement forms a legally enforceable independent contractor service contract covering scope, payment terms, and intellectual property transfer.",
  },
  {
    q: "Why does Clivora provide this contract generator for free?",
    a: "Traditional freelance marketplaces like Upwork charge 3.4% to 10% just to facilitate direct contracts between independent parties. Clivora operates as a zero-commission Freelancer OS, giving contractors and clients sovereign tools to manage relationships directly without middleman tolls.",
  },
  {
    q: "How does the Intellectual Property (IP) clause work?",
    a: "The agreement specifies that full copyright and IP ownership in custom deliverables automatically transfers to the client once all agreed milestone invoices are paid in full, protecting both contractor cash flow and client ownership.",
  },
  {
    q: "Can I customize milestone dates and amounts?",
    a: "Yes. You can add, edit, or remove milestones, define custom timelines, specify deliverables per milestone, and choose payment terms such as Net 0, Net 7, or Net 14.",
  },
];

export default function ContractGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Free Freelance Contract & Milestone Agreement Generator",
        description:
          "Generate legally sound freelance service contracts and milestone agreements in minutes with zero platform fees.",
        url: `${site.url}/tools/contract-generator`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
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
      {/* Header & Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFC] to-white py-12 sm:py-16">
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
            <span className="font-semibold text-slate-800">Contract Generator</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>100% Free · No Middleman Commission</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Freelance Contract &amp; Milestone Agreement Generator
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Draft clean, professional independent contractor agreements with milestone deliverables,
              acceptance verification periods, and complete IP assignment. Print to PDF or copy plain text in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Main Generator App */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ContractGeneratorClient />

          {/* FAQ Section */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
            <h2 className="font-display text-2xl font-bold text-navy">Frequently Asked Questions</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {FAQS.map((faq) => (
                <div key={faq.q} className="space-y-2">
                  <h3 className="text-sm font-bold text-navy">{faq.q}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
