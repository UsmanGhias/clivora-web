"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bug, Clock, Gift, X } from "lucide-react";
import { EARLY_ACCESS_PRO_END_ISO } from "@/lib/early-access";

const storageKey = "clivora-marketing-early-access-popup-dismissed";

function getTimeLeft() {
  const diff = new Date(EARLY_ACCESS_PRO_END_ISO).getTime() - Date.now();
  const safe = Math.max(0, diff);
  const days = Math.floor(safe / 86400000);
  const hours = Math.floor((safe % 86400000) / 3600000);
  const minutes = Math.floor((safe % 3600000) / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  return { days, hours, minutes, seconds, ended: diff <= 0 };
}

export function EarlyAccessRewardPopup() {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    setOpen(window.localStorage.getItem(storageKey) !== "true");
    const id = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(id);
  }, []);

  function closePopup() {
    window.localStorage.setItem(storageKey, "true");
    setOpen(false);
  }

  if (!open || timeLeft.ended) return null;

  const countdown = [
    ["Days", timeLeft.days],
    ["Hours", timeLeft.hours],
    ["Mins", timeLeft.minutes],
    ["Secs", timeLeft.seconds],
  ] as const;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/40 p-4 backdrop-blur-md sm:items-center">
      <section
        aria-labelledby="early-access-reward-title"
        aria-modal="true"
        role="dialog"
        className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-navy/25"
      >
        <div className="relative bg-primary px-6 pb-12 pt-8 text-white sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_12%,rgba(255,255,255,0.14),transparent_26%)]" />
          <div className="relative flex items-start justify-between gap-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.26em] text-teal-100">Early access reward</p>
              <h2 id="early-access-reward-title" className="mt-4 max-w-2xl font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Register in the next 7 days and get Pro free
              </h2>
            </div>
            <button
              type="button"
              onClick={closePopup}
              className="shrink-0 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"
              aria-label="Close early access reward popup"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative mt-10 grid grid-cols-4 gap-3 text-center sm:gap-6">
            {countdown.map(([label, value]) => (
              <div key={label}>
                <p className="font-display text-3xl font-black tabular-nums sm:text-4xl">{String(value).padStart(2, "0")}</p>
                <p className="mt-1 text-xs font-extrabold uppercase text-teal-100 sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 px-6 py-7 sm:px-8">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 sm:p-6">
            <p className="text-lg font-black">You will receive the Pro account, not Pro Plus.</p>
            <p className="mt-2 text-base leading-relaxed text-emerald-900">
              The free Pro reward applies to users who register before the countdown ends and to people who help report bugs during early access.
            </p>
          </div>

          <Link
            href="/signup"
            onClick={closePopup}
            className="flex w-full items-center justify-center gap-3 rounded-3xl bg-primary px-5 py-4 text-center text-base font-black text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Gift className="h-5 w-5" />
            Claim free Pro access now
          </Link>

          <Link
            href="/contact"
            onClick={closePopup}
            className="flex w-full items-center justify-center gap-3 rounded-3xl border border-teal-200 bg-teal-50 px-5 py-4 text-center text-base font-black text-primary transition hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Bug className="h-5 w-5" />
            Report a bug and claim Pro review
          </Link>

          <p className="flex items-start gap-2 text-sm font-semibold leading-relaxed text-slate-500">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            Pro access is prepared for when early access ends and CLIVORA is active.
          </p>
        </div>
      </section>
    </div>
  );
}
