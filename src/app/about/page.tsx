import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";
import { Award, Briefcase, Code2, Rocket, Shield, Users } from "lucide-react";

export const metadata: Metadata = {
  title: `About CODCrafters & Usman Ghias - ${site.name}`,
  description:
    "Learn about CODCrafters and founder Usman Ghias, the systems engineering team building Clivora Freelancer OS.",
  alternates: { canonical: `${site.url}/about` },
};

export default function AboutPage() {
  return (
    <LegalPageShell
      title={`About ${site.company.name}`}
      description={`Engineering high-performance software and zero-fee business tools for freelancers and clients worldwide.`}
      lastUpdated="September 13, 2026"
    >
      <p>
        <strong>{site.company.name}</strong> is a software development and systems engineering
        studio focused on creating reliable, high-performance platforms for freelancers, agencies,
        and independent professionals. We believe operating a business should be unified,
        transparent, and fee-free, rather than fragmented across disconnected spreadsheets and
        commission-heavy marketplaces.
      </p>

      <h2>Our Mission</h2>
      <p>
        To build the most capable and transparent Freelancer Operating System, providing independent
        professionals and hiring clients with the infrastructure to manage deals, contracts,
        timesheets, and direct invoices from one centralized account.
      </p>

      <h2>Executive Leadership &amp; Engineering Pedigree</h2>
      <div className="not-prose my-8 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-white font-display text-xl font-bold">
            UG
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-navy">Usman Ghias</h3>
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800 border border-teal-200">
                Founder &amp; Lead Systems Architect
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Systems architect with over 10 years of experience designing high-scale enterprise
              ERP solutions (Odoo, PostgreSQL), distributed cloud architectures, and cross-platform
              mobile applications. As the founder of CODCrafters Systems Studio, Usman conceptualized
              Clivora to eliminate the 20% commission drag imposed by legacy freelance marketplaces
              and restore direct financial relationships between professionals and clients.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-teal-700">
              <a
                href="https://usmanghias.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-900 underline"
              >
                Personal Portfolio (usmanghias.co.uk) ↗
              </a>
              <a
                href={site.company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-900 underline"
              >
                CODCrafters Studio ↗
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-900 underline"
              >
                LinkedIn Profile ↗
              </a>
              <a
                href={`mailto:${site.company.email}`}
                className="hover:text-teal-900 underline"
              >
                Direct Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      <h2>{site.name} - The Complete Freelancer OS</h2>
      <p>
        {site.name} is our flagship platform, accessible on the web at{" "}
        <Link href="/">{site.url.replace("https://", "")}</Link> and on Android. It integrates
        private Connect direct hiring, CRM pipeline tracking, milestone project boards, automated
        invoicing, expense tracking, and financial reporting into a single cloud-synchronized
        workspace with <strong>$0 platform fees on negotiated deals</strong>.
      </p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: Code2,
            title: "Production Architecture",
            text: "Engineered on resilient cloud microservices, PostgreSQL databases, and modern web standards.",
          },
          {
            icon: Shield,
            title: "Privacy & Data Protection",
            text: "Strict GDPR adherence, authenticated session isolation, and encryption in transit and at rest.",
          },
          {
            icon: Users,
            title: "Zero Marketplace Commissions",
            text: "Unlike traditional platforms taking 10% to 20%, Clivora retains $0 commission on completed client invoices.",
          },
          {
            icon: Rocket,
            title: "Continuous Release Pipeline",
            text: "Active release cycle delivering automated CRM sync, invoice analytics, and multi-device sync.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-xs hover:border-teal-500/40 hover:bg-white transition-all"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-navy">{item.title}</h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <h2>Core Values</h2>
      <ul>
        <li>
          <strong>Direct Relationships:</strong> Freelancers and clients retain direct ownership of
          their communication and payment channels.
        </li>
        <li>
          <strong>Engineering Rigor:</strong> Clean, performant interfaces designed for daily operational use.
        </li>
        <li>
          <strong>Transparent Pricing:</strong> A permanent free tier with full core features and transparent optional Pro tiers.
        </li>
        <li>
          <strong>Data Sovereignty:</strong> Complete data exportability and self-service account management.
        </li>
      </ul>

      <h2>Company &amp; Legal Registry</h2>
      <ul>
        <li>
          <strong>Operating Entity:</strong> {site.company.name}
        </li>
        <li>
          <strong>Founder &amp; Principal:</strong> Usman Ghias
        </li>
        <li>
          <strong>Website:</strong>{" "}
          <a href={site.company.url} target="_blank" rel="noopener noreferrer">
            {site.company.url}
          </a>
        </li>
        <li>
          <strong>Official Registry Package:</strong> {site.appPackage} (Google Play)
        </li>
        <li>
          <strong>Support Desk:</strong>{" "}
          <a href={`mailto:${site.company.email}`}>{site.company.email}</a>
        </li>
      </ul>

      <h2>Get in Touch</h2>
      <p>
        For inquiries, partnerships, or technical discussions, reach our team via our{" "}
        <Link href="/contact">contact page</Link> or email{" "}
        <a href={`mailto:${site.company.email}`}>{site.company.email}</a>.
      </p>
    </LegalPageShell>
  );
}
