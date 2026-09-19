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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  });

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
              className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Close early access offer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-teal-50/90 sm:text-base">
            Every user who registers during the next 7 days gets Pro free permanently. Freelancers get unlimited proposals, top placement, and full analytics. Clients get unlimited job posts and contract automation.
          </p>
        </div>

        <div className="-mt-6 px-6 sm:px-8">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg shadow-navy/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Offer expires in</p>
                <div className="mt-2 flex items-center gap-2 text-navy">
                  <Clock className="h-4 w-4 text-primary" />
                  <div className="flex items-center gap-1.5 font-mono text-base font-bold sm:text-lg">
                    {countdown.map(([label, value]) => (
                      <div key={label} className="rounded-md bg-slate-100 px-2 py-0.5 text-center">
                        <span>{String(value).padStart(2, "0")}</span>
                        <span className="block text-[9px] font-sans font-medium text-slate-500">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/signup"
                  onClick={closePopup}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary/25 transition hover:bg-primary/90"
                >
                  <Gift className="h-4 w-4" />
                  <span>Claim free Pro</span>
                </Link>
                <Link
                  href="/contact?topic=bug-bounty"
                  onClick={closePopup}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50"
                >
                  <Bug className="h-4 w-4 text-primary" />
                  <span>Bug bounty details</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 text-center sm:p-8 sm:pt-4">
          <p className="text-xs text-slate-500">
            Found a platform issue or suggestion? Report it directly to earn an extra 3 months free Pro Plus.
          </p>
        </div>
      </section>
    </div>
  );
}
