import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { SocialProofSection } from "@/components/marketing/SocialProofSection";
import { ConnectSection } from "@/components/marketing/ConnectSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { ClientDashMock } from "@/components/marketing/mockups/ClientDashMock";
import { marketing } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "For Clients",
  description: marketing.forClients.body,
};

export default function ForClientsPage() {
  const p = marketing.forClients;

  return (
    <MarketingShell>
      <section className="overflow-hidden pb-12 pt-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
              {p.badge}
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
              {p.headline}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{p.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={p.cta.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-bold text-white"
              >
                {p.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={p.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-navy"
              >
                {p.secondaryCta.label}
              </Link>
            </div>
          </div>
          <ClientDashMock />
        </div>
      </section>
      <SocialProofSection />
      <ConnectSection />
      <FAQSection />
      <CTASection />
    </MarketingShell>
  );
}
