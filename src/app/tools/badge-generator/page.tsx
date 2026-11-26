import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BadgeGeneratorClient } from "./BadgeGeneratorClient";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Free Freelancer Badge & Hire Button Generator",
  description:
    "Generate customizable GitHub README shields, portfolio badges, and hire buttons. Let clients hire you directly through Clivora with zero platform commission.",
  alternates: { canonical: `${site.url}/tools/badge-generator` },
  keywords: [
    "freelancer badge generator",
    "github readme hire me badge",
    "hire on clivora badge",
    "zero fee freelance badge",
    "freelance portfolio widget",
    "independent contractor badge",
  ],
};

const FAQS = [
  {
    q: "Where can I use these badges?",
    a: "You can embed these badges anywhere your prospective clients discover your work: GitHub profile READMEs, repository READMEs, personal portfolios (Next.js, Astro, Hugo, Webflow, WordPress), Substack newsletters, and LinkedIn or Twitter/X bios.",
  },
  {
    q: "Why should I use a Clivora badge instead of an Upwork link?",
    a: "When you send a prospective client to Upwork or Fiverr, the platform extracts 10% to 20% from your earnings and slaps up to 8% in client marketplace surcharges. With a Clivora badge, you and your client keep 100% of negotiated funds with $0 platform deal fees.",
  },
  {
    q: "Can I customize the badge destination link?",
    a: "Yes. You can link directly to your public Clivora Connect contractor profile, your personal portfolio site, or the instant Clivora Scope of Work (SOW) generator.",
  },
  {
    q: "Does embedding a badge cost anything?",
    a: "No. The badge generator and Clivora badges are 100% free and open for all independent software engineers, designers, consultants, and agencies worldwide.",
  },
];

export default function BadgeGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Free Freelancer Badge & Hire Button Generator",
        description:
          "Generate customizable GitHub README shields, portfolio badges, and hire buttons for zero-fee freelance hiring.",
        url: `${site.url}/tools/badge-generator`,
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
            <span className="font-semibold text-slate-800">Badge Generator</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>100% Free · No Registration Required</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Freelancer Badge &amp; Direct Hire Button Generator
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Create embeddable badges for your GitHub README, portfolio, and social profiles.
              Direct clients to work with you with 0% platform take-rate.
            </p>
          </div>
        </div>
      </section>

      {/* Main Generator App */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <BadgeGeneratorClient />

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
