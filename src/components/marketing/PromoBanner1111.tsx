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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
            <Sparkles className="h-3 w-3 text-teal-300" />
            11.11 Global Festival
          </span>
          <span className="text-slate-200">
            1-Year Founder Pro Plus ($0 Cost) &amp; Lifetime 0% Platform Fees.
          </span>
          <Link
            href="/promo/11-11"
            className="inline-flex items-center gap-1 font-bold text-teal-300 underline-offset-4 hover:text-white hover:underline transition-colors"
          >
            Claim 11.11 Pass
            <ArrowRight className="h-3.5 w-3.5" />
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
