import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  brand: string;
  badge: string;
  headline: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  accent: "teal" | "slate";
  preview: ReactNode;
  facts: string[];
};

export function PortalPageHero({
  brand,
  badge,
  headline,
  body,
  primary,
  secondary,
  accent,
  preview,
  facts,
}: Props) {
  const isTeal = accent === "teal";

  return (
    <section className="relative overflow-hidden border-b border-navy/8 pb-14 pt-10 sm:pb-16 sm:pt-14">
      <div
        className={`pointer-events-none absolute inset-0 ${
          isTeal
            ? "bg-[radial-gradient(ellipse_70%_55%_at_0%_0%,rgba(13,148,136,0.16),transparent_55%),linear-gradient(180deg,#F3F8F6_0%,#FFFFFF_55%)]"
            : "bg-[radial-gradient(ellipse_70%_55%_at_0%_0%,rgba(71,85,105,0.14),transparent_55%),linear-gradient(180deg,#F5F7FA_0%,#FFFFFF_55%)]"
        }`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-[0.35] lg:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(15,23,42,0.05) 0 1px, transparent 1px 18px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            {brand}
          </p>
          <p
            className={`mt-3 text-[11px] font-bold uppercase tracking-[0.18em] ${
              isTeal ? "text-teal-800" : "text-slate-600"
            }`}
          >
            {badge}
          </p>
          <h1 className="mt-3 max-w-xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-4xl lg:text-[2.65rem]">
            {headline}
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-slate-600 sm:text-base">{body}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={primary.href}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-bold text-white transition ${
                isTeal
                  ? "bg-teal-700 shadow-lg shadow-teal-900/15 hover:bg-teal-600"
                  : "bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90"
              }`}
            >
              {primary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy/15 bg-white/80 px-6 py-3.5 text-sm font-bold text-navy backdrop-blur transition hover:border-teal-500"
            >
              {secondary.label}
            </Link>
          </div>

          <ul className="mt-8 space-y-2 border-t border-navy/10 pt-6">
            {facts.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-slate-600">
                <span
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${isTeal ? "bg-teal-600" : "bg-slate-500"}`}
                  aria-hidden
                />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:translate-y-2">
          <div
            className={`pointer-events-none absolute -inset-3 -z-10 rounded-[1.25rem] opacity-80 blur-2xl ${
              isTeal ? "bg-teal-200/40" : "bg-slate-300/40"
            }`}
            aria-hidden
          />
          {preview}
        </div>
      </div>
    </section>
  );
}
