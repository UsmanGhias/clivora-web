import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { marketing } from "@/lib/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `CLIVORA pricing - Free, Pro (${site.pricing.proMonthlyLabel}/mo), and Pro Plus (${site.pricing.proPlusMonthlyLabel}/mo). Start free, upgrade when you grow.`,
};

export default function PricingPage() {
  const p = marketing.pricingPage;

  return (
    <MarketingShell>
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-teal-50/50 to-[#F8FAFC] pb-8 pt-14">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{p.badge}</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            {p.headline}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{p.body}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/plans-and-billing"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-navy"
            >
              Billing docs
            </Link>
          </div>
        </div>
      </section>
      <PricingSection showHeader={false} />
      <FAQSection />
      <CTASection />
    </MarketingShell>
  );
}
