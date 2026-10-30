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
  title: "Clivora vs Hello Bonsai: 2026 In-Depth Tool Comparison",
  description:
    "Compare Clivora and Hello Bonsai. Discover why independent consultants and engineers choose Clivora's free core tier and integrated Connect hiring marketplace over Bonsai's $25 to $79/month paywalls.",
  alternates: { canonical: `${site.url}/compare/bonsai` },
  keywords: [
    "clivora vs bonsai",
    "hello bonsai alternative free",
    "freelance invoicing software comparison",
    "bonsai pricing comparison",
    "free bonsai alternative",
  ],
};

const COMPARISON_ROWS = [
  {
    feature: "Starting Price",
    clivora: "$0 / forever (Free core tier)",
    bonsai: "$25 / month (Starter plan paywall)",
    clivoraWins: true,
  },
  {
    feature: "Integrated Talent Hiring Marketplace",
    clivora: "Included (Clivora Connect with $0 fees)",
    bonsai: "None (Invoicing tool only)",
    clivoraWins: true,
  },
  {
    feature: "Native Android App",
    clivora: "Full operating desk on Google Play",
    bonsai: "Basic mobile companion app",
    clivoraWins: true,
  },
  {
    feature: "Dual Portal (Freelancers & Clients)",
    clivora: "Included in one account with role toggle",
    bonsai: "Separate client payment link view",
    clivoraWins: true,
  },
  {
    feature: "Milestone & Hourly Time Tracker",
    clivora: "Included on Web + Android",
    bonsai: "Included in paid plans",
    clivoraWins: false,
  },
  {
    feature: "Direct Invoice Settlement",
    clivora: "Zero transaction take rate on deals",
    bonsai: "Standard Stripe/card processing fees",
    clivoraWins: true,
  },
];

const FAQS = [
  {
    q: "Why choose Clivora over Hello Bonsai?",
    a: "Hello Bonsai is a closed business tool requiring a minimum $25/month subscription just to send invoices or track time. Clivora offers a robust permanent free tier for solo freelancers and adds Clivora Connect, an integrated talent marketplace where you can discover new high-paying clients without leaving the platform.",
  },
  {
    q: "Can I use Clivora to generate client contracts?",
    a: "Yes. Clivora includes contract drafting and AI scope of work generation, allowing you to define milestones, deliverables, and payment schedules directly on your projects.",
  },
];

export default function CompareBonsaiPage() {
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
            <span className="font-semibold text-slate-800">Clivora vs Bonsai</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>Platform Comparison · 2026 Edition</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Clivora vs Hello Bonsai: Free OS vs Monthly Paywalls
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Compare an all-in-one Freelancer OS featuring an integrated hiring marketplace against single-purpose
              invoicing tools with expensive monthly subscriptions.
            </p>
          </div>
        </div>
      </section>

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
                    Hello Bonsai
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
                        <span>{row.bonsai}</span>
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

          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs space-y-6">
            <h2 className="font-display text-2xl font-bold text-navy">
              Run Your Entire Freelance Pipeline Without Subscriptions
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              When starting or scaling an independent business, paying $300 to $900 annually just to send basic PDF invoices
              and track client tasks creates unnecessary overhead. Clivora provides professional invoicing, task boards,
              time logging, and client CRM 100% free.
            </p>
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-navy/90 transition"
              >
                Start Free on Clivora
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-navy hover:border-teal-500 transition"
              >
                View Plans &amp; Pricing
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
