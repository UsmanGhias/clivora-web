import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { HomeHero } from "@/components/marketing/HomeHero";
import { TrustLogos } from "@/components/marketing/TrustLogos";
import { DualPortalSection } from "@/components/marketing/DualPortalSection";
import { FreelancerOSSection } from "@/components/marketing/FreelancerOSSection";
import { SocialProofSection } from "@/components/marketing/SocialProofSection";
import { ConnectSection } from "@/components/marketing/ConnectSection";
import { WorkspaceSection } from "@/components/marketing/WorkspaceSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { PlayStorePromoSection } from "@/components/marketing/PlayStorePromoSection";
import { CTASection } from "@/components/marketing/CTASection";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} | Freelancer OS — Connect, CRM & Invoices`,
  description: site.description,
};

export default function Home() {
  return (
    <MarketingShell>
      <HomeHero />
      <TrustLogos />
      <DualPortalSection />
      <FreelancerOSSection />
      <SocialProofSection />
      <ConnectSection />
      <WorkspaceSection />
      <PlayStorePromoSection />
      <FAQSection />
      <CTASection />
    </MarketingShell>
  );
}
