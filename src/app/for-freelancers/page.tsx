import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { FreelancerOSSection } from "@/components/marketing/FreelancerOSSection";
import { WorkspaceSection } from "@/components/marketing/WorkspaceSection";
import { CTASection } from "@/components/marketing/CTASection";
import { ShowcaseImage } from "@/components/marketing/ShowcaseImage";
import { FreelancerDashMock } from "@/components/marketing/mockups/FreelancerDashMock";
import { marketing } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "For Freelancers",
  description: marketing.forFreelancers.body,
};

export default function ForFreelancersPage() {
  const p = marketing.forFreelancers;

  return (
    <MarketingShell>
      <section className="overflow-hidden pb-12 pt-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              {p.badge}
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
              {p.headline}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{p.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={p.cta.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20"
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
          <FreelancerDashMock />
        </div>
      </section>
      <FreelancerOSSection />
      <WorkspaceSection />
      <CTASection />
    </MarketingShell>
  );
}
