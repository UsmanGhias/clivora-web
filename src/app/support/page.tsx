import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Support & FAQ - ${site.name}`,
  description: `Get help with ${site.name}. Frequently asked questions, troubleshooting, and support resources.`,
};

const faqs = [
  {
    q: "How do I create an account?",
    a: "Download CLIVORA from Google Play, open the app, and tap Sign Up. Enter your name, email, and password. During early access, all features are free.",
  },
  {
    q: "Is my data stored in the cloud?",
    a: "All business data is stored locally on your device using SQLite. CLIVORA AI runs offline. Cloud sync is on our roadmap.",
  },
  {
    q: "What are the Free plan limits?",
    a: `After early access: ${site.freeLimits.clients} clients, ${site.freeLimits.projects} projects, ${site.freeLimits.invoicesPerMonth} invoices/month, ${site.freeLimits.templates} templates, and ${site.freeLimits.fileVaultMb} MB File Vault.`,
  },
  {
    q: "How do I upgrade to Pro?",
    a: `Pro (${site.pricing.proMonthlyLabel}/month) and Pro Plus are available via Google Play Billing in the Android app, and via web checkout at /pro. Subscribe in-app on Android; manage or cancel in Google Play → Subscriptions.`,
  },
  {
    q: "How do I export PDF invoices?",
    a: "Open any invoice → tap Preview/Share → choose PDF. Customize branding under More → Invoice Branding with your logo and template style.",
  },
  {
    q: "What is CLIVORA AI?",
    a: "Open Hub → CLIVORA AI for local insights: follow-up drafts, revenue snapshots, and project alerts. No internet required.",
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

      <div className="not-prose my-10 space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-2xl glass transition-colors open:bg-white/5"
          >
            <summary className="cursor-pointer list-none px-6 py-5 font-semibold text-white [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {faq.q}
                <span className="text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-white/5 px-6 pb-5 pt-2 text-sm text-white/60 leading-relaxed">
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
