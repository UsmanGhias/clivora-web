"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  FileText,
  Receipt,
  Activity,
  Copy,
  Check,
  Share2,
  Download,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  BookmarkPlus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratedInvoiceItem {
  description: string;
  rate: number;
  quantity: number;
  amount: number;
  category: string;
}

interface HealthMetrics {
  monthlyRevenue: number;
  overdueCount: number;
  overdueTotal: number;
  activeProjects: number;
  completedProjects: number;
  currency: string;
}

export function ClivoraAiWorkspace({
  initialTab = "proposals",
  onClose,
  embeddedInModal = false,
}: {
  initialTab?: "proposals" | "invoices" | "health";
  onClose?: () => void;
  embeddedInModal?: boolean;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"proposals" | "invoices" | "health">(initialTab);
  const [isPending, startTransition] = useTransition();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Proposal State
  const [clientName, setClientName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [budget, setBudget] = useState("2500");
  const [currency, setCurrency] = useState("USD");
  const [timeline, setTimeline] = useState("2 to 3 weeks");
  const [scopeDetails, setScopeDetails] = useState("");
  const [clientWhatsapp, setClientWhatsapp] = useState("");
  const [freelancerName, setFreelancerName] = useState("");
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [proposalSaved, setProposalSaved] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const [proposalViewRaw, setProposalViewRaw] = useState(false);

  // Invoice Items State
  const [invoiceScope, setInvoiceScope] = useState("");
  const [invoiceBudget, setInvoiceBudget] = useState("2000");
  const [invoiceCurrency, setInvoiceCurrency] = useState("USD");
  const [invoiceItems, setInvoiceItems] = useState<GeneratedInvoiceItem[]>([]);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  // Business Health State
  const [healthBriefing, setHealthBriefing] = useState<string | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // WhatsApp Share helper
  const handleShareWhatsApp = (text: string, targetPhone?: string) => {
    const cleanPhone = (targetPhone || "").replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(text);
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Generate Proposal
  const handleGenerateProposal = () => {
    if (!clientName.trim() || !projectTitle.trim() || !scopeDetails.trim()) {
      setProposalError("Please fill in client name, project title, and scope requirements.");
      return;
    }
    setProposalError(null);
    setProposalSaved(false);

    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "proposal",
            clientName: clientName.trim(),
            projectTitle: projectTitle.trim(),
            budget: Number(budget) || 1500,
            currency,
            timeline: timeline.trim(),
            scopeDetails: scopeDetails.trim(),
            freelancerName: freelancerName.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to generate proposal");
        }
        setGeneratedProposal(data.proposal);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error generating proposal";
        setProposalError(msg);
      }
    });
  };

  // Save Proposal to CRM Notes
  const handleSaveToNotes = async () => {
    if (!generatedProposal) return;
    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_proposal",
          title: `Proposal: ${projectTitle || "New Project"}`,
          content: generatedProposal,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save proposal note");
      }
      setProposalSaved(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save to CRM notes";
      setProposalError(msg);
    }
  };

  // Download Markdown file
  const handleDownloadProposal = () => {
    if (!generatedProposal) return;
    const blob = new Blob([generatedProposal], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `Proposal_${(projectTitle || "CLIVORA").replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Invoice Line Items
  const handleGenerateInvoiceItems = () => {
    if (!invoiceScope.trim()) {
      setInvoiceError("Please provide a project description or scope breakdown.");
      return;
    }
    setInvoiceError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "invoice_items",
            projectScope: invoiceScope.trim(),
            targetBudget: Number(invoiceBudget) || 1000,
            currency: invoiceCurrency,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to generate invoice items");
        }
        setInvoiceItems(data.items || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error generating invoice line items";
        setInvoiceError(msg);
      }
    });
  };

  // Import into Invoice CRM
  const handleOpenInInvoices = () => {
    if (invoiceItems.length === 0) return;
    const total = invoiceItems.reduce((acc, curr) => acc + curr.amount, 0);
    const draft = {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      clientName: clientName || "Client",
      total,
      currency: invoiceCurrency,
      items: invoiceItems,
    };
    try {
      localStorage.setItem("clivora_draft_invoice", JSON.stringify(draft));
    } catch {
      // ignore
    }
    if (onClose) onClose();
    router.push("/app/invoices");
  };

  // WhatsApp text formatting for Invoice Items
  const getInvoiceWhatsAppText = () => {
    const lines = [
      `Invoice Estimate breakdown for ${clientName || "Project"}`,
      `Total: ${invoiceCurrency} ${invoiceItems.reduce((a, c) => a + c.amount, 0).toFixed(2)}`,
      "",
      ...invoiceItems.map(
        (it) => `• ${it.description} (${it.category}): ${it.quantity}x @ ${invoiceCurrency} ${it.rate.toFixed(2)} = ${invoiceCurrency} ${it.amount.toFixed(2)}`
      ),
      "",
      "Created with CLIVORA Freelancer OS ($0 Platform Fee).",
    ];
    return lines.join("\n");
  };

  // Generate Business Health Briefing
  const handleGenerateHealthBriefing = () => {
    setHealthError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "health_briefing",
            currency,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to generate health advisory");
        }
        setHealthBriefing(data.briefing);
        setHealthMetrics(data.metrics);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error generating health advisory";
        setHealthError(msg);
      }
    });
  };

  return (
    <div className={cn("flex flex-col bg-surface text-navy", embeddedInModal ? "h-full" : "rounded-3xl border border-border p-6 shadow-sm")}>
      {/* Top Header / Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-extrabold text-navy">CLIVORA AI Assistant</h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Draft commercial proposals, build invoice line items, and generate real-time business health advisory.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center rounded-2xl bg-background p-1 border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("proposals")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition",
              activeTab === "proposals"
                ? "bg-white text-navy shadow-sm border border-border/40"
                : "text-text-muted hover:text-navy"
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            Proposals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition",
              activeTab === "invoices"
                ? "bg-white text-navy shadow-sm border border-border/40"
                : "text-text-muted hover:text-navy"
            )}
          >
            <Receipt className="h-3.5 w-3.5" />
            Invoices
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("health")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition",
              activeTab === "health"
                ? "bg-white text-navy shadow-sm border border-border/40"
                : "text-text-muted hover:text-navy"
            )}
          >
            <Activity className="h-3.5 w-3.5" />
            Health
          </button>
        </div>
      </div>

      {/* Tab 1: Proposals */}
      {activeTab === "proposals" && (
        <div className="grid gap-6 pt-5 lg:grid-cols-12">
          {/* Inputs Column */}
          <div className="space-y-4 lg:col-span-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                Client or Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corporation or Sarah Jenkins"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                Project Title
              </label>
              <input
                type="text"
                placeholder="e.g. Mobile App API & Verification"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                  Total Budget
                </label>
                <div className="mt-1.5 flex rounded-xl border border-border bg-background focus-within:border-primary">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="rounded-l-xl bg-transparent px-2.5 py-2.5 text-xs font-bold text-navy border-r border-border focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED</option>
                    <option value="SAR">SAR</option>
                    <option value="CAD">CAD</option>
                    <option value="PKR">PKR</option>
                  </select>
                  <input
                    type="number"
                    placeholder="2500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-navy placeholder:text-text-muted focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                  Timeline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 to 3 weeks"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                Scope & Requirements
              </label>
              <textarea
                rows={4}
                placeholder="Outline deliverables, technical stack, key milestones, and acceptance criteria..."
                value={scopeDetails}
                onChange={(e) => setScopeDetails(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                  Client WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+447123456789"
                  value={clientWhatsapp}
                  onChange={(e) => setClientWhatsapp(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                  Freelancer / Lead Name
                </label>
                <input
                  type="text"
                  placeholder="Usman Ghias"
                  value={freelancerName}
                  onChange={(e) => setFreelancerName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {proposalError && (
              <div className="flex items-center gap-2 rounded-xl bg-error/10 p-3 text-xs text-error">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{proposalError}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isPending}
              onClick={handleGenerateProposal}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Proposal
                </>
              )}
            </button>
          </div>

          {/* Proposal Output & Actions */}
          <div className="flex flex-col rounded-2xl border border-border bg-background/50 p-4 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Proposal Output
              </span>
              {generatedProposal && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProposalViewRaw(!proposalViewRaw)}
                    className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-text-secondary hover:bg-border/40"
                  >
                    {proposalViewRaw ? "Rendered View" : "Markdown Source"}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 min-h-[360px] flex-1 overflow-y-auto rounded-xl bg-white p-4 text-sm text-navy border border-border/60">
              {generatedProposal ? (
                proposalViewRaw ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800">
                    {generatedProposal}
                  </pre>
                ) : (
                  <div className="prose prose-sm max-w-none text-navy">
                    {generatedProposal.split("\n").map((line, idx) => {
                      if (line.startsWith("# ")) {
                        return (
                          <h1 key={idx} className="mt-2 text-lg font-extrabold text-navy">
                            {line.replace("# ", "")}
                          </h1>
                        );
                      }
                      if (line.startsWith("## ")) {
                        return (
                          <h2 key={idx} className="mt-3 text-sm font-bold uppercase tracking-wide text-primary border-b border-border/50 pb-1">
                            {line.replace("## ", "")}
                          </h2>
                        );
                      }
                      if (line.startsWith("- ")) {
                        return (
                          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 leading-relaxed">
                            {line.replace("- ", "")}
                          </li>
                        );
                      }
                      if (!line.trim()) {
                        return <div key={idx} className="h-2" />;
                      }
                      return (
                        <p key={idx} className="text-xs text-slate-700 leading-relaxed">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-text-muted">
                  <FileText className="h-10 w-10 text-border" />
                  <p className="mt-2 text-xs font-medium">
                    Configure your project parameters on the left and click &quot;Generate Proposal&quot; to produce a professional statement of work.
                  </p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            {generatedProposal && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedProposal, "proposal")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-navy hover:bg-slate-50 shadow-sm"
                  >
                    {copiedKey === "proposal" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === "proposal" ? "Copied!" : "Copy Markdown"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(generatedProposal, clientWhatsapp)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#20ba59] shadow-sm transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Share via WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadProposal}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-navy hover:bg-slate-50 shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Save .md
                  </button>
                </div>

                <button
                  type="button"
                  disabled={proposalSaved}
                  onClick={handleSaveToNotes}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition disabled:opacity-60"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  {proposalSaved ? "Saved to CRM Notes" : "Save to Notes"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Invoices */}
      {activeTab === "invoices" && (
        <div className="grid gap-6 pt-5 lg:grid-cols-12">
          {/* Inputs Column */}
          <div className="space-y-4 lg:col-span-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                Project Scope or Milestones Description
              </label>
              <textarea
                rows={5}
                placeholder="Paste the statement of work, task list, or delivery requirements to break into line items..."
                value={invoiceScope}
                onChange={(e) => setInvoiceScope(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                  Target Budget
                </label>
                <div className="mt-1.5 flex rounded-xl border border-border bg-background focus-within:border-primary">
                  <select
                    value={invoiceCurrency}
                    onChange={(e) => setInvoiceCurrency(e.target.value)}
                    className="rounded-l-xl bg-transparent px-2.5 py-2.5 text-xs font-bold text-navy border-r border-border focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED</option>
                    <option value="SAR">SAR</option>
                    <option value="CAD">CAD</option>
                    <option value="PKR">PKR</option>
                  </select>
                  <input
                    type="number"
                    placeholder="2000"
                    value={invoiceBudget}
                    onChange={(e) => setInvoiceBudget(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-navy placeholder:text-text-muted focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                  Client Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {invoiceError && (
              <div className="flex items-center gap-2 rounded-xl bg-error/10 p-3 text-xs text-error">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{invoiceError}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isPending}
              onClick={handleGenerateInvoiceItems}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Calculating Line Items...
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4" />
                  Generate Line Items
                </>
              )}
            </button>
          </div>

          {/* Invoice Items Table & Actions */}
          <div className="flex flex-col rounded-2xl border border-border bg-background/50 p-4 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Generated Line Items
              </span>
              {invoiceItems.length > 0 && (
                <span className="text-xs font-extrabold text-navy">
                  Total: {invoiceCurrency} {invoiceItems.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                </span>
              )}
            </div>

            <div className="mt-3 min-h-[360px] flex-1 overflow-y-auto rounded-xl bg-white p-3 text-sm text-navy border border-border/60">
              {invoiceItems.length > 0 ? (
                <div className="space-y-2.5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                          <th className="pb-2">Description</th>
                          <th className="pb-2">Category</th>
                          <th className="pb-2 text-right">Qty</th>
                          <th className="pb-2 text-right">Rate</th>
                          <th className="pb-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {invoiceItems.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50/80">
                            <td className="py-2.5 font-medium text-navy pr-2">{item.description}</td>
                            <td className="py-2.5">
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-2.5 text-right font-mono">{item.quantity}</td>
                            <td className="py-2.5 text-right font-mono">
                              {invoiceCurrency} {item.rate.toFixed(2)}
                            </td>
                            <td className="py-2.5 text-right font-mono font-bold text-navy">
                              {invoiceCurrency} {item.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-right">
                    <span className="text-xs text-text-secondary mr-2">Grand Total:</span>
                    <span className="font-mono text-base font-extrabold text-primary">
                      {invoiceCurrency} {invoiceItems.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-text-muted">
                  <Receipt className="h-10 w-10 text-border" />
                  <p className="mt-2 text-xs font-medium">
                    Provide your project scope and budget to let Gemini parse it into structured invoice line items.
                  </p>
                </div>
              )}
            </div>

            {/* Invoice Action Bar */}
            {invoiceItems.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(getInvoiceWhatsAppText(), "invoice_text")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-navy hover:bg-slate-50 shadow-sm"
                  >
                    {copiedKey === "invoice_text" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === "invoice_text" ? "Copied!" : "Copy Summary"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(getInvoiceWhatsAppText(), clientWhatsapp)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#20ba59] shadow-sm transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Share via WhatsApp
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleOpenInInvoices}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-sm transition"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  Open in Invoices
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Business Health */}
      {activeTab === "health" && (
        <div className="space-y-6 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-navy via-slate-900 to-navy p-5 text-white">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70">Executive Advisory Engine</p>
              <h3 className="mt-1 font-display text-lg font-extrabold text-white">
                Live Business Performance Diagnostic
              </h3>
              <p className="mt-1 max-w-xl text-xs text-white/75">
                Evaluates your rolling 30-day billings, overdue accounts receivable, and active delivery pipelines to produce sharp executive action items.
              </p>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={handleGenerateHealthBriefing}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white hover:bg-primary-dark shadow-md transition disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing CRM...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" />
                  Generate Weekly Advisory
                </>
              )}
            </button>
          </div>

          {healthError && (
            <div className="flex items-center gap-2 rounded-xl bg-error/10 p-3 text-xs text-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{healthError}</span>
            </div>
          )}

          {/* Metrics Overview Cards */}
          {healthMetrics && (
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">30d Revenue</p>
                <p className="mt-1 font-mono text-xl font-extrabold text-navy">
                  {healthMetrics.currency} {healthMetrics.monthlyRevenue.toFixed(0)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Overdue Invoices</p>
                <p className="mt-1 font-mono text-xl font-extrabold text-error">
                  {healthMetrics.overdueCount} ({healthMetrics.currency} {healthMetrics.overdueTotal.toFixed(0)})
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Active Projects</p>
                <p className="mt-1 font-mono text-xl font-extrabold text-primary">
                  {healthMetrics.activeProjects}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Completed Projects</p>
                <p className="mt-1 font-mono text-xl font-extrabold text-success">
                  {healthMetrics.completedProjects}
                </p>
              </div>
            </div>
          )}

          {/* Health Briefing Card */}
          {healthBriefing ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="h-4 w-4" />
                  Executive Strategic Advisory
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(healthBriefing, "briefing")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-navy hover:bg-slate-50"
                  >
                    {copiedKey === "briefing" ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === "briefing" ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(healthBriefing)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#20ba59]"
                  >
                    <MessageCircle className="h-3 w-3" />
                    Share WhatsApp
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-navy leading-relaxed">
                {healthBriefing.split("\n").filter(Boolean).map((bullet, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <p className="text-xs text-slate-800">{bullet.replace(/^[-•*]\s*/, "")}</p>
                  </div>
                ))}
              </div>

              {/* Direct Founder WhatsApp Link */}
              <div className="mt-5 flex items-center justify-between border-t border-primary/10 pt-3">
                <span className="text-[11px] text-text-secondary">
                  Need custom enterprise implementation or architectural review?
                </span>
                <a
                  href="https://wa.link/8soaqu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                  Chat directly with Usman on WhatsApp →
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center text-text-muted">
              <Activity className="mx-auto h-10 w-10 text-border" />
              <p className="mt-2 text-xs font-medium">
                Click &quot;Generate Weekly Advisory&quot; to analyze your business velocity and receive actionable execution directives.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
