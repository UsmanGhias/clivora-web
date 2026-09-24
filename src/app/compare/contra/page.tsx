import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Minus,
  ChevronRight,
  Home,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clivora vs Contra: 2026 Freelance Tool Comparison | CLIVORA",
  description:
    "Compare Clivora and Contra side-by-side. Discover why developers, agencies, and technical consultants choose Clivora for its native Android app, client CRM, time-tracking, and integrated invoicing.",
  alternates: { canonical: `${site.url}/compare/contra` },
  keywords: [
    "clivora vs contra",
    "contra alternative android",
    "freelance os vs portfolio network",
    "contra fee comparison",
    "developer crm and invoicing",
  ],
};

const COMPARISON_ROWS = [
  {
    feature: "Deal Platform Fee",
    clivora: "$0 (0% on negotiated deals)",
    contra: "0% commission ($29/mo Contra Pro)",
    clivoraWins: true,
  },
  {
    feature: "Native Android App",
    clivora: "Official Google Play app with cloud sync",
    contra: "Web browser only (No Android app)",
    clivoraWins: true,
  },
  {
    feature: "Full Client CRM & Pipeline",
    clivora: "Included (Contacts, notes, revenue history)",
    contra: "Basic inquiry inbox",
    clivoraWins: true,
  },
  {
    feature: "Project Timer & Timesheets",
    clivora: "Built-in timer synced to billable invoices",
    contra: "Requires third-party tracking app",
    clivoraWins: true,
  },
  {
    feature: "Enterprise Accounting Sync (Odoo)",
    clivora: "Bi-directional Odoo ERP export available",
    contra: "None",
    clivoraWins: true,
  },
  {
    feature: "Direct PDF Invoicing & Custom Rails",
    clivora: "Included with multi-currency & tax controls",
    contra: "Built-in Contra payments (Stripe-backed)",
    clivoraWins: true,
  },
  {
    feature: "Target Professional Roster",
    clivora: "Software engineers, consultants, & agencies",
    contra: "Mainly visual designers & content creators",
    clivoraWins: true,
  },
];

const FAQS = [
  {
    q: "How does Clivora differ from Contra?",
    a: "Contra is primarily a visual portfolio network focused on creative designers and social media managers. Clivora is a full-stack Freelancer Operating System built for software engineers, ERP architects, and technical agencies who need robust client CRM, project time tracking, milestone contracts, and native Android mobile access.",
  },
  {
    q: "Does Clivora charge fees on client payments?",
    a: "No. Both Clivora and Contra emphasize 0% commission on contracts, but Clivora provides a completely free operating system ($0 platform fees and 100% free access during Founder Launch).",
  },
  {
    q: "Can I manage team members on Clivora?",
    a: "Yes. Clivora Pro Plus includes multi-seat collaboration, enabling boutique agencies and studios to assign tasks, track shared project hours, and invoice clients under a unified brand.",
  },
];

export default function CompareContraPage() {
  return (
    <MarketingShell>
      <section className="relative border-b border-slate-200 bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFC] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-navy transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/compare" className="hover:text-navy transition-colors">
              Compare
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-slate-800">Clivora vs Contra</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>Platform Comparison · 2026 Edition</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Clivora vs Contra: Beyond Portfolio Discovery
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Compare an agency-grade Freelancer OS with a visual portfolio network. Discover why technical contractors
              rely on Clivora for client CRM, time-tracking, and native Android access.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-4 px-6 font-bold text-navy">Capability</th>
                  <th className="py-4 px-6 font-bold text-teal-800 bg-teal-50/40 w-1/3">
                    CLIVORA (Freelancer OS)
                  </th>
                  <th className="py-4 px-6 font-bold text-slate-500 w-1/3">
                    Contra Network
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-navy text-xs sm:text-sm">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 bg-teal-50/20 text-xs sm:text-sm font-semibold text-teal-950">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-teal-700 shrink-0" />
                        <span>{row.clivora}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs sm:text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Minus className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{row.contra}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Deep Architectural Contrast */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs space-y-6">
            <h2 className="font-display text-2xl font-bold text-navy">
              Why Technical Freelancers Need More Than a Showcase Profile
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Showcase platforms excel at visual presentation, but a freelance career quickly outgrows a simple portfolio.
              Once you manage 3 to 5 concurrent clients, you need structured pipeline tracking, client communication logs,
              accurate hourly timers, and direct invoice delivery.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Clivora bridges this gap by functioning as your complete back-office desk on web and Android.
              Log hours on the go, check milestone deliverables from your phone, and export accounting records to Odoo
              without juggling four disconnected subscriptions.
            </p>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-navy/90 transition"
              >
                Create Free Workspace
              </Link>
              <Link
                href="/features"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-navy hover:border-teal-500 transition"
              >
                Explore Full Features
              </Link>
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
            <h3 className="font-display text-xl font-bold text-navy">Frequently Asked Questions</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {FAQS.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <h4 className="flex items-start gap-2 text-sm font-bold text-navy">
                    <HelpCircle className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
