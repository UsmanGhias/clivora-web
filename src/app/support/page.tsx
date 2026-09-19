import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Support & FAQ - ${site.name}`,
  description: `Get help with ${site.name}. Frequently asked questions, troubleshooting, and support resources.`,
  alternates: { canonical: `${site.url}/support` },
};

const faqs = [
  {
    q: "How do I create an account?",
    a: "Download CLIVORA from Google Play, open the app, and tap Sign Up. Enter your name, email, and password. During early access, all features are free.",
  },
  {
    q: "How does data storage and cloud synchronization work?",
    a: "Clivora is built on an offline-first architecture. Your data is stored locally on your device using SQLite for instantaneous offline access, and automatically synchronizes to your secure cloud account across the web app and Android whenever you are connected.",
  },
  {
    q: "What are the Free plan limits?",
    a: `After early access: ${site.freeLimits.clients} clients, ${site.freeLimits.projects} projects, ${site.freeLimits.invoicesPerMonth} invoices/month, ${site.freeLimits.templates} templates, and ${site.freeLimits.fileVaultMb} MB File Vault.`,
  },
  {
    q: "How do I upgrade to Pro?",
    a: `Pro (${site.pricing.proMonthlyLabel}/month) and Pro Plus are available via Google Play Billing in the Android app, and via web checkout at /pro. Subscribe in-app on Android; manage or cancel in Google Play (Subscriptions).`,
  },
  {
    q: "How do I export PDF invoices?",
    a: "Open any invoice, tap Preview/Share, and choose PDF. Customize branding under More (Invoice Branding) with your logo and template style.",
  },
  {
    q: "What is CLIVORA AI?",
    a: "Open Hub and tap CLIVORA AI for intelligent insights: follow-up drafts, proposal generation, revenue snapshots, and project alerts.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to More → Profile → Delete Account, or see our Account Deletion page for full instructions.",
  },
  {
    q: "How do I cancel a Pro subscription?",
    a: "Open Google Play Store → Subscriptions → CLIVORA Pro → Cancel. Active until the end of the billing period.",
  },
  {
    q: "Is CLIVORA available on iOS?",
    a: "Android is available now. iOS is coming soon. Visit clivora.io for updates.",
  },
  {
    q: "How do I contact support?",
    a: `Email ${site.company.email} with your device model, Android version, and app version (${site.appVersion}).`,
  },
];

export default function SupportPage() {
  return (
    <LegalPageShell
      title="Support & FAQ"
      description={`Find answers to common questions about ${site.name}.`}
    >
      <p>
        Need help with {site.name}? Browse our frequently asked questions below.
        If you can&apos;t find what you&apos;re looking for,{" "}
        <Link href="/contact">contact our support team</Link>.
      </p>

      <div className="not-prose my-10 space-y-3.5">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-slate-200/90 bg-slate-50/60 p-1 transition-all duration-200 hover:border-teal-500/40 hover:bg-white open:border-teal-500/50 open:bg-white open:shadow-xs"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-bold text-navy [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-navy sm:text-base">{faq.q}</span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-black text-teal-700 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <h2>Quick Links</h2>
      <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/delete-account">Delete Account</a></li>
        <li><a href="/data-safety">Data Safety</a></li>
        <li><a href="/contact">Contact Support</a></li>
      </ul>

      <h2>App Information</h2>
      <ul>
        <li><strong>Package:</strong> {site.appPackage}</li>
        <li><strong>Version:</strong> {site.appVersion}</li>
        <li><strong>Developer:</strong> {site.company.name}</li>
      </ul>

      <h2>Still Need Help?</h2>
      <p>
        Email{" "}
        <a href={`mailto:${site.company.email}`}>{site.company.email}</a> with
        a description of your issue.
      </p>
    </LegalPageShell>
  );
}
