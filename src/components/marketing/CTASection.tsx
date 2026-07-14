import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { marketing } from "@/lib/marketing";

export function CTASection() {
  const c = marketing.cta;

  return (
    <section className="pb-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-navy px-8 py-14 text-center shadow-2xl shadow-navy/20 sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(13,148,136,0.45),transparent_55%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              {c.headline}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/70">{c.body}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={c.primary.href}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
              >
                {c.primary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={c.secondary.href}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {c.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
