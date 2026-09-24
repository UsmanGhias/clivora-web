import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { marketing } from "@/lib/marketing";
import { FreelancerDashMock } from "./mockups/FreelancerDashMock";

export function FreelancerOSSection() {
  const s = marketing.freelancerOs;

  return (
    <section id="freelancer-os" className="border-t border-slate-200/80 bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Freelancer operating system
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl lg:text-[2.65rem]">
            {s.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{s.body}</p>

          <ul className="mt-8 space-y-3.5">
            {s.features.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
                </span>
                <div>
                  <p className="text-sm font-bold text-navy">{f.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href={s.cta.href}
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-700"
          >
            {s.cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-teal-100/60 via-slate-100/30 to-transparent blur-2xl" />
          <div className="relative">
            <FreelancerDashMock />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-6 sm:grid-cols-3 lg:grid-cols-6 lg:px-8">
          {s.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-extrabold text-navy sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
