"use client";

import { useState } from "react";

/** Opens Stripe Customer Portal when configured; otherwise shows low-cost alternatives. */
export function ManageBillingButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function openPortal() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = (await res.json()) as {
        url?: string;
        error?: string;
        hint?: string;
      };
      if (json.url) {
        window.location.href = json.url;
        return;
      }
      setMsg(
        json.hint ||
          json.error ||
          "Stripe portal unavailable. Use Google Play on Android or /pro for JazzCash.",
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not open billing");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={busy}
        onClick={openPortal}
        className="inline-flex rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy disabled:opacity-60"
      >
        {busy ? "Opening…" : "Manage billing (Stripe)"}
      </button>
      {msg && <p className="text-xs text-text-secondary">{msg}</p>}
    </div>
  );
}
