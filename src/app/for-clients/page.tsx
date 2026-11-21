import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { SocialProofSection } from "@/components/marketing/SocialProofSection";
import { ConnectSection } from "@/components/marketing/ConnectSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { PortalPageHero } from "@/components/marketing/PortalPageHero";
import { ClientHiringWorkflowSection } from "@/components/marketing/ClientHiringWorkflowSection";
import { ClientDashMock } from "@/components/marketing/mockups/ClientDashMock";
import { LiveMarketplaceFeeComparison } from "@/components/compare/LiveMarketplaceFeeComparison";
import { marketing } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "For Clients",
  description: marketing.forClients.body,
  alternates: { canonical: "/for-clients" },
  keywords: ["client workspace", "hire freelancers", "client portal", "Clivora"],
};

export default function ForClientsPage() {
  const p = marketing.forClients;

  return (
    <MarketingShell>
      <PortalPageHero
        brand="CLIVORA"
        badge={p.badge}
        headline={p.headline}
        body={p.body}
        primary={p.cta}
        secondary={p.secondaryCta}
        accent="slate"
        preview={<ClientDashMock />}
        facts={[
          "Post jobs and review proposals in one hiring desk",
          "Track delivery with projects, messages, and files",
          "Pay freelancers directly against CLIVORA invoices",
        ]}
      />
      <section className="bg-slate-900 py-16 text-white border-y border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="inline-block rounded-full bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-400 border border-slate-700">
              Client Cost Comparison
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Eliminate Marketplace Client Markups & Surcharges
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Legacy platforms bill clients up to 7.99% on top of every contractor invoice plus contract initiation fees. Compare your savings below.
            </p>
          </div>
          <LiveMarketplaceFeeComparison platform="upwork" />
        </div>
      </section>
      <ClientHiringWorkflowSection />
      <SocialProofSection />
      <ConnectSection />
      <FAQSection />
      <CTASection />
    </MarketingShell>
  );
}
