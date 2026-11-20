"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";

const STORAGE_KEY = "clivora_1111_promo_dismissed_2026";

export function PromoBanner1111() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore storage error */
    }
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="11.11 Global Tech Festival Announcement"
      className="relative z-50 bg-[#0B132B] text-white border-b border-teal-500/20 px-4 py-2.5 text-xs sm:text-sm font-medium shadow-inner transition-all duration-300"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex flex-1 items-center justify-center gap-2 text-center sm:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
            <Sparkles className="h-3 w-3 text-teal-300" />
            Engineering &amp; Architecture
          </span>
          <span className="text-slate-200">
            Need custom ERP, web, or mobile systems?
          </span>
          <a
            href="https://usmanghias.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-teal-300 underline-offset-4 hover:text-white hover:underline transition-colors"
          >
            Hire Usman Ghias (Portfolio) ↗
          </a>
          <span className="hidden md:inline text-slate-500">·</span>
          <a
            href="https://www.codcrafters.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-white transition-colors text-xs"
          >
            www.codcrafters.org ↗
          </a>
          <span className="hidden md:inline text-slate-500">·</span>
          <Link
            href="/start-a-project"
            className="inline-flex items-center gap-1 font-bold text-white bg-teal-600/90 hover:bg-teal-500 px-2.5 py-0.5 rounded-full text-xs transition-colors shadow-xs"
          >
            Start Project SOW
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss 11.11 announcement"
          className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
