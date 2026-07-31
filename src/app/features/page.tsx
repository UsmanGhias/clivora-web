import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CTASection } from "@/components/marketing/CTASection";
import { marketing } from "@/lib/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features",
  description: `Explore every CLIVORA capability - CRM, projects, invoices, Connect marketplace, AI, analytics, web and Android.`,
};

export default function FeaturesPage() {
  const f = marketing.featuresPage;

  return (
    <MarketingShell>
      <section className="relative overflow-hidden border-b border-navy/8 pb-12 pt-14">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgba(13,148,136,0.12),transparent_55%),linear-gradient(180deg,#F3F8F6,#FFFFFF)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="font-display text-2xl font-extrabold tracking-tight text-navy">CLIVORA</p>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800">{f.badge}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            {f.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{f.body}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-navy/15 bg-white px-5 py-3 text-sm font-bold text-navy"
            >
              Read documentation
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-14 px-5 lg:px-8">
          {f.groups.map((group) => (
            <div key={group.title}>
              <h2 className="font-display text-2xl font-extrabold text-navy">{group.title}</h2>
              <div className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map((item) => (
                  <article key={item.title} className="border-t border-navy/10 pt-4">
                    <h3 className="text-sm font-bold text-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row lg:px-8">
          <p className="text-sm text-slate-600">
            Prefer a deeper dive? See the full product docs and plans on {site.name}.
          </p>
          <div className="flex gap-3">
            <Link href="/docs/product-overview" className="text-sm font-semibold text-primary hover:underline">
              Product overview →
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-primary hover:underline">
              Pricing →
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </MarketingShell>
  );
}
