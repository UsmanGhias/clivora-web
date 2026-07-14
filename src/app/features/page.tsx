import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CTASection } from "@/components/marketing/CTASection";
import { marketing } from "@/lib/marketing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features",
  description: `Explore every CLIVORA capability — CRM, projects, invoices, Connect marketplace, AI, analytics, web and Android.`,
};

export default function FeaturesPage() {
  const f = marketing.featuresPage;

  return (
    <MarketingShell>
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-teal-50/40 to-[#F8FAFC] pb-12 pt-14">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{f.badge}</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            {f.headline}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{f.body}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-navy"
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
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-primary">
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </div>
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
