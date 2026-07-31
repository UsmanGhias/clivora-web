import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { HomeHero } from "@/components/marketing/HomeHero";
import { TractionStrip } from "@/components/marketing/TractionStrip";
import { DualAudienceSection } from "@/components/marketing/DualAudienceSection";
import { CTASection } from "@/components/marketing/CTASection";
import { site } from "@/lib/site";

/** Below-fold sections load as separate chunks so the hero paints immediately. */
const ConnectSection = dynamic(
  () => import("@/components/marketing/ConnectSection").then((m) => m.ConnectSection),
  { loading: () => null },
);
const FounderNoteSection = dynamic(
  () =>
    import("@/components/marketing/FounderNoteSection").then((m) => m.FounderNoteSection),
  { loading: () => null },
);
const SocialProofSection = dynamic(
  () =>
    import("@/components/marketing/SocialProofSection").then((m) => m.SocialProofSection),
  { loading: () => null },
);
const DualPortalSection = dynamic(
  () =>
    import("@/components/marketing/DualPortalSection").then((m) => m.DualPortalSection),
  { loading: () => null },
);
const FreelancerOSSection = dynamic(
  () =>
    import("@/components/marketing/FreelancerOSSection").then((m) => m.FreelancerOSSection),
  { loading: () => null },
);
const WorkspaceSection = dynamic(
  () => import("@/components/marketing/WorkspaceSection").then((m) => m.WorkspaceSection),
  { loading: () => null },
);
const FAQSection = dynamic(
  () => import("@/components/marketing/FAQSection").then((m) => m.FAQSection),
  { loading: () => null },
);
const PlayStorePromoSection = dynamic(
  () =>
    import("@/components/marketing/PlayStorePromoSection").then(
      (m) => m.PlayStorePromoSection,
    ),
  { loading: () => null },
);

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${site.name} | Complete Freelancer OS - $0 deal fees`,
  description: site.description,
  openGraph: {
    title: `${site.name} — Freelancer OS for hire, CRM & invoices`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  other: {
    // Cache-bust / deploy verification marker for Hostinger CDN
    "clivora-build": "2026-07-26-home-fast",
  },
};

export default function Home() {
  return (
    <MarketingShell>
      {/* First paint: server hero only — no Framer, no heavy client graph */}
      <HomeHero />
      <section
        className="border-y border-navy/8 bg-white py-10 sm:py-12"
        aria-labelledby="clivora-purpose"
        data-clivora-build="2026-07-26-home-fast"
      >
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-800">
            About Clivora
          </p>
          <h2
            id="clivora-purpose"
            className="mt-3 font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl"
          >
            Clivora is a Freelancer OS
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">
            The purpose of Clivora is to help freelancers and clients hire and get hired on a
            private Connect board, then run CRM, projects, timesheets, messages, and invoices on
            web and Android — with $0 platform fees on negotiated deals. Anyone can read this page
            without signing in.
          </p>
        </div>
      </section>
      <TractionStrip />
      <DualAudienceSection />
      <ConnectSection />
      <FounderNoteSection />
      <SocialProofSection />
      <DualPortalSection />
      <FreelancerOSSection />
      <WorkspaceSection />
      <FAQSection />
      <PlayStorePromoSection />
      <CTASection />
    </MarketingShell>
  );
}
