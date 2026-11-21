"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Printer,
  Copy,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  amount: number;
  timeline: string;
  deliverables: string;
}

export function ContractGeneratorClient() {
  const [contractDate, setContractDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [contractorName, setContractorName] = useState("Alex Vance");
  const [contractorTitle, setContractorTitle] = useState("Senior Full-Stack Engineer");
  const [contractorEmail, setContractorEmail] = useState("alex@example.com");
  const [contractorLocation, setContractorLocation] = useState("London, United Kingdom");

  const [clientName, setClientName] = useState("Sarah Jenkins");
  const [clientCompany, setClientCompany] = useState("Apex Global Technologies");
  const [clientEmail, setClientEmail] = useState("sarah.jenkins@apexglobal.io");
  const [clientLocation, setClientLocation] = useState("San Francisco, CA, USA");

  const [projectTitle, setProjectTitle] = useState("Enterprise Web Platform & Headless API Integration");
  const [projectDescription, setProjectDescription] = useState(
    "Design and implementation of a responsive Next.js web application with PostgreSQL database schemas, automated testing, and secure third-party payment integration."
  );

  const [currency, setCurrency] = useState("USD");
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "m-1",
      title: "Architecture & Foundation Setup",
      amount: 3500,
      timeline: "14 days from contract signing",
      deliverables: "Database schema ERD, Next.js repository scaffolding, auth workflows, and core API endpoints.",
    },
    {
      id: "m-2",
      title: "Core Feature Delivery & Client Testing",
      amount: 3500,
      timeline: "21 days following Milestone 1 approval",
      deliverables: "Full functional dashboard, payment integration, user permissions, and staging deployment.",
    },
    {
      id: "m-3",
      title: "Production Deployment & Handoff",
      amount: 1500,
      timeline: "7 days following final QA sign-off",
      deliverables: "Production deployment, automated smoke tests, documentation codemaps, and codebase handoff.",
    },
  ]);

  const [paymentTerms, setPaymentTerms] = useState("Due upon invoice submission (Net 0)");
  const [revisionRounds, setRevisionRounds] = useState(2);
  const [acceptanceDays, setAcceptanceDays] = useState(7);
  const [copiedText, setCopiedText] = useState(false);

  const totalContractValue = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  // Fee calculation vs Upwork (10% + 5% client = 15%) and Fiverr (20% + 5.5% = 25.5%)
  const upworkSaved = totalContractValue * 0.15;
  const fiverrSaved = totalContractValue * 0.255;

  const addMilestone = () => {
    const newId = `m-${Date.now()}`;
    setMilestones([
      ...milestones,
      {
        id: newId,
        title: `Milestone ${milestones.length + 1}`,
        amount: 1000,
        timeline: "14 days from prior milestone approval",
        deliverables: "Itemized deliverables and test artifacts.",
      },
    ]);
  };

  const removeMilestone = (id: string) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string | number) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const generatePlainText = () => {
    return `INDEPENDENT CONTRACTOR SERVICE AGREEMENT
Date: ${contractDate}

PARTIES:
1. CONTRACTOR: ${contractorName} (${contractorTitle})
   Email: ${contractorEmail}
   Location: ${contractorLocation}

2. CLIENT: ${clientName}, representing ${clientCompany}
   Email: ${clientEmail}
   Location: ${clientLocation}

PROJECT SCOPE & OBJECTIVE:
Project: ${projectTitle}
Description: ${projectDescription}

MILESTONE SCHEDULE & PAYMENT TERMS:
Total Contract Value: $${totalContractValue.toLocaleString()} ${currency}
Payment Terms: ${paymentTerms}

${milestones
  .map(
    (m, i) => `Milestone ${i + 1}: ${m.title}
Amount: $${Number(m.amount).toLocaleString()} ${currency}
Timeline: ${m.timeline}
Deliverables: ${m.deliverables}`
  )
  .join("\n\n")}

TERMS & LEGAL CLAUSES:
1. ACCEPTANCE WINDOW: Client shall have ${acceptanceDays} business days following deliverable submission to review and either approve or request reasonable revisions. If no rejection is received within ${acceptanceDays} business days, deliverable is deemed accepted.
2. REVISIONS: Agreement includes up to ${revisionRounds} rounds of revisions within scope. Out-of-scope modifications require a written amendment.
3. INTELLECTUAL PROPERTY: Upon 100% full financial settlement of each milestone, Contractor transfers and assigns all rights, title, and intellectual property in the custom work deliverables to Client on a work-for-hire basis.
4. CONFIDENTIALITY: Both parties agree to protect proprietary technical, financial, and business data disclosed during engagement.
5. ZERO PLATFORM FEE AUDIT: This contract operates under the Clivora 0% platform fee protocol. Neither Contractor nor Client pays third-party marketplace commissions on this agreement.

SIGNATURES:

Contractor: ________________________   Date: ____________
${contractorName}

Client:     ________________________   Date: ____________
${clientName} (${clientCompany})`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generatePlainText());
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 via-white to-teal-50 p-5 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
              0% Marketplace Commission Standard
            </span>
            <span className="text-xs text-slate-500 font-mono">Plain English Legal Draft</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Generate legally sound freelance service agreements with milestone deliverables, acceptance windows, and 100% IP transfer.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs w-full sm:w-auto"
          >
            {copiedText ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
            <span>{copiedText ? "Agreement Copied!" : "Copy Agreement Text"}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 transition shadow-xs w-full sm:w-auto"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Form Controls (Hidden during print) */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          {/* Contractor Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <span>1. Contractor Information</span>
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Contractor Name</label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Professional Title</label>
                <input
                  type="text"
                  value={contractorTitle}
                  onChange={(e) => setContractorTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={contractorEmail}
                  onChange={(e) => setContractorEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">City, Country</label>
                <input
                  type="text"
                  value={contractorLocation}
                  onChange={(e) => setContractorLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <span>2. Client Information</span>
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Client Contact Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Company Name</label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Client City / Region</label>
                <input
                  type="text"
                  value={clientLocation}
                  onChange={(e) => setClientLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <span>3. Project Scope &amp; Deliverables</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Project Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Project Scope Summary</label>
                <textarea
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Milestones Editor */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                4. Milestones ({milestones.length})
              </h4>
              <button
                type="button"
                onClick={addMilestone}
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Milestone
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((m, index) => (
                <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-navy">Milestone {index + 1}</span>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(m.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">Title</label>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => updateMilestone(m.id, "title", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold">Amount ({currency})</label>
                      <input
                        type="number"
                        min={0}
                        value={m.amount}
                        onChange={(e) => updateMilestone(m.id, "amount", Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold">Timeline / Due Period</label>
                    <input
                      type="text"
                      value={m.timeline}
                      onChange={(e) => updateMilestone(m.id, "timeline", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold">Key Deliverables</label>
                    <input
                      type="text"
                      value={m.deliverables}
                      onChange={(e) => updateMilestone(m.id, "deliverables", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms Controls */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
              5. Terms &amp; Conditions
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500"
                >
                  <option value="Due upon invoice submission (Net 0)">Due upon invoice (Net 0)</option>
                  <option value="Net 7 calendar days">Net 7 days</option>
                  <option value="Net 14 calendar days">Net 14 days</option>
                  <option value="Net 30 calendar days">Net 30 days</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Acceptance Window</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={acceptanceDays}
                  onChange={(e) => setAcceptanceDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Formatted Contract Document (A4/Print Ready) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 print:hidden">
            <span>Live Document Preview</span>
            <span className="font-semibold text-teal-800">Ready to print or sign</span>
          </div>

          <div className="rounded-3xl border border-slate-300 bg-white p-8 sm:p-12 shadow-sm text-slate-800 text-xs sm:text-sm leading-relaxed space-y-6 print:shadow-none print:border-none print:p-0">
            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  STANDARD PROFESSIONAL AGREEMENT
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-navy font-display mt-0.5">
                  Independent Contractor Service Agreement
                </h2>
              </div>
              <div className="text-right sm:text-right text-xs text-slate-500 font-mono">
                Date: {contractDate}
              </div>
            </div>

            {/* Parties Box */}
            <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Contractor</p>
                <p className="font-semibold text-navy text-sm mt-0.5">{contractorName}</p>
                <p className="text-slate-500">{contractorTitle}</p>
                <p className="text-slate-500">{contractorEmail}</p>
                <p className="text-slate-500">{contractorLocation}</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Client</p>
                <p className="font-semibold text-navy text-sm mt-0.5">{clientName}</p>
                <p className="text-slate-500">{clientCompany}</p>
                <p className="text-slate-500">{clientEmail}</p>
                <p className="text-slate-500">{clientLocation}</p>
              </div>
            </div>

            {/* Project Overview */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy">1. Project Title &amp; Scope</h3>
              <p className="font-bold text-navy">{projectTitle}</p>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{projectDescription}</p>
            </div>

            {/* Milestone Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy">2. Milestones &amp; Compensation</h3>
                <span className="font-mono text-sm font-bold text-navy">
                  Total: ${totalContractValue.toLocaleString()} {currency}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">Milestone</th>
                      <th className="p-2.5">Timeline</th>
                      <th className="p-2.5">Deliverables</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {milestones.map((m, index) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-navy align-top">
                          #{index + 1} {m.title}
                        </td>
                        <td className="p-2.5 text-slate-600 align-top">{m.timeline}</td>
                        <td className="p-2.5 text-slate-600 align-top">{m.deliverables}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-900 text-right align-top whitespace-nowrap">
                          ${Number(m.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legal Clauses */}
            <div className="space-y-3 pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy">3. Terms of Engagement</h3>

              <div className="space-y-2">
                <p>
                  <strong>Acceptance &amp; Verification Window:</strong> Client shall review each deliverable within{" "}
                  <strong>{acceptanceDays} business days</strong> of submission. If Client identifies material deficiencies against scope, Contractor shall revise within scope. If Client submits no notice within {acceptanceDays} business days, deliverable is deemed accepted and payment due.
                </p>
                <p>
                  <strong>Intellectual Property Transfer:</strong> Contractor guarantees deliverables are original work. Upon full settlement of all invoiced milestone amounts, Contractor transfers and assigns 100% of rights, title, copyright, and intellectual property in custom code, designs, and artifacts to Client without restriction.
                </p>
                <p>
                  <strong>Scope &amp; Revisions:</strong> This engagement includes up to{" "}
                  <strong>{revisionRounds} rounds of revisions</strong>. New features or directional changes requested outside the scope defined in Section 1 require a written change order and separate quotation.
                </p>
                <p>
                  <strong>Payment Terms:</strong> Invoices are payable according to: <em>{paymentTerms}</em>.
                </p>
              </div>
            </div>

            {/* Zero-Fee Platform Notice */}
            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/60 text-xs text-teal-950 flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Administered Under Clivora 0% Platform Fee Protocol</p>
                <p className="text-[11px] text-teal-900/80 mt-0.5">
                  Both parties execute this contract directly without middleman markups. On this ${totalContractValue.toLocaleString()} agreement, Contractor and Client save an estimated <strong>${Math.round(upworkSaved).toLocaleString()}</strong> compared to Upwork (10% + 5% client surcharge) and <strong>${Math.round(fiverrSaved).toLocaleString()}</strong> compared to Fiverr (20% + 5.5% buyer surcharge).
                </p>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">Accepted &amp; Agreed (Contractor):</p>
                <div className="border-b border-slate-400 pt-8"></div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-navy">{contractorName}</p>
                  <p className="text-slate-500">{contractorTitle}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Date: ________________________</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">Accepted &amp; Agreed (Client):</p>
                <div className="border-b border-slate-400 pt-8"></div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-navy">{clientName}</p>
                  <p className="text-slate-500">{clientCompany}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Date: ________________________</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Cross Links */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 text-xs text-slate-600 print:hidden flex-wrap">
            <span>Need an invoice for this contract?</span>
            <div className="flex items-center gap-2">
              <Link
                href="/tools/invoice-generator"
                className="font-bold text-teal-800 hover:text-teal-950 underline"
              >
                Instant PDF Invoice Generator →
              </Link>
              <span>·</span>
              <Link
                href="/signup"
                className="font-bold text-slate-900 hover:text-teal-800 underline"
              >
                Open Free Workspace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
