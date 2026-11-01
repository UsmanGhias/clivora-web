import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Database,
  FileCheck2,
  FolderLock,
  Globe2,
  Percent,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CommissionSavingsCalculator } from "@/components/marketing/CommissionSavingsCalculator";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "11.11 Global Tech Festival: 1-Year Founder Pro Plus ($0) & 0% Fees",
  description:
    "Join the Clivora 11.11 Global Tech Festival. Claim a full 1-Year Founder Pro Plus pass at $0 cost ($228 annual value), lifetime 0% marketplace fees, unlimited CRM client relationships, and 50 GB encrypted file vault.",
  alternates: { canonical: `${site.url}/promo/11-11` },
  keywords: [
    "11.11 freelance sale",
    "11.11 tech festival",
    "upwork alternative zero fee",
    "free invoicing for freelancers",
    "freelance platform discounts",
    "clivora founder pass",
  ],
};

const FESTIVAL_BENEFITS = [
  {
    icon: Percent,
    title: "Lifetime 0% Platform Commission",
    description:
      "Keep 100% of every dollar you invoice. Traditional marketplaces take 10% to 20% on every milestone. Clivora charges 0% transaction cut on contracts.",
  },
  {
    icon: Sparkles,
    title: "1-Year Founder Pro Plus ($228 Value at $0)",
    description:
      "All festival registrants receive full Pro Plus capabilities for 365 days: unlimited active clients, unlimited invoices, and priority indexing.",
  },
  {
    icon: FolderLock,
    title: "50 GB Secure File Vault",
    description:
      "Deliver client assets, architectural blueprints, and high-resolution media directly from your project workspace with granular client access control.",
  },
  {
    icon: Globe2,
    title: "6,900+ Live Remote Tech Jobs",
    description:
      "Aggregated directly from open source repositories, Y Combinator startups, Hacker News, and engineering career boards with zero bidding tokens required.",
  },
  {
    icon: FileCheck2,
    title: "Contract & Proposal Generator",
    description:
      "Draft scoped technical proposals and legally enforceable milestone contracts in under two minutes with automated client e-signatures.",
  },
  {
    icon: Database,
    title: "Direct Payment Settlement",
    description:
      "Receive payments directly via Stripe, PayPal, or bank transfer with zero escrow hold periods. Your funds land directly in your account.",
  },
];

const FAQS = [
  {
    q: "Is the 11.11 Founder Pass genuinely free, or is a credit card required?",
    a: "No credit card or payment information is required to register. You create an account with email or Google, and the 1-Year Founder Pro Plus tier is applied immediately to your workspace.",
  },
  {
    q: "What happens to my account after the 365-day festival period ends?",
    a: "Your account will never be locked or downgraded without notice. You can choose to maintain the Pro Plus subscription at standard rates or continue on the permanent Free tier, which keeps 0% platform deal fees forever.",
  },
  {
    q: "Does Clivora take a cut from payment processors?",
    a: "No. Standard payment gateway fees (such as Stripe 2.9% + 30¢ or bank wire fees) go directly to the processor. Clivora deducts zero percent platform fees.",
  },
  {
    q: "Can hiring companies and engineering clients also participate?",
    a: "Yes. Hiring teams can post jobs, review candidate applications, and manage contracts with zero client surcharges or initiation fees.",
  },
];

