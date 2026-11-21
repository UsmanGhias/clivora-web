"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Copy,
  Check,
  Code2,
  Sparkles,
  ExternalLink,
  Laptop,
  Github,
  Globe,
  Share2,
} from "lucide-react";

export function BadgeGeneratorClient() {
  const [name, setName] = useState("Alex Vance");
  const [role, setRole] = useState("Senior Full-Stack Engineer");
  const [rate, setRate] = useState("$85/hr");
  const [status, setStatus] = useState("Available for Projects");
  const [targetUrl, setTargetUrl] = useState("https://clivora.io/connect?tab=talent");

  const [copiedType, setCopiedType] = useState<string | null>(null);

  const cleanName = name.trim() || "Freelancer";
  const cleanRole = role.trim() || "Independent Contractor";

  // Code snippets
  const githubMarkdown = `[![Hire on Clivora (0% Fee)](https://img.shields.io/badge/Hire%20via%20Clivora-0%25%20Platform%20Fee-0D9488?style=for-the-badge&logo=shield&logoColor=white)](${targetUrl})`;

  const githubCardMarkdown = `### 🤝 Work with Me Directly
> **${cleanName}** · *${cleanRole}*  
> 🟢 **Status:** ${status} (${rate})  
> 🛡️ **Zero Middleman Markup:** Hire and invoice directly through Clivora with **0% platform commissions**.  
> 👉 [**Start a Project on Clivora**](${targetUrl})`;

  const htmlSnippet = `<div style="display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:12px;background:#0F172A;color:#FFFFFF;font-family:system-ui,-apple-system,sans-serif;font-size:13px;text-decoration:none;border:1px solid #1E293B;">
  <span style="height:8px;width:8px;border-radius:50%;background:#10B981;display:inline-block;"></span>
  <span><strong>${cleanName}</strong> · ${cleanRole}</span>
  <span style="color:#2DD4BF;font-weight:700;">$0 Fee on Clivora</span>
  <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" style="color:#FFFFFF;background:#0D9488;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none;margin-left:4px;">Hire Directly ↗</a>
</div>`;

  const bioSnippet = `Available for freelance & consulting contracts via Clivora with $0 platform markup for both of us: ${targetUrl}`;

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Value Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 via-white to-teal-50 p-5 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
              Viral Client Acquisition Funnel
            </span>
            <span className="text-xs text-slate-500 font-mono">Embed Anywhere</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Embed verified zero-fee badges on your GitHub README, portfolio, or blog. Clients hire you directly without Upwork&apos;s 10% or Fiverr&apos;s 20% commission traps.
          </p>
        </div>

        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 transition shadow-xs shrink-0 w-full sm:w-auto"
        >
          <span>Claim Your Profile</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Customize Your Badge
            </h4>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Your Full Name or Studio</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  placeholder="e.g. Alex Vance"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Professional Headline / Stack</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  placeholder="e.g. Senior Full-Stack Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Rate or Engagement</label>
                  <input
                    type="text"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden font-mono"
                    placeholder="e.g. $85/hr or Retainer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Availability Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="Available for Projects">Available for Projects</option>
                    <option value="Booking for Next Month">Booking for Next Month</option>
                    <option value="Open to Consulting">Open to Consulting</option>
                    <option value="Available for Retainers">Available for Retainers</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Destination Link</label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden font-mono text-slate-600"
                  placeholder="https://clivora.io/connect"
                />
                <p className="text-[10px] text-slate-400">
                  Where clients go when they click your badge (Clivora Connect profile or SOW generator).
                </p>
              </div>
            </div>
          </div>

          {/* Social Bio Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-navy flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-teal-700" />
                LinkedIn &amp; Twitter / X Bio Text
              </span>
              <button
                type="button"
                onClick={() => handleCopy(bioSnippet, "bio")}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                {copiedType === "bio" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                {copiedType === "bio" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 break-words">
              {bioSnippet}
            </div>
          </div>
        </div>

        {/* Right Column: Live Badge Previews & One-Click Copy */}
        <div className="lg:col-span-7 space-y-6">
          {/* Style 1: GitHub Markdown Shields Badge */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-slate-800" />
                <h4 className="text-sm font-bold text-navy">1. GitHub README Shields Badge</h4>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(githubMarkdown, "shields")}
                className="inline-flex items-center gap-1 rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs font-bold text-teal-800 hover:bg-teal-100 transition"
              >
                {copiedType === "shields" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedType === "shields" ? "Copied Markdown!" : "Copy Markdown"}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/badge/Hire%20via%20Clivora-0%25%20Platform%20Fee-0D9488?style=for-the-badge&logo=shield&logoColor=white"
                alt="Hire on Clivora"
                className="shadow-sm rounded"
              />
            </div>

            <pre className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 overflow-x-auto">
              {githubMarkdown}
            </pre>
          </div>

          {/* Style 2: GitHub Profile Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-slate-800" />
                <h4 className="text-sm font-bold text-navy">2. GitHub README Profile Callout</h4>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(githubCardMarkdown, "github-card")}
                className="inline-flex items-center gap-1 rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs font-bold text-teal-800 hover:bg-teal-100 transition"
              >
                {copiedType === "github-card" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedType === "github-card" ? "Copied Snippet!" : "Copy Snippet"}
              </button>
            </div>

            {/* Visual Preview */}
            <div className="p-4 rounded-xl border-l-4 border-teal-600 bg-slate-50 text-xs text-slate-700 space-y-1.5">
              <p className="font-bold text-navy text-sm">🤝 Work with Me Directly</p>
              <p>
                <strong>{cleanName}</strong> · <em>{cleanRole}</em>
              </p>
              <p className="text-slate-600">
                🟢 <strong>Status:</strong> {status} ({rate})
              </p>
              <p className="text-slate-500">
                🛡️ <strong>Zero Middleman Markup:</strong> Hire and invoice directly through Clivora with <strong>0% platform commissions</strong>.
              </p>
              <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-teal-800 underline block pt-1">
                Start a Project on Clivora →
              </a>
            </div>

            <pre className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap">
              {githubCardMarkdown}
            </pre>
          </div>

          {/* Style 3: Website HTML / Dark Pill */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-800" />
                <h4 className="text-sm font-bold text-navy">3. Website HTML Pill (Next.js / Webflow / WP)</h4>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(htmlSnippet, "html")}
                className="inline-flex items-center gap-1 rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs font-bold text-teal-800 hover:bg-teal-100 transition"
              >
                {copiedType === "html" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedType === "html" ? "Copied HTML!" : "Copy HTML"}
              </button>
            </div>

            {/* Visual Preview */}
            <div className="p-6 rounded-xl bg-slate-950 flex items-center justify-center">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span><strong>{cleanName}</strong> · {cleanRole}</span>
                <span className="text-teal-300 font-bold">$0 Fee on Clivora</span>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 rounded-lg bg-teal-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-teal-500"
                >
                  Hire Directly ↗
                </a>
              </div>
            </div>

            <pre className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 overflow-x-auto">
              {htmlSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
