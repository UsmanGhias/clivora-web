import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { marketing } from "@/lib/marketing";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute: `CLIVORA vs Upwork, Fiverr & Freelancer.com | ${site.name}`,
  },
  description:
    "Compare CLIVORA to fee-heavy marketplaces. $0 platform fee on negotiated deals, direct invoicing, and a full Freelancer OS for clients and freelancers.",
};

export default function ComparePage() {
  const c = marketing.compare;

  return (
    <MarketingShell>
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#F4F8F7] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800">{c.badge}</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
            {c.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{c.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={c.cta.href}
              className="inline-flex rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-navy/90"
            >
              {c.cta.label}
            </Link>
            <Link
              href={c.secondaryCta.href}
              className="inline-flex rounded-xl border border-navy/15 bg-white px-5 py-3 text-sm font-bold text-navy transition hover:border-teal-500"
            >
              {c.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[720px] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-4 font-bold text-navy sm:px-5">Capability</th>
                  {c.columns.map((col, i) => (
                    <th
                      key={col}
                      className={cn(
                        "px-4 py-4 font-bold sm:px-5",
                        i === 0 ? "bg-teal-50 text-teal-900" : "text-slate-600",
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-slate-100 align-top">
                    <td className="px-4 py-4 font-semibold text-navy sm:px-5">{row.feature}</td>
                    {row.values.map((val, i) => (
                      <td
                        key={`${row.feature}-${i}`}
                        className={cn(
                          "px-4 py-4 text-slate-600 sm:px-5",
                          i === 0 && "bg-teal-50/60 font-semibold text-teal-950",
                        )}
                      >
                        <span className="inline-flex items-start gap-2">
                          {i === 0 ? (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                          ) : (
                            <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                          )}
                          {val}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-[#F7FAF9] p-6">
              <h2 className="font-display text-xl font-bold text-navy">For freelancers</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Stop funding marketplace fees on every invoice. Match privately on Connect, deliver in
                CRM projects, and invoice clients directly - keeping the rate you negotiated.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-navy">For clients</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Hire without fee stacking on both sides. Post needs, review talent, accept when ready,
                and manage delivery in one portal - pay the freelancer on the invoice terms you agree.
              </p>
            </article>
          </div>

          <p className="mt-8 text-xs text-slate-500">
            Competitor fee structures change over time; the table summarizes typical marketplace models.
            CLIVORA&apos;s $0 deal fee applies to negotiated Connect matches - Pro plans are optional
            subscriptions for unlimited tools and credits.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
