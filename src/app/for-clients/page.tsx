import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { SocialProofSection } from "@/components/marketing/SocialProofSection";
import { ConnectSection } from "@/components/marketing/ConnectSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { PortalPageHero } from "@/components/marketing/PortalPageHero";
import { ClientHiringWorkflowSection } from "@/components/marketing/ClientHiringWorkflowSection";
import { ClientDashMock } from "@/components/marketing/mockups/ClientDashMock";
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
      <ClientHiringWorkflowSection />
      <SocialProofSection />
      <ConnectSection />
      <FAQSection />
      <CTASection />
    </MarketingShell>
  );
}
