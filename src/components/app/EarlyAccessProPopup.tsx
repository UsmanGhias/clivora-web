"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Bug, Clock, Gift, ImagePlus, X } from "lucide-react";
import { BUG_REPORT_EMAIL, EARLY_ACCESS_PRO_END_ISO } from "@/lib/early-access";
import { cn } from "@/lib/utils";

const storageKey = "clivora-early-access-popup-dismissed";

function getTimeLeft() {
  const diff = new Date(EARLY_ACCESS_PRO_END_ISO).getTime() - Date.now();
  const safe = Math.max(0, diff);
  const days = Math.floor(safe / 86400000);
  const hours = Math.floor((safe % 86400000) / 3600000);
  const minutes = Math.floor((safe % 3600000) / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  return { days, hours, minutes, seconds, ended: diff <= 0 };
}

export function EarlyAccessProPopup({ isClient }: { isClient: boolean }) {
  const [open, setOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  });
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [imageNames, setImageNames] = useState<string[]>([]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        setOpen(window.localStorage.getItem(storageKey) !== "true");
        setTimeLeft(getTimeLeft());
      }
    } catch {
      setOpen(false);
    }

    const id = window.setInterval(() => {
      try {
        setTimeLeft(getTimeLeft());
      } catch {
        /* ignore */
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  const subject = useMemo(() => `CLIVORA bug report: ${summary || "New portal issue"}`, [summary]);
  const body = useMemo(() => {
    const lines = [
      "Bug summary:",
      summary || "Please describe the bug here.",
      "",
      "Steps or details:",
      details || "Add what happened and what you expected.",
      "",
      `Portal: ${isClient ? "Client" : "Freelancer"}`,
      `Page: ${typeof window === "undefined" ? "" : window.location.href}`,
      `Images selected: ${imageNames.length ? imageNames.join(", ") : "None"}`,
      "",
      "Please attach the selected screenshots or images before sending this email.",
    ];
    return lines.join("\n");
  }, [details, imageNames, isClient, summary]);

  function closePopup() {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, "true");
      }
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  function onImages(e: ChangeEvent<HTMLInputElement>) {
    setImageNames(Array.from(e.target.files ?? []).map((file) => file.name));
  }

  function sendBugReport() {
    const href = `mailto:${BUG_REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (typeof window !== "undefined") {
      window.location.href = href;
    }
  }

  if (!open || timeLeft.ended) return null;

  const countdown = [
    ["Days", timeLeft.days],
    ["Hours", timeLeft.hours],
    ["Mins", timeLeft.minutes],
    ["Secs", timeLeft.seconds],
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
      <section
        aria-labelledby="early-access-title"
        aria-modal="true"
        role="dialog"
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 text-slate-100 shadow-2xl"
      >
        <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 p-6 sm:p-8">
          <button
            type="button"
            onClick={closePopup}
            className="absolute right-4 top-4 rounded-full bg-black/20 p-2 text-white/80 transition hover:bg-black/40 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-200">
            <Gift className="h-3.5 w-3.5" />
            <span>Early Access Reward Active</span>
          </div>
          <h2 id="early-access-title" className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Pro is free permanently for early users
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-teal-100/90 sm:text-base">
            Your account is locked into our free early access window. You have Pro access with zero platform fees on your deals.
          </p>

          <div className="mt-6 rounded-2xl border border-white/15 bg-black/25 p-4 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-teal-200">
                <Clock className="h-4 w-4" />
                <span>Early access window ends in</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                {countdown.map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-black/40 px-2 py-1 text-center">
                    <span>{String(value).padStart(2, "0")}</span>
                    <span className="block text-[9px] font-sans font-medium text-teal-200/75">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Earn an extra 3 months of Pro Plus free</p>
              <p className="text-xs text-slate-400">Found a bug or UI issue? Send us a quick report to extend your tier.</p>
            </div>
            <button
              type="button"
              onClick={() => setBugOpen((v) => !v)}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
                bugOpen
                  ? "border-teal-400/40 bg-teal-500/10 text-teal-300"
                  : "border-white/15 bg-white/5 text-white hover:bg-white/10",
              )}
            >
              <Bug className="h-4 w-4 text-teal-400" />
              <span>{bugOpen ? "Hide bug form" : "Report a bug"}</span>
            </button>
          </div>

          {bugOpen && (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Brief summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. Invoice download button does not open on Firefox"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Details</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="What happened and what did you expect?"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 hover:border-teal-400/50">
                  <ImagePlus className="h-4 w-4 text-teal-400" />
                  <span>Choose screenshots (optional)</span>
                  <input type="file" multiple accept="image/*" onChange={onImages} className="hidden" />
                </label>
                {imageNames.length > 0 && (
                  <p className="mt-1.5 text-[11px] text-teal-300">
                    Selected {imageNames.length} image{imageNames.length > 1 ? "s" : ""}: {imageNames.join(", ")}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={sendBugReport}
                  className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-teal-400"
                >
                  Create Email Report
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={closePopup}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Continue to workspace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
