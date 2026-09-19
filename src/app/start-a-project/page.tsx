"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles, Send, FileText, Check } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";

export default function StartAProjectPage() {
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    company: "",
    projectType: "Odoo ERP Implementation",
    budget: "$2,000 - $5,000",
    timeline: "2 to 4 weeks",
    scopeDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedSow, setGeneratedSow] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.email || !formData.scopeDescription) {
      setError("Please fill out your name, email, and a brief description of your project.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate proposal");
      }

      setGeneratedSow(data.sow);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Full Unified Navigation */}
      <MarketingNav variant="overlay" />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Technical SOW Generator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Start a Project with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Usman Ghias</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Tell us about your technical requirements. Our system instantly generates a tailored Statement of Work (SOW) and routes your brief directly to our engineering team.
          </p>
        </div>

        {!submitted ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleGenerateSow} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Tech Inc."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Project Domain
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-teal-400 text-sm"
                  >
                    <option value="Odoo ERP Implementation">Odoo 17/18 ERP Implementation & Custom Modules</option>
                    <option value="Full Stack Next.js Web App">Full Stack Next.js & TypeScript Web Application</option>
                    <option value="Flutter Mobile App Development">Cross-Platform Flutter 3.x Mobile App (Android/iOS)</option>
                    <option value="AI Workflows & Autonomous Pipelines">AI Integrations, Agentic Workflows & Gemini API</option>
                    <option value="Cloud Architecture & DevOps">Cloud Infrastructure, Supabase & Docker Automation</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Estimated Budget Scope
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-teal-400 text-sm"
                  >
                    <option value="Under $1,500">Under $1,500 (Small Module / Consultation)</option>
                    <option value="$2,000 - $5,000">$2,000 - $5,000 (Core MVP / Custom ERP Module)</option>
                    <option value="$5,000 - $12,000">$5,000 - $12,000 (Complete Product / Enterprise ERP)</option>
                    <option value="$15,000+">$15,000+ (Long-Term Dedicated Architecture)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Target Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-teal-400 text-sm"
                  >
                    <option value="1 to 2 weeks">1 to 2 weeks (Rapid Sprint)</option>
                    <option value="2 to 4 weeks">2 to 4 weeks (Standard Delivery)</option>
                    <option value="1 to 3 months">1 to 3 months (Comprehensive Scope)</option>
                    <option value="Flexible">Flexible / Ongoing Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Project Brief & Objectives *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.scopeDescription}
                  onChange={(e) => setFormData({ ...formData, scopeDescription: e.target.value })}
                  placeholder="Describe your current bottlenecks, the features you need built, and what success looks like for this engagement..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Scope with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Instant Statement of Work (SOW)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-teal-400" />
              <div>
                <h4 className="font-bold text-sm">Project Brief Received & SOW Drafted!</h4>
                <p className="text-xs text-slate-300">
                  Usman Ghias and the CODCrafters team have received your project details. We typically review and respond within 24 hours.
                </p>
              </div>
            </div>

            <div className="border border-slate-800 rounded-xl bg-slate-950/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Statement of Work (Generated Draft)</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  AI Architecture v1.0
                </span>
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-xs">
                {generatedSow}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                &larr; Submit another inquiry
              </button>

              <div className="flex gap-3">
                <Link
                  href="https://wa.link/8soaqu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  Direct WhatsApp Chat
                </Link>
                <Link
                  href="/"
                  className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  Explore Clivora OS
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>
          &copy; 2026 Clivora & CODCrafters. Operating systems and software engineering by Usman Ghias.
        </p>
      </footer>
    </div>
  );
}
