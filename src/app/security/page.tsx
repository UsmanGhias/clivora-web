import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Server,
  Database,
  KeyRound,
  FileCheck,
  ChevronRight,
  Home,
  CheckCircle2,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Platform Security & Data Protection Architecture",
  description:
    "Learn about Clivora's security architecture. Enterprise PostgreSQL Row-Level Security (RLS), AES-256 encrypted file vault, zero storage of payment credentials, and GDPR compliance.",
  alternates: { canonical: `${site.url}/security` },
  keywords: [
    "clivora security",
    "freelancer data protection",
    "supabase row level security",
    "gdpr compliant freelance software",
    "aes 256 file vault",
  ],
};

const PILLARS = [
  {
    icon: Database,
    title: "PostgreSQL Row-Level Security (RLS)",
    badge: "Database Isolation",
    desc: "Every database query is gated at the Postgres engine layer using strict tenant-isolated RLS policies. A freelancer or client can never query or inspect records belonging to another organization, regardless of client-side parameters.",
  },
  {
    icon: Lock,
    title: "AES-256 File Vault Encryption",
    badge: "Storage Security",
    desc: "Documents, NDAs, project attachments, and deliverables stored inside the Clivora File Vault are encrypted at rest using industry-standard AES-256 encryption. Signed URLs expire automatically to prevent unauthorized sharing.",
  },
  {
    icon: KeyRound,
    title: "Zero Plaintext Credentials & Modern Auth",
    badge: "Authentication",
    desc: "Clivora never stores raw user passwords. Authentication is handled via PKCE-flow OAuth 2.0 and cryptographically salted argon2/bcrypt hashes. Multi-factor authentication (TOTP) is supported across all accounts.",
  },
  {
    icon: Server,
    title: "Zero Payment Credential Retention",
    badge: "PCI-DSS Compliance",
    desc: "Credit card numbers, bank account secrets, and payout credentials never touch or traverse Clivora application servers. All transaction billing is delegated directly to PCI-DSS Level 1 certified processors (Stripe & Safepay).",
  },
  {
    icon: ShieldCheck,
    title: "Hardened HTTP Security Headers",
    badge: "Network Layer",
    desc: "Clivora enforces strict HSTS (Strict-Transport-Security: max-age=63072000), frame isolation (X-Frame-Options: DENY), Content-Type protection (nosniff), and cross-origin isolation across all web endpoints.",
  },
  {
    icon: FileCheck,
    title: "GDPR & CCPA Data Sovereignty",
    badge: "Compliance",
    desc: "Users maintain complete ownership of their data. In accordance with GDPR Article 17 and CCPA, you can export your complete business ledger or permanently delete your account and all associated records with one click.",
  },
];

export default function SecurityPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative border-b border-slate-200 bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFC] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-navy transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-slate-800">Security Architecture</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>Enterprise Standards · Transparency</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Security &amp; Data Protection Architecture
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Independent contractors and hiring clients trust Clivora with their contracts, client communications,
              and financial ledgers. Here is how we engineer our infrastructure to safeguard your business.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {p.badge}
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-base font-bold text-navy">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Compliance & Contact */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 sm:p-12 shadow-xs">
            <div className="max-w-3xl">
              <h3 className="font-display text-2xl font-bold text-navy">
                Vulnerability Disclosure &amp; Security Audits
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                We take proactive measures to maintain platform integrity. If you are a security researcher and believe you have
                discovered a vulnerability, please report it to our engineering team at{" "}
                <a href={`mailto:${site.company.privacyEmail}`} className="font-bold text-teal-800 underline">
                  {site.company.privacyEmail}
                </a>
                . We review all technical submissions promptly.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
                <Link href="/privacy" className="text-teal-800 hover:text-teal-950 underline">
                  Read Privacy Policy ↗
                </Link>
                <Link href="/data-safety" className="text-teal-800 hover:text-teal-950 underline">
                  View Google Play Data Safety ↗
                </Link>
                <Link href="/delete-account" className="text-slate-500 hover:text-slate-700 underline">
                  Account Deletion &amp; Data Rights ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
