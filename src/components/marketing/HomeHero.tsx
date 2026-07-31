import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { marketing } from "@/lib/marketing";
import { ClientDashMock } from "./mockups/ClientDashMock";

/**
 * Server Component — hero copy is in the first HTML paint (same pattern as /for-freelancers).
 */
export function HomeHero() {
  const h = marketing.hero;

  return (
    <section className="relative overflow-hidden border-b border-navy/8 pb-14 pt-8 sm:pb-20 lg:pb-28 lg:pt-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_0%,rgba(13,148,136,0.16),transparent_55%),linear-gradient(180deg,#F3F8F6_0%,#FFFFFF_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-6">
          <div className="lg:pb-8 lg:pr-4">
            <div className="inline-flex items-center gap-2 border-l-2 border-teal-500 pl-3">
              <Users className="h-3.5 w-3.5 shrink-0 text-teal-700" aria-hidden />
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-800">
                {h.badge}
              </p>
            </div>

            <h1 className="mt-5 font-display text-[2.35rem] font-extrabold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
              <span className="block">{h.headline[0]}</span>
              <span className="mt-1 inline-block bg-[linear-gradient(transparent_58%,rgba(45,212,191,0.45)_58%)]">
                {h.headline[1]}
              </span>
            </h1>

            <p className="mt-5 max-w-[36rem] text-[15px] leading-relaxed text-slate-600 sm:text-lg">
              {h.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <Link
                href={h.primaryCta.href}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-bold text-white shadow-lg shadow-navy/20 transition hover:bg-navy/90"
              >
                {h.primaryCta.label}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href={h.secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-navy/15 bg-white/90 px-6 text-sm font-bold text-navy transition hover:border-teal-400 hover:text-teal-800"
              >
                {h.secondaryCta.label}
              </Link>
            </div>

            <ul className="mt-8 grid gap-2 sm:grid-cols-3">
              {h.trusts.map((t) => (
                <li
                  key={t}
                  className="rounded-lg border border-navy/8 bg-white/60 px-3 py-2.5 text-[12px] font-semibold leading-snug text-slate-700"
                >
                  {t}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs font-medium text-slate-500">{h.socialLine}</p>
          </div>

          <div className="relative lg:-mr-4 lg:translate-x-2 lg:translate-y-4">
            <div className="relative overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-lg rounded-bl-lg border border-navy/10 bg-white shadow-[12px_18px_0_0_rgba(11,31,42,0.08)]">
              <ClientDashMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
