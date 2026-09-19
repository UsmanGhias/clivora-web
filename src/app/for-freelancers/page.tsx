import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { FreelancerOSSection } from "@/components/marketing/FreelancerOSSection";
import { WorkspaceSection } from "@/components/marketing/WorkspaceSection";
import { CTASection } from "@/components/marketing/CTASection";
import { PortalPageHero } from "@/components/marketing/PortalPageHero";
import { FreelancerDashMock } from "@/components/marketing/mockups/FreelancerDashMock";
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
      <FreelancerOSSection />
      <WorkspaceSection />
      <CTASection />
    </MarketingShell>
  );
}
