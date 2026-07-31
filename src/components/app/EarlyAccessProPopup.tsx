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
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [imageNames, setImageNames] = useState<string[]>([]);

  useEffect(() => {
    setOpen(window.localStorage.getItem(storageKey) !== "true");
    const id = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
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
    window.localStorage.setItem(storageKey, "true");
    setOpen(false);
  }

  function onImages(e: ChangeEvent<HTMLInputElement>) {
    setImageNames(Array.from(e.target.files ?? []).map((file) => file.name));
  }

  function sendBugReport() {
    const href = `mailto:${BUG_REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  if (timeLeft.ended) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "fixed bottom-20 right-4 z-50 rounded-full px-4 py-3 text-sm font-bold text-white shadow-2xl lg:bottom-6",
            isClient ? "bg-navy" : "bg-primary",
          )}
        >
          <span className="flex items-center gap-2"><Gift className="h-4 w-4" /> Early Pro</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-4 backdrop-blur-sm sm:items-center">
          <section className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className={cn("p-5 text-white", isClient ? "bg-navy" : "bg-primary")}> 
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Early access reward</p>
                  <h2 className="mt-2 font-display text-2xl font-black">Register in the next 7 days and get Pro free</h2>
                </div>
                <button type="button" onClick={closePopup} className="rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Close early access popup">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                {[
                  ["Days", timeLeft.days],
                  ["Hours", timeLeft.hours],
                  ["Mins", timeLeft.minutes],
                  ["Secs", timeLeft.seconds],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/12 p-3">
                    <p className="text-2xl font-black tabular-nums">{String(value).padStart(2, "0")}</p>
                    <p className="text-[10px] font-bold uppercase text-white/65">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-extrabold">You will receive the Pro account, not Pro Plus.</p>
                <p className="mt-1">The free Pro reward applies to users who register before the countdown ends and to people who help report bugs during early access.</p>
              </div>
              <button
                type="button"
                onClick={() => setBugOpen(true)}
                className={cn("flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-white", isClient ? "bg-navy" : "bg-primary")}
              >
                <Bug className="h-4 w-4" /> Report a bug and claim Pro review
              </button>
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Clock className="h-4 w-4" /> Pro access is prepared for when early access ends and CLIVORA is active.</p>
            </div>
          </section>
        </div>
      )}

      {bugOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/50 p-4 backdrop-blur-sm sm:items-center">
          <section className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Bug report</p>
                <h3 className="mt-1 font-display text-2xl font-black text-navy">Send a bug to CLIVORA</h3>
              </div>
              <button type="button" onClick={() => setBugOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close bug report">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-bold text-navy">Bug summary
                <input value={summary} onChange={(e) => setSummary(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none focus:border-primary focus:bg-white" placeholder="Example: Invoice button does not save" />
              </label>
              <label className="block text-sm font-bold text-navy">Details
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={5} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none focus:border-primary focus:bg-white" placeholder="Tell me what happened, the steps, and the expected result." />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold text-navy">
                <span className="flex items-center gap-2"><ImagePlus className="h-5 w-5 text-primary" /> Add screenshots or images</span>
                <input type="file" accept="image/*" multiple onChange={onImages} className="hidden" />
              </label>
              {imageNames.length > 0 && <p className="text-xs font-semibold text-slate-500">Selected: {imageNames.join(", ")}</p>}
              <button type="button" onClick={sendBugReport} className={cn("w-full rounded-2xl px-4 py-3 text-sm font-black text-white", isClient ? "bg-navy" : "bg-primary")}>Open email to {BUG_REPORT_EMAIL}</button>
              <p className="text-xs text-slate-500">Your email app will open with the report filled in. Attach the selected images before sending.</p>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
