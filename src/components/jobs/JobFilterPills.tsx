"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, Zap, Sparkles, DollarSign, X, Check } from "lucide-react";

interface TechPill {
  id: string;
  label: string;
  tag: string;
}

const TECH_PILLS: TechPill[] = [
  { id: "all", label: "All Stacks", tag: "all" },
  { id: "nextjs", label: "Next.js", tag: "nextjs" },
  { id: "react", label: "React", tag: "react" },
  { id: "flutter", label: "Flutter", tag: "flutter" },
  { id: "python", label: "Python", tag: "python" },
  { id: "odoo", label: "Odoo ERP", tag: "odoo" },
  { id: "golang", label: "Go", tag: "golang" },
  { id: "postgres", label: "PostgreSQL", tag: "postgres" },
  { id: "ai", label: "AI & LLM", tag: "ai" },
  { id: "devops", label: "DevOps", tag: "devops" },
  { id: "mobile", label: "Mobile iOS/Android", tag: "mobile" },
];

export function JobFilterPills() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTech = (searchParams.get("tech") || "all").toLowerCase();
  const currentType = (searchParams.get("type") || "all").toLowerCase();
  const currentRemote = searchParams.get("remote") === "true";
  const currentFresh = searchParams.get("fresh") === "true";
  const currentHighPay = searchParams.get("high_pay") === "true";

  const hasActiveFilters =
    currentTech !== "all" ||
    currentType !== "all" ||
    currentRemote ||
    currentFresh ||
    currentHighPay ||
    Boolean(searchParams.get("q")) ||
    (searchParams.get("category") || "all") !== "all" ||
    (searchParams.get("lang") || "all") !== "all";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // Reset pagination

    if (!value || value === "all" || value === "false") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : "/jobs");
  };

  const resetAllFilters = () => {
    router.push("/jobs");
  };

  return (
    <div className="space-y-3">
      {/* Scrollable Tech Stack Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {TECH_PILLS.map((pill) => {
          const isSelected = currentTech === pill.tag;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => updateParam("tech", isSelected && pill.tag !== "all" ? "all" : pill.tag)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-teal-700 text-white shadow-xs ring-2 ring-teal-700/20"
                  : "border border-slate-200/90 bg-white text-slate-700 hover:border-teal-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isSelected && pill.tag !== "all" && <Check className="h-3 w-3 stroke-[3]" />}
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* FreeHire-Inspired Quick Toggles Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Remote Toggle */}
          <button
            type="button"
            onClick={() => updateParam("remote", currentRemote ? "false" : "true")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              currentRemote
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Globe className={`h-3.5 w-3.5 ${currentRemote ? "text-emerald-600" : "text-slate-400"}`} />
            Remote Only
          </button>

          {/* Contract / Freelance Toggle */}
          <button
            type="button"
            onClick={() => updateParam("type", currentType === "contract" ? "all" : "contract")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              currentType === "contract"
                ? "bg-teal-50 text-teal-800 border border-teal-300 font-semibold"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${currentType === "contract" ? "text-teal-600" : "text-slate-400"}`} />
            Contracts ($0 Fee)
          </button>

          {/* Verified Fresh (< 7 days) */}
          <button
            type="button"
            onClick={() => updateParam("fresh", currentFresh ? "false" : "true")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              currentFresh
                ? "bg-amber-50 text-amber-800 border border-amber-300 font-semibold"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full ${currentFresh ? "animate-ping bg-emerald-400 opacity-75" : "bg-slate-300"}`}></span>
              <span className={`relative inline-flex h-2 w-2 rounded-full ${currentFresh ? "bg-emerald-500" : "bg-slate-400"}`}></span>
            </span>
            <Zap className={`h-3.5 w-3.5 ${currentFresh ? "text-amber-600" : "text-slate-400"}`} />
            Verified Fresh
          </button>

          {/* High Pay ($100k+) */}
          <button
            type="button"
            onClick={() => updateParam("high_pay", currentHighPay ? "false" : "true")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              currentHighPay
                ? "bg-indigo-50 text-indigo-800 border border-indigo-300 font-semibold"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <DollarSign className={`h-3.5 w-3.5 ${currentHighPay ? "text-indigo-600" : "text-slate-400"}`} />
            $100k+ / High Pay
          </button>
        </div>

        {/* Reset Filters Link */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
