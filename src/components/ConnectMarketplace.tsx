import Link from "next/link";
import { Check, Network, Search, Shield, Sparkles, X } from "lucide-react";
import { site } from "@/lib/site";

const pillars = [
  {
    icon: Search,
    title: "Talent & jobs in one place",
    body: "Browse freelancers and client briefs with skills, rates, location, and budget, built for serious work, not endless scrolling.",
  },
  {
    icon: Shield,
    title: "Hire with clear delivery signals",
    body: "Professional profiles, completion history, and invoice status you both can see. Contact stays private until mutual accept.",
  },
  {
    icon: Network,
    title: "CRM the moment you match",
    body: "Accepted partners live in the same CLIVORA workspace, clients, projects, invoices, messages on web and Android.",
  },
];

const rows = [
  { feature: "Private contact until accept", clivora: true, others: false },
  { feature: "Star ratings & reputation on cards", clivora: true, others: true },
  { feature: "Direct invoice + payment-status tracking", clivora: true, others: false },
  { feature: "Same CRM after you hire", clivora: true, others: false },
  { feature: "Web + Android one account", clivora: true, others: false },
  { feature: "High marketplace fees / take rates", clivora: false, others: true },
];

export function ConnectMarketplace() {
  return (
    <section id="connect" className="relative overflow-hidden bg-navy py-16 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(13,148,136,0.28),_transparent_55%)]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-teal-300">
          CLIVORA Connect
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">
          The marketplace that becomes your operating system
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          Upwork and Fiverr stop at the hire. CLIVORA Connect starts there - private
          matching with clear delivery signals, then the CRM, projects, and invoices you
          already run your business on.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
            >
              <item.icon className="h-6 w-6 text-teal-300" />
              <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-b border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/50 sm:px-6 sm:text-sm">
            <span>Why teams switch</span>
            <span className="text-center text-teal-300">CLIVORA</span>
            <span className="text-center">Open marketplaces</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.feature}
              className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-0 sm:px-6"
            >
              <span className="text-white/80">{row.feature}</span>
              <span className="flex justify-center">
                {row.clivora ? (
                  <Check className="h-5 w-5 text-teal-300" />
                ) : (
                  <X className="h-5 w-5 text-white/25" />
                )}
              </span>
              <span className="flex justify-center">
                {row.others ? (
                  <Check className="h-5 w-5 text-white/35" />
                ) : (
                  <X className="h-5 w-5 text-white/25" />
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/connect"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white"
          >
            <Sparkles className="h-4 w-4" />
            Open Connect marketplace
          </Link>
          <Link
            href="/pro?plan=pro_plus"
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white/90"
          >
            Unlock Connect with Pro Plus · {site.pricing.proPlusMonthlyLabel}/mo
          </Link>
        </div>
      </div>
    </section>
  );
}
