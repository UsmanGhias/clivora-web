import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";
import {
  Briefcase,
  Building2,
  Calculator,
  FileCode,
  FileText,
  HelpCircle,
  Layers,
  Percent,
  Shield,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: `HTML Sitemap - ${site.name}`,
  description:
    "Explore the complete directory of Clivora Freelancer OS features, client portals, remote jobs, guides, and legal compliance pages.",
  alternates: { canonical: `${site.url}/sitemap` },
};

const SITEMAP_SECTIONS = [
  {
    title: "Platform Core",
    icon: Layers,
    links: [
      { label: "Home", href: "/", desc: "Platform overview, founder mission, and core OS modules" },
      {
        label: "For Freelancers",
        href: "/for-freelancers",
        desc: "Freelancer desk for pipeline, CRM, and time tracking",
      },
      {
        label: "For Clients",
        href: "/for-clients",
        desc: "Client portal for milestone contracts and verified hiring",
      },
      {
        label: "Platform Features",
        href: "/features",
        desc: "CRM, invoices, proposals, tasks, and file vault breakdown",
      },
      {
        label: "Security Architecture",
        href: "/security",
        desc: "PostgreSQL Supabase Row-Level Security, AES-256 encryption, and GDPR compliance",
      },
      {
        label: "Integrations & Ecosystem",
        href: "/integrations",
        desc: "Odoo ERP, Google Play billing, Stripe payments, and cloud storage",
      },
      {
        label: "Pricing & Plans",
        href: "/pricing",
        desc: "100% Free Founder Launch tier with $0 platform fees",
      },
      {
        label: "Pro Upgrade",
        href: "/pro",
        desc: "Unlimited cloud storage, custom branding, and team seats",
      },
      { label: "Log In", href: "/login", desc: "Access web app workspace" },
      { label: "Sign Up", href: "/signup", desc: "Create a free freelancer or client account" },
    ],
  },
  {
    title: "Free Tools & Calculators",
    icon: Calculator,
    links: [
      {
        label: "Free Tools Directory",
        href: "/tools",
        desc: "Complete suite of free business tools and interactive calculators",
      },
      {
        label: "Freelance Hourly Rate Calculator",
        href: "/tools/freelance-rate-calculator",
        desc: "Calculate target hourly and day rates from desired net income and overhead",
      },
      {
        label: "Upwork Fee Leakage Calculator",
        href: "/tools/upwork-fee-calculator",
        desc: "Analyze 10% commission, connects, and withdrawal costs vs $0 on Clivora",
      },
      {
        label: "Free PDF Invoice Generator",
        href: "/tools/invoice-generator",
        desc: "Generate, itemize, and print professional PDF invoices with multi-currency support",
      },
    ],
  },
  {
    title: "Platform Comparisons",
    icon: Percent,
    links: [
      {
        label: "Marketplace Comparison Overview",
        href: "/compare",
        desc: "Direct side-by-side fee and feature matrix vs legacy gig platforms",
      },
      {
        label: "Clivora vs Upwork",
        href: "/compare/upwork",
        desc: "Zero take rate, no proposal tokens, and direct client invoicing vs Upwork",
      },
      {
        label: "Clivora vs Fiverr",
        href: "/compare/fiverr",
        desc: "High-ticket milestone contracts and retainers vs 20% seller cuts on Fiverr",
      },
      {
        label: "Clivora vs Contra",
        href: "/compare/contra",
        desc: "Full Freelancer OS with Android app, client CRM, and time-tracking vs Contra",
      },
      {
        label: "Clivora vs Hello Bonsai",
        href: "/compare/bonsai",
        desc: "Free core OS tier and integrated hiring marketplace vs Bonsai paywalls",
      },
    ],
  },
  {
    title: "Marketplace & Remote Jobs",
    icon: Briefcase,
    links: [
      {
        label: "Remote Jobs Directory",
        href: "/jobs",
        desc: "Real-time verified engineering, design, and product listings",
      },
      {
        label: "Connect Marketplace",
        href: "/connect",
        desc: "Private contact hiring with zero platform fees on deals",
      },
      {
        label: "Start a Project",
        href: "/start-a-project",
        desc: "Draft instant project briefs and AI-assisted scopes of work",
      },
    ],
  },
  {
    title: "Documentation & Community",
    icon: FileCode,
    links: [
      {
        label: "Documentation Center",
        href: "/docs",
        desc: "Setup guides, API references, and workflow walkthroughs",
      },
      {
        label: "Docs Resources",
        href: "/docs/resources",
        desc: "Templates, checklists, and integration specifications",
      },
      {
        label: "Community Blog",
        href: "https://community.clivora.io/blog",
        desc: "Technical articles, architecture deep dives, and tutorials",
        external: true,
      },
      {
        label: "Community Forum",
        href: "https://community.clivora.io/forum",
        desc: "Peer discussions, troubleshooting, and feature requests",
        external: true,
      },
      {
        label: "Support Desk",
        href: "/support",
        desc: "Help documentation, live chat assistance, and ticket submission",
      },
    ],
  },
  {
    title: "Developer & Architecture Suite",
    icon: FileCode,
    links: [
      {
        label: "Architecture Studio",
        href: "https://arch.clivora.io",
        desc: "Interactive cloud systems topology and live enterprise architecture canvas",
        external: true,
      },
      {
        label: "Code Studio",
        href: "https://play.clivora.io",
        desc: "Interactive multi-language engineering sandbox and transaction case studies",
        external: true,
      },
      {
        label: "DevTools Utility Suite",
        href: "https://tools.clivora.io",
        desc: "Client-side developer utilities: JSON, JWT, SHA-256 ZATCA digest, and UUID v4",
        external: true,
      },
    ],
  },
  {
    title: "Company & Leadership",
    icon: Building2,
    links: [
      {
        label: "About CODCrafters",
        href: "/about",
        desc: "Company background, systems architecture vision, and team credentials",
      },
      {
        label: "Contact Us",
        href: "/contact",
        desc: "Direct support, partnership inquiries, and contact form",
      },
      {
        label: "CODCrafters Studio",
        href: "https://codcrafters.org",
        desc: "Parent software engineering studio and enterprise solutions",
        external: true,
      },
    ],
  },
  {
    title: "Legal & Trust Center",
    icon: Shield,
    links: [
      {
        label: "Trust & Safety Standards",
        href: "/trust",
        desc: "Zero platform fee architecture, direct settlement, and job provenance verification",
      },
      {
        label: "Privacy Policy",
        href: "/privacy",
        desc: "Data collection, user ownership, and GDPR compliance",
      },
      {
        label: "Terms of Service",
        href: "/terms",
        desc: "Account terms, acceptable use, and platform agreements",
      },
      {
        label: "Cookie Policy",
        href: "/cookies",
        desc: "Information regarding essential and analytics cookies",
      },
      {
        label: "Platform Disclaimer",
        href: "/disclaimer",
        desc: "Earnings notices, intermediary model, and non-custodial disclosures",
      },
      {
        label: "Data Safety",
        href: "/data-safety",
        desc: "Encryption, backup routines, and storage security standards",
      },
      {
        label: "Delete Account",
        href: "/delete-account",
        desc: "Self-service account deletion and data removal requests",
      },
    ],
  },
];

export default function SitemapPage() {
  return (
    <LegalPageShell
      title="HTML Sitemap"
      description={`Structured directory of all public routes, services, documentation, and compliance pages on ${site.url.replace("https://", "")}.`}
      lastUpdated="September 13, 2026"
    >
      <div className="not-prose space-y-10">
        {SITEMAP_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <section.icon className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-navy">{section.title}</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {section.links.map((link) => {
                const isExt = "external" in link && link.external;
                const linkProps = isExt
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {};

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    {...linkProps}
                    className="group flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:border-teal-500/30 hover:bg-white hover:shadow-xs"
                  >
                    <span className="font-semibold text-navy group-hover:text-teal-700 transition-colors">
                      {link.label} {isExt && "↗"}
                    </span>
                    <span className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {link.desc}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </LegalPageShell>
  );
}
