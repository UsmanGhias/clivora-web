import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: `Contact Us - ${site.company.name}`,
  description:
    "Get in touch with the CODCrafters team for Clivora platform support, privacy requests, or business inquiries.",
  alternates: { canonical: `${site.url}/contact` },
};

export default function ContactPage() {
  return (
    <LegalPageShell
      title="Contact Us"
      description={`We are here to help. Submit a message or reach out directly for support, privacy requests, or business inquiries.`}
      lastUpdated="September 13, 2026"
    >
      <p>
        Whether you need help with {site.name}, have a privacy inquiry, or wish to explore an
        enterprise partnership, the {site.company.name} engineering team is ready to assist you.
      </p>

      <div className="not-prose my-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-xs hover:border-teal-500/40 hover:bg-white transition-all">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-navy">General Support</h3>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Platform inquiries, account setup, and invoice tool assistance.
          </p>
          <a
            href={`mailto:${site.company.email}`}
            className="mt-3 inline-block text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            {site.company.email}
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-xs hover:border-teal-500/40 hover:bg-white transition-all">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-navy">Privacy &amp; Data Rights</h3>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            GDPR inquiries, data access requests, and compliance matters.
          </p>
          <a
            href={`mailto:${site.company.privacyEmail}`}
            className="mt-3 inline-block text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            {site.company.privacyEmail}
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-xs hover:border-teal-500/40 hover:bg-white transition-all">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-navy">Legal &amp; Contracts</h3>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Terms of service, licensing, and partnership coordination.
          </p>
          <a
            href={`mailto:${site.company.legalEmail}`}
            className="mt-3 inline-block text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            {site.company.legalEmail}
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-xs hover:border-teal-500/40 hover:bg-white transition-all">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-navy">Response SLA</h3>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            We respond within 1 to 2 business days. Direct live chat support also active.
          </p>
        </div>
      </div>

      <h2>Send Us a Direct Message</h2>
      <p>
        Use the secure form below to send our operations team an inquiry directly from your browser:
      </p>
      <div className="not-prose my-8 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <ContactForm />
      </div>

      <h2>Company Details</h2>
      <ul>
        <li>
          <strong>Operating Entity:</strong> {site.company.name}
        </li>
        <li>
          <strong>Founder &amp; Systems Architect:</strong> Usman Ghias
        </li>
        <li>
          <strong>Studio Website:</strong>{" "}
          <a href={site.company.url} target="_blank" rel="noopener noreferrer">
            {site.company.url}
          </a>
        </li>
        <li>
          <strong>Platform:</strong> {site.name} ({site.appPackage})
        </li>
      </ul>

      <h2>Self-Service Resources</h2>
      <p>Before contacting support, you may find instant answers in our documentation:</p>
      <ul>
        <li>
          <Link href="/support">Support Center &amp; FAQ</Link> - Answers to common setup questions
        </li>
        <li>
          <Link href="/docs">Documentation</Link> - Platform architecture and user manuals
        </li>
        <li>
          <Link href="/delete-account">Account Deletion</Link> - Self-service data removal
        </li>
        <li>
          <Link href="/privacy">Privacy Policy</Link> - Comprehensive data protection disclosures
        </li>
        <li>
          <Link href="/disclaimer">Platform Disclaimer</Link> - Financial and intermediary disclosures
        </li>
      </ul>
    </LegalPageShell>
  );
}
