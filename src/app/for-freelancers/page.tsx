import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { FreelancerOSSection } from "@/components/marketing/FreelancerOSSection";
import { WorkspaceSection } from "@/components/marketing/WorkspaceSection";
import { CTASection } from "@/components/marketing/CTASection";
import { PortalPageHero } from "@/components/marketing/PortalPageHero";
import { FreelancerDashMock } from "@/components/marketing/mockups/FreelancerDashMock";
import { LiveMarketplaceFeeComparison } from "@/components/compare/LiveMarketplaceFeeComparison";
import { marketing } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "For Freelancers",
  description: marketing.forFreelancers.body,
  alternates: { canonical: "/for-freelancers" },
  keywords: [
    "freelancer workspace",
    "freelancer CRM",
    "freelance project management",
    "Clivora freelancer platform",
  ],
};

export default function ForFreelancersPage() {
  const p = marketing.forFreelancers;

  return (
    <MarketingShell>
      <PortalPageHero
        brand="CLIVORA"
        badge={p.badge}
        headline={p.headline}
        body={p.body}
        primary={p.cta}
        secondary={p.secondaryCta}
        accent="teal"
        preview={<FreelancerDashMock />}
        facts={[
          "CRM, projects, invoices, and timesheets in one account",
          "Find work on Connect without selling your rate to a marketplace",
          "Same login on web and Android - your desk travels with you",
        ]}
      />
      <section className="bg-slate-900 py-16 text-white border-y border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="inline-block rounded-full bg-teal-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-400 border border-teal-500/20">
              Interactive Financial Audit
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Calculate How Much You Surrender to Marketplaces
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Adjust your monthly billing below to see exact commission and token fee leakage compared to Clivora&apos;s $0 platform fee.
            </p>
          </div>
          <LiveMarketplaceFeeComparison platform="upwork" />
        </div>
      </section>
      <FreelancerOSSection />
      <WorkspaceSection />
      <CTASection />
    </MarketingShell>
  );
}
