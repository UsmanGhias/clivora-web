import Link from "next/link";
import { marketing } from "@/lib/marketing";

/** Compact traction strip - social proof without fake regional claims. */
export function TractionStrip() {
  const items = marketing.traction;

  return (
    <section className="border-y border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="max-w-md">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800">
            Growing with freelancers & clients
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">{items.line}</p>
        </div>
        <ul className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {items.stats.map((s) => (
            <li
              key={s.label}
              className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-center sm:text-left"
            >
              <p className="font-display text-xl font-extrabold text-navy sm:text-2xl">{s.value}</p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-4 max-w-7xl px-5 lg:px-8">
        <Link href="/compare" className="text-xs font-semibold text-primary hover:underline">
          Why teams leave fee-heavy marketplaces →
        </Link>
      </div>
    </section>
  );
}
