"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Lock, Smartphone, Sparkles } from "lucide-react";
import { site } from "@/lib/site";

export function AskAi({ isPro = true }: { isPro?: boolean }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedByPlan, setBlockedByPlan] = useState(false);

  async function onAsk(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    if (!isPro) {
      setBlockedByPlan(true);
      setError("Ask AI is included with Pro and Pro Plus.");
      return;
    }
    setBusy(true);
    setAnswer(null);
    setMode(null);
    setError(null);
    setBlockedByPlan(false);
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 403 || json.code === "pro_required") {
          setBlockedByPlan(true);
        }
        setError(json.error ?? "Request failed");
      } else {
        setAnswer(json.answer ?? "No response.");
        setMode(json.mode ?? json.source ?? null);
      }
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  const showAppCta = mode === "app_required" || mode === "provider_error";
  const showCrmBadge =
    mode === "crm_fallback" ||
    mode === "crm_aggregates" ||
    (typeof mode === "string" && mode.includes("crm"));

  if (!isPro || blockedByPlan) {
    return (
      <div className="space-y-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-navy">Ask AI</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">
              Pro feature
            </p>
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          Unlock CRM Q&amp;A about clients, projects, and invoices with Pro or Pro Plus. Free plans
          can browse the hub; Pro adds Ask AI.
        </p>
        {error && <p className="rounded-xl bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/pro?plan=pro"
            className="inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
          >
            Upgrade to Pro
          </Link>
          <Link
            href="/pro?plan=pro_plus"
            className="inline-flex rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-navy"
          >
            See Pro Plus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-navy">Ask AI</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
            Pro feature
          </p>
        </div>
      </div>
      <p className="text-xs text-text-secondary">
        Ask about clients, projects, and invoices. Without a cloud LLM key, we answer from your CRM
        totals.
      </p>
      <form onSubmit={onAsk} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What did I bill last month?"
          className="flex-1 rounded-xl border border-border px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
        />
        <button
          type="submit"
          disabled={busy || !query.trim()}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "…" : "Ask"}
        </button>
      </form>
      {error && <p className="rounded-xl bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
      {answer && (
        <div className="rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
          {showCrmBadge && (
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-primary">
              CRM insight (local aggregates)
            </p>
          )}
          {answer}
        </div>
      )}
      {showAppCta && (
        <a
          href={site.playStoreUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-white"
        >
          <Smartphone className="h-4 w-4" />
          Download Android app for AI
        </a>
      )}
    </div>
  );
}
