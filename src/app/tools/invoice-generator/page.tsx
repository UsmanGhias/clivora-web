import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, HelpCircle, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import { InvoiceGeneratorClient } from "./InvoiceGeneratorClient";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Online Invoice Generator for Freelancers (PDF)",
  description:
    "Create and download professional PDF invoices online for free. Add line items, calculate taxes and totals, customize currencies, and bill clients directly with zero platform fees.",
  alternates: { canonical: `${site.url}/tools/invoice-generator` },
  keywords: [
    "free invoice generator",
    "freelance invoice maker",
    "download pdf invoice free",
    "online invoice creator",
    "consultant invoice template",
    "zero fee invoicing",
  ],
};

const FAQS = [
  {
    q: "Is this invoice generator really 100% free?",
    a: "Yes. You can generate, customize, and print or export unlimited PDF invoices right in your web browser with zero registration, zero credit card, and zero watermarks.",
  },
  {
    q: "What payment details should I include on my freelance invoice?",
    a: "Always include: your legal business name, contact email, physical or business address, client name and billing address, unique invoice number, invoice date, payment due date (e.g. Net 14 or Net 30), itemized description of work completed with hours/units and rates, subtotal, applicable taxes, and exact payment details (bank IBAN/SWIFT, ACH routing number, or payment link).",
  },
  {
    q: "How does Clivora protect invoice payments?",
    a: "Clivora is designed so that clients pay you directly on your chosen terms. Unlike gig marketplaces that delay payouts for up to 14 days and deduct 10% to 20%, Clivora takes $0 commission on settled invoices.",
  },
  {
    q: "Can I automatically convert tracked timesheets into invoices?",
    a: "Yes. When you create a free Clivora workspace account, hours logged using the built-in project timer can be converted into itemized PDF invoices with a single click.",
  },
];

export default function InvoiceGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free Online Invoice Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free browser-based invoice generator for freelancers and independent contractors. Create and export professional PDF invoices with multi-currency support.",
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-[#F0FDF4] via-[#F8FAFC] to-white py-12 sm:py-16 print:hidden">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-navy transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/tools" className="hover:text-navy transition-colors">
              Tools
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-slate-800">Invoice Generator</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Instant PDF Invoicing · Free Browser Tool</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Free Online Invoice Generator
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Draft professional, itemized invoices for your clients in seconds. Fill in deliverables,
              calculate taxes and totals, and export clean PDFs ready for print or email.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <InvoiceGeneratorClient />

          <div className="mt-12 print:hidden">
            <JobAdSenseSlot format="banner" />
          </div>

          {/* Educational Content & FAQ */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs print:hidden">
            <h2 className="font-display text-2xl font-bold text-navy">
              Standard Freelance Invoicing Best Practices
            </h2>
            <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-slate-600">
              <p>
                Sending clear, structured invoices is the single most effective way to eliminate payment delays.
                Clients with automated accounts payable departments require specific identifiers—including sequential
                invoice numbers, itemized scopes of work, and clear payment rails—before releasing funds.
              </p>
              <p>
                By providing payment instructions and clear due dates (such as Net 14 or Net 30) directly on the document,
                you set professional boundaries and protect your cash flow without paying 10% to 20% platform brokerage cuts.
              </p>
            </div>

            {/* FAQs */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <h3 className="font-display text-xl font-bold text-navy">Frequently Asked Questions</h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {FAQS.map((faq) => (
                  <div key={faq.q} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                    <h4 className="flex items-start gap-2 text-sm font-bold text-navy">
                      <HelpCircle className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
