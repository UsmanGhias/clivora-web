import type { Metadata } from "next";
import {
  Smartphone,
  ShieldCheck,
  Download,
  Lock,
  Zap,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download CLIVORA for Android | Google Play Store & Direct APK",
  description:
    "Install CLIVORA v5.6.2 directly from Google Play Store or download verified APK. Offline CRM, 7,150+ remote jobs, and milestone invoices on your mobile device.",
  alternates: { canonical: `${site.url}/download` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CLIVORA",
  operatingSystem: "Android, Web Browser",
  applicationCategory: "BusinessApplication",
  softwareVersion: "5.6.2",
  fileSize: "78MB",
  downloadUrl: site.playStoreUrl,
  installUrl: "https://clivora.io/download",
  description:
    "Business operating system for freelancers and agencies. Offline Drift SQLite CRM, dual-party milestone invoices, and 7,150+ verified remote jobs with zero commission.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Usman Ghias",
    url: "https://usmanghias.co.uk",
  },
  publisher: {
    "@type": "Organization",
    name: "CODCrafters",
    url: "https://codcrafters.org",
  },
};

export default function DownloadPage() {
  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-teal-50/50 via-white to-slate-50/60 pb-16 pt-14 lg:pb-20">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-800">
            <Smartphone className="h-3.5 w-3.5" />
            Official Android Release · v5.6.2 (Build 602)
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Install CLIVORA on Google Play
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
            Run the complete Freelancer &amp; Client Operating System on Android. Access private
            Connect hiring, offline-first CRM, milestone invoices, and 7,150+ verified remote jobs
            with $0 deal platform fees.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={site.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl bg-teal-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 hover:shadow-xl"
            >
              <Smartphone className="h-5 w-5" />
              <span>Get it on Google Play</span>
              <ExternalLink className="h-4 w-4 opacity-80" />
            </a>

            <a
              href="/download/apk"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-navy shadow-xs transition hover:border-teal-400 hover:bg-teal-50"
            >
              <Download className="h-4 w-4 text-teal-700" />
              <span>Download Direct APK (v5.6.2)</span>
            </a>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Requires Android 7.0 (API 24) or higher. Target SDK 36 (Android 14/15/16 ready). Zero advertising IDs.
          </p>
        </div>
      </section>

      {/* Package & Verification Specs */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <h2 className="text-xl font-bold text-navy text-center">Release Technical Specifications</h2>
          <p className="mt-1 text-center text-xs text-slate-500">
            Verified build signatures for Google Play Console upload and sideload verification.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60 shadow-2xs">
            <dl className="divide-y divide-slate-200 text-sm">
              <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-slate-700">Application Package</dt>
                <dd className="font-mono text-xs text-slate-900 sm:col-span-2">org.codcrafters.clivora</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-slate-700">Release Version</dt>
                <dd className="font-mono text-xs text-slate-900 sm:col-span-2">v5.6.2 (Version Code: 602)</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-slate-700">Primary Distribution</dt>
                <dd className="text-xs text-slate-900 sm:col-span-2">
                  <a
                    href={site.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-teal-700 underline"
                  >
                    Google Play Store Listing
                  </a>{" "}
                  (Android App Bundle .aab signed for production)
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-slate-700">Minimum Android SDK</dt>
                <dd className="text-xs text-slate-900 sm:col-span-2">Android 7.0 (API Level 24)</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-slate-700">Target Android SDK</dt>
                <dd className="text-xs text-slate-900 sm:col-span-2">Android 16 (API Level 36, complies with Play Store 2026 standards)</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-slate-700">Upload Certificate SHA-1</dt>
                <dd className="font-mono text-[11px] text-slate-800 break-all sm:col-span-2">
                  96:93:81:80:EE:59:27:D2:46:B2:BD:FC:6C:96:C6:93:2E:1A:1D:36
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-slate-700">Source Repository</dt>
                <dd className="text-xs text-slate-900 sm:col-span-2">
                  <a
                    href={site.openSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-teal-700 underline"
                  >
                    GitHub (Open Source)
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Feature Capabilities */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
              Engineered for Production Mobile Operations
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              CLIVORA mobile operates independently with SQLite offline storage and synchronizes safely upon connection.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800 mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-navy">Offline SQLite Engine</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Full offline access to clients, contracts, tasks, and timesheets. Changes queue locally and sync automatically when internet is restored.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-navy">Local Biometric Security</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Lock sensitive financial data, invoice logs, and client contracts behind device fingerprint and face unlock hardware.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-800 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-navy">Strict Data Privacy</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                No tracking or advertising IDs. All data is encrypted in transit using HTTPS/TLS. Self-serve account deletion available anytime.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href={site.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-bold text-white transition hover:bg-navy/90"
            >
              <Smartphone className="h-4 w-4" />
              <span>Install CLIVORA from Google Play</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
