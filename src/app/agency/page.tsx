import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { AgencyClientView } from "./AgencyClientView";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";

export const metadata: Metadata = {
  title: "For Agencies: Zero-Commission Client Portals & Invoicing | Clivora",
  description:
    "Keep 100% of your agency billing. Run enterprise client projects with white-label portals, custom milestone contracts, and multi-currency invoicing with zero platform commission.",
  alternates: { canonical: "/agency" },
  keywords: [
    "agency client portal",
    "zero fee invoicing for agencies",
    "white label client portal",
    "freelance agency software",
    "upwork agency fee alternative",
    "milestone escrow for agencies",
  ],
};

export default function AgencyPage() {
  return (
    <MarketingShell>
      <AgencyClientView />
      <FAQSection />
      <CTASection />
    </MarketingShell>
  );
}
