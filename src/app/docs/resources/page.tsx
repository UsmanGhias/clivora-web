import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Download,
  ExternalLink,
  Shield,
  Calculator,
  FileCheck,
  FolderDown,
  Sparkles,
  Cloud,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Freelancer Resources & Templates - CLIVORA",
  description:
    "Download free contract templates, scope of work documents, NDAs, rate calculators, and more from our 5TB Google Drive Asset Lake. 100% free, no signup required.",
  openGraph: {
    title: "Free Freelancer Resources & Templates - CLIVORA",
    description: "Professional templates and tools for freelancers. 100% free on Google Drive.",
  },
};

const DRIVE_LAKE_URL = "https://drive.google.com/drive/folders/1LU9hkga7CpdO-AuWKRUKTNLLceXO6HlJ?usp=sharing";

interface Resource {
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  formats: string[];
  downloadUrl: string;
}

const resources: Resource[] = [
  {
    title: "Freelance Service Contract Template",
    description:
      "A comprehensive, lawyer-reviewed contract template covering scope, payment terms, intellectual property, confidentiality, and termination clauses. Ready to customize for any project.",
    category: "Contracts",
    icon: FileText,
    formats: ["DOCX", "PDF"],
    downloadUrl: DRIVE_LAKE_URL,
  },
  {
    title: "Scope of Work (SOW) Template",
    description:
      "Define project deliverables, milestones, timelines, and acceptance criteria. Prevents scope creep and keeps both parties aligned.",
    category: "Project Management",
    icon: FileCheck,
    formats: ["DOCX", "PDF"],
    downloadUrl: DRIVE_LAKE_URL,
  },
  {
    title: "Non-Disclosure Agreement (NDA)",
    description:
      "Mutual and one-way NDA templates for protecting confidential information during client engagements and pre-project discussions.",
    category: "Legal",
    icon: Shield,
    formats: ["DOCX", "PDF"],
    downloadUrl: DRIVE_LAKE_URL,
  },
  {
    title: "Freelancer Rate Calculator",
    description:
      "Calculate your ideal hourly, daily, and project rates based on expenses, desired salary, utilization rate, and profit margin. Works for any currency.",
    category: "Finance",
    icon: Calculator,
    formats: ["XLSX", "Google Sheets"],
    downloadUrl: DRIVE_LAKE_URL,
  },
  {
    title: "Client Onboarding Checklist",
    description:
      "Step-by-step checklist for onboarding new clients: from initial discovery call to signed contract, first invoice, and project kickoff.",
    category: "Operations",
    icon: FileCheck,
    formats: ["PDF", "Notion"],
    downloadUrl: DRIVE_LAKE_URL,
  },
  {
    title: "Invoice Template Pack",
    description:
      "Professional invoice templates with itemized billing, tax calculations, payment terms, and late fee clauses. Branded with your business identity.",
    category: "Finance",
    icon: FileText,
    formats: ["DOCX", "PDF", "XLSX"],
    downloadUrl: DRIVE_LAKE_URL,
  },
  {
    title: "Clivora Architecture Studio",
    description:
      "Interactive cloud systems architecture and distributed topology canvas. Design, review, and export enterprise diagrams live on discovery calls.",
    category: "Developer Suite",
    icon: Layers,
    formats: ["ONLINE", "CANVAS"],
    downloadUrl: "https://arch.clivora.io",
  },
  {
    title: "Clivora Code Studio",
    description:
      "Interactive multi-language sandbox. Test and inspect enterprise case studies: Odoo 19 XML-RPC transactions, Shopify Plus scripts, and PostgreSQL locks.",
    category: "Developer Suite",
    icon: Sparkles,
    formats: ["ONLINE", "SANDBOX"],
    downloadUrl: "https://play.clivora.io",
  },
  {
    title: "Clivora DevTools Suite",
    description:
      "Client-side developer utilities: JSON Beautifier & Minifier, JWT Inspector, SHA-256 Hasher, ZATCA Digest, UUID v4 Generator, and Epoch Converter.",
    category: "Developer Suite",
    icon: Calculator,
    formats: ["ONLINE", "UTILITY"],
    downloadUrl: "https://tools.clivora.io",
  },
];

const categories = [...new Set(resources.map((r) => r.category))];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#0F2838] to-[#0F766E] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>5TB Google Drive Asset Lake Connected</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Free Freelancer Resources & Templates
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Professional templates, legal contracts, scope of work documents, and rate calculators.
            100% free, ready to copy or download directly from our Google Drive cloud lake.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <a
              href={DRIVE_LAKE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-all active:scale-95"
            >
              <Cloud className="h-4 w-4" />
              Open 5TB Google Drive Asset Lake
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-slate-200 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 rounded-full bg-teal-700 text-white text-xs font-semibold">
              All Kits
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors"
              >
                {cat}
              </span>
            ))}
          </div>

          <a
            href={DRIVE_LAKE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
          >
            <FolderDown className="h-4 w-4" />
            Browse Shared Google Drive Folder
          </a>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.title}
                className="flex flex-col justify-between border border-slate-200/90 rounded-2xl bg-white p-6 shadow-xs hover:shadow-md hover:border-teal-500/60 transition-all group"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                        {resource.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                        {resource.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {resource.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                  <a
                    href={resource.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                  >
                    {resource.category === "Developer Suite" ? (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        Launch Tool
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Download File
                      </>
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Run your entire business for $0 on CLIVORA
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Stop paying 20% marketplace commissions. Use CLIVORA for client contracts, CRM, invoicing,
            timesheets, and our 100% free $0 commission marketplace.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-teal-700 text-white font-bold text-sm rounded-xl hover:bg-teal-800 transition-colors shadow-sm"
            >
              Claim 1-Year Free Founder Pro
            </Link>
            <Link
              href="/jobs"
              className="px-6 py-3 border border-slate-300 bg-white text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors"
            >
              Browse Remote Jobs ($0 Fee)
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