export default function Promo1111Page() {
  return (
    <MarketingShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#0B132B] via-[#0F1D40] to-[#0B132B] text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>11.11 Global Tech Festival Special</span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Stop giving up 10% of your earnings.
            <span className="block mt-2 text-teal-400">
              Claim 1-Year Founder Pro Plus at $0.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
            For the 11.11 Global Tech Festival, Clivora is granting full Founder Pro Plus access ($228 annual value) at zero cost. Enjoy unlimited client relationships, 50 GB storage, and 0% marketplace commission for 365 days.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup?ref=1111_festival"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-7 py-3.5 text-sm font-bold text-navy shadow-lg shadow-teal-500/25 transition-colors"
            >
              Claim 1-Year Founder Pass ($0 Cost)
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#savings-calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-colors"
            >
              Calculate Your Fee Savings
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-teal-400" />
              <span>Valid November 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-teal-400" />
              <span>Instant activation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual 11.11 Founder Pass Keynote Asset Spotlight */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">11.11 Festival Keynote Asset</span>
            <h2 className="mt-2 text-3xl font-extrabold text-navy">
              Claim Your 11.11 Founder Pass (0% Fee)
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Activate 365 days of complimentary Founder Pro Plus access ($228 annual value). Direct milestone escrow, unlimited project invoicing, and zero platform commission.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-teal-500/20 bg-[#070B14] shadow-2xl p-2 sm:p-3">
            <Image
              src="/marketing/clivora_1111_founder_pass.jpg"
              alt="Clivora 11.11 Founder Pass 0% Fee VIP Card"
              width={1024}
              height={576}
              className="w-full h-auto rounded-xl object-cover shadow-inner"
              priority
            />
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 text-center">
              <div className="text-3xl font-extrabold text-navy">$7,850+</div>
              <div className="mt-1 text-xs font-medium text-slate-600">
                Average annual loss per freelancer on $50,000 billing under legacy platforms
              </div>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-5 text-center">
              <div className="text-3xl font-extrabold text-teal-700">$0.00</div>
              <div className="mt-1 text-xs font-medium text-teal-900">
                Clivora deal commission fee on all negotiated contracts
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 text-center">
              <div className="text-3xl font-extrabold text-navy">7,150+</div>
              <div className="mt-1 text-xs font-medium text-slate-600">
                Direct remote technical job listings with open application paths
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11.11 Festival Features Grid */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">All-Inclusive Package</span>
            <h2 className="mt-2 text-3xl font-extrabold text-navy">
              Everything in Founder Pro Plus for 365 Days
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Deterministic infrastructure designed for independent software engineers, designers, and consultancies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FESTIVAL_BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-teal-500/40 hover:shadow-md transition-all"
                >
                  <div className="inline-flex p-3 rounded-xl bg-teal-50 border border-teal-200/60 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy">{b.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Savings Calculator */}
      <div id="savings-calculator">
        <CommissionSavingsCalculator />
      </div>

      {/* 3 Simple Steps */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Simple Activation</span>
            <h2 className="mt-2 text-3xl font-extrabold text-navy">
              How to claim your 11.11 Founder Pass
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 font-extrabold text-white text-sm">
                1
              </div>
              <h3 className="mt-4 text-base font-bold text-navy">Register Workspace</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Sign up with your work email or Google account. No credit card or billing details required.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 font-extrabold text-white text-sm">
                2
              </div>
              <h3 className="mt-4 text-base font-bold text-navy">Automatic Pro Plus Grant</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                The 11.11 Founder pass is applied to your workspace immediately, unlocking 50 GB and unlimited CRM.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 font-extrabold text-white text-sm">
                3
              </div>
              <h3 className="mt-4 text-base font-bold text-navy">Bill with 0% Fee</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Invoice your existing clients or apply to 6,900+ remote engineering jobs. Keep 100% of your payout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Clarifications</span>
            <h2 className="mt-2 text-3xl font-extrabold text-navy">
              11.11 Festival Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <div className="font-bold text-navy text-sm sm:text-base">{faq.q}</div>
                <div className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-teal-800 to-navy text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
            Ready to keep 100% of what you bill?
          </h2>
          <p className="mt-3 text-slate-200 text-sm sm:text-base max-w-xl mx-auto">
            Take advantage of the 11.11 Global Tech Festival grant. Set up your workspace in 30 seconds and start working on your terms.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup?ref=1111_festival"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 px-8 py-4 text-sm font-bold text-navy shadow-lg transition-colors"
            >
              Claim 11.11 Founder Pass Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
