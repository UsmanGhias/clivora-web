import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { EnterpriseTrustSection } from "@/components/marketing/EnterpriseTrustSection";
import { CommissionSavingsCalculator } from "@/components/marketing/CommissionSavingsCalculator";
import { marketing } from "@/lib/marketing";
import { site } from "@/lib/site";


export const metadata: Metadata = {
  title: "Pricing",
  description: `CLIVORA pricing - Free, Pro (${site.pricing.proMonthlyLabel}/mo), and Pro Plus (${site.pricing.proPlusMonthlyLabel}/mo). Start free, upgrade when you grow.`,
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  const p = marketing.pricingPage;

  return (
    <MarketingShell>
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-teal-50/50 to-[#F8FAFC] pb-8 pt-14">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{p.badge}</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            {p.headline}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{p.body}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/plans-and-billing"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-navy"
            >
              Billing docs
            </Link>
          </div>
        </div>
      </section>
      <PricingSection showHeader={false} />

      {/* Plan Limits & Entitlements Matrix */}
      <section className="border-t border-slate-200/80 bg-slate-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Detailed Entitlement Registry</span>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
              Feature & Limit Comparison
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Deterministic platform quotas enforced at the Postgres database layer. All registered users currently enjoy 1-Year Founder Pro Plus at $0 cost.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-100/70 text-slate-700">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Platform Capability</th>
                  <th className="py-3.5 px-4 font-bold text-slate-600">Free ($0)</th>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Pro ($0 Free)</th>
                  <th className="py-3.5 px-4 font-bold text-teal-800 bg-teal-50/60">Founder Pro Plus ($0 Free)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-slate-600">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Active CRM Clients</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{site.freeLimits.clients} max</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700">Unlimited</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Active Projects</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{site.freeLimits.projects} max</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700">Unlimited</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Invoices / Month</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{site.freeLimits.invoicesPerMonth}/month</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700">Unlimited</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">File Vault Storage</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{site.freeLimits.fileVaultMb} MB</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700">{site.proLimits.fileVaultGb} GB</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">{site.proPlusLimits.fileVaultGb} GB</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Platform Take Rate</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700">$0 Deal Fee</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700">$0 Deal Fee</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">$0 Deal Fee</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Connect Marketplace</td>
                  <td className="py-3.5 px-4 text-slate-500">Browse only</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">Apply & submit proposals</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Priority talent listing</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Ask AI Workspace Assistant</td>
                  <td className="py-3.5 px-4 text-slate-400">Not included</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">Included (Gemini)</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Priority (Gemini)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Contracts & E-Signatures</td>
                  <td className="py-3.5 px-4 text-slate-500">Standard</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">Custom e-signatures</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Multi-party approvals</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Two-Factor Authentication (MFA)</td>
                  <td className="py-3.5 px-4 text-slate-400">Not included</td>
                  <td className="py-3.5 px-4 text-slate-400">Not included</td>
                  <td className="py-3.5 px-4 font-bold text-teal-700 bg-teal-50/30">Included (TOTP)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900">Founder Launch Grant</td>
                  <td className="py-3.5 px-4 text-slate-500">Free forever</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">Included Free (1 Year)</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 bg-teal-50/30">Included Free (1 Year)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CommissionSavingsCalculator />
      <EnterpriseTrustSection />
      <FAQSection />
      <CTASection />
    </MarketingShell>
  );
}

