import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Receipt,
  Percent,
  FileCode2,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Freelance Business Tools & Calculators | CLIVORA",
  description:
    "Free interactive calculators and business tools for freelancers and clients. Calculate your true hourly rate, analyze marketplace fee leakage, generate PDF invoices, and run technical playgrounds.",
  alternates: { canonical: `${site.url}/tools` },
  keywords: [
    "freelance rate calculator",
    "upwork fee calculator",
    "free invoice generator",
    "freelance business tools",
    "developer devtools",
    "clivora tools",
  ],
};

const TOOLS = [
  {
    title: "Freelance Hourly & Day Rate Calculator",
    slug: "/tools/freelance-rate-calculator",
    badge: "Interactive Calculator",
    icon: Calculator,
    color: "from-teal-500/10 to-teal-500/5 text-teal-700 border-teal-200",
    description:
      "Calculate your exact target billable rate based on desired net income, national tax brackets, non-billable overhead, and billable utilization.",
    highlights: ["Taxes & overhead factored", "Hourly, daily, & monthly targets", "Instant exportable breakdown"],
    isExternal: false,
  },
  {
    title: "Upwork Marketplace Fee Calculator",
    slug: "/tools/upwork-fee-calculator",
    badge: "Fee Analysis",
    icon: Percent,
    color: "from-amber-500/10 to-amber-500/5 text-amber-700 border-amber-200",
    description:
      "Calculate how much revenue you forfeit each month to 10% platform cuts, connects proposal tokens, and withdrawal fees vs $0 on Clivora.",
    highlights: ["True net take-home pay", "Annual leakage calculation", "Side-by-side Clivora comparison"],
    isExternal: false,
  },
  {
    title: "Instant PDF Invoice Generator",
    slug: "/tools/invoice-generator",
    badge: "Document Builder",
    icon: Receipt,
    color: "from-blue-500/10 to-blue-500/5 text-blue-700 border-blue-200",
    description:
      "Create, format, and print professional invoices right in your browser. Itemize deliverables, calculate sales tax, and download PDF with zero signup.",
    highlights: ["Multi-currency support", "Itemized line calculations", "Print & PDF download ready"],
    isExternal: false,
  },
  {
    title: "Instant AI Scope of Work (SOW) Generator",
    slug: "/start-a-project",
    badge: "AI Contract Drafting",
    icon: Sparkles,
    color: "from-purple-500/10 to-purple-500/5 text-purple-700 border-purple-200",
    description:
      "Transform raw project ideas into structured engineering briefs with milestone deliverables, timelines, and technical requirements.",
    highlights: ["Milestone breakdown", "Deliverables checklist", "Convert directly to contract"],
    isExternal: false,
  },
  {
    title: "System Architecture Studio",
    slug: "https://arch.clivora.io",
    badge: "Technical Visualizer",
    icon: Cpu,
    color: "from-emerald-500/10 to-emerald-500/5 text-emerald-700 border-emerald-200",
    description:
      "Client-side diagramming canvas for system architecture, ERDs, cloud topologies, and technical scoping calls. Runs 100% in-browser with zero latency.",
    highlights: ["Zero server lag", "Export to SVG/PNG", "Offline-capable canvas"],
    isExternal: true,
  },
  {
    title: "Code Studio & Interactive Playground",
    slug: "https://play.clivora.io",
    badge: "Code Sandbox",
    icon: FileCode2,
    color: "from-cyan-500/10 to-cyan-500/5 text-cyan-700 border-cyan-200",
    description:
      "Sandboxed environment to test HTML, TypeScript, React, and Python snippets during technical interviews and case study walk-throughs.",
    highlights: ["Multi-language runtime", "Live hot-reload preview", "Zero installation needed"],
    isExternal: true,
  },
];

export default function ToolsIndexPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFC] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            <span>100% Free · No Registration Required</span>
          </div>

          <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Free Freelance Business Tools &amp; Calculators
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Practical, zero-friction utilities designed to help independent contractors, consultants, and clients
            model their economics, invoice cleanly, and run their business without platform taxes.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const content = (
                <div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br ${tool.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                        {tool.badge}
                      </span>
                    </div>

                    <h2 className="mt-5 font-display text-lg font-bold text-navy group-hover:text-teal-700 transition-colors">
                      {tool.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {tool.description}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                      {tool.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-xs text-slate-500">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-teal-700 group-hover:text-teal-900">
                    <span>Launch tool</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );

              if (tool.isExternal) {
                return (
                  <a key={tool.title} href={tool.slug} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                );
              }

              return (
                <Link key={tool.title} href={tool.slug}>
                  {content}
                </Link>
              );
            })}
          </div>

          <div className="mt-12">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Value section */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 sm:p-12">
            <div className="max-w-3xl">
              <h3 className="font-display text-2xl font-bold text-navy">
                Why we provide these tools completely free
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                Independent professionals are the backbone of modern software engineering and digital services.
                Yet legacy marketplaces continuously tax their labor through opaque bidding tokens, 10% to 20% commission cuts,
                and delayed payout holds. We build Clivora to return financial sovereignty to freelancers: you keep 100% of what
                you earn, direct client invoicing stays free, and these utilities help you price and protect your work.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy/90"
                >
                  Create free Clivora workspace
                </Link>
                <Link
                  href="/compare"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-navy transition hover:border-teal-500"
                >
                  Compare platform fees
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
