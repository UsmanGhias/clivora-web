import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { marketing } from "@/lib/marketing";

export function CTASection() {
  const c = marketing.cta;

  return (
    <section className="relative overflow-hidden border-y border-navy/10 bg-[#081018] py-16 text-white sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 0%, rgba(13,148,136,0.22) 42%, transparent 70%), radial-gradient(ellipse 60% 80% at 90% 20%, rgba(45,212,191,0.18), transparent 55%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-18deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 14px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-teal-300">
            Start on CLIVORA
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {c.headline}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">{c.body}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={c.primary.href}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-400 px-6 py-3.5 text-sm font-bold text-navy transition hover:bg-teal-300"
          >
            {c.primary.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={c.secondary.href}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:border-teal-300/60 hover:bg-white/10"
          >
            {c.secondary.label}
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
          {[
            "One signup for freelancer or client",
            "Private Connect until mutual accept",
            "$0 deal fee · invoice clients directly",
          ].map((item) => (
            <li key={item} className="text-sm leading-snug text-white/70">
              <span className="mb-2 block h-0.5 w-8 bg-teal-400" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
