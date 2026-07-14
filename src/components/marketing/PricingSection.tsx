import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";

export function PricingSection({ showHeader = true }: { showHeader?: boolean }) {
  const p = marketing.pricingPage;

  return (
    <section id="pricing" className="border-t border-slate-200/80 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {showHeader ? (
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{p.badge}</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">
              {p.headline}
            </h2>
            <p className="mt-4 text-base text-slate-600">{p.body}</p>
          </div>
        ) : null}

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {p.plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-3xl border p-7 shadow-sm transition hover:shadow-md",
                plan.highlighted
                  ? "border-primary bg-gradient-to-b from-teal-50/80 to-white ring-2 ring-primary/20"
                  : "border-slate-200 bg-white"
              )}
            >
              {"badge" in plan && plan.badge ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {plan.badge}
                </span>
              ) : null}
              {plan.highlighted ? (
                <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  <Sparkles className="h-3 w-3" />
                  Most popular
                </span>
              ) : null}
              <h3 className="font-display text-lg font-extrabold text-navy">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-navy">{plan.price}</span>
                <span className="text-sm text-slate-400">{plan.period}</span>
                {"listPrice" in plan && plan.listPrice ? (
                  <span className="text-sm text-slate-400 line-through">{plan.listPrice}</span>
                ) : null}
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={cn(
                  "mt-8 inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition",
                  plan.highlighted
                    ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
                    : "border border-navy/15 bg-navy text-white hover:bg-navy/90"
                )}
              >
                {plan.cta.label}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-400">{p.note}</p>
      </div>
    </section>
  );
}
