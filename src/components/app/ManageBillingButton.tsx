"use client";

import { useState } from "react";
import Link from "next/link";
import { BankPayoutSettings } from "@/components/app/BankPayoutSettings";

/** Opens Stripe Customer Portal when configured; also surfaces bank details + policy. */
export function ManageBillingButton({ showBankForm }: { showBankForm?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [openBank, setOpenBank] = useState(!!showBankForm);

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
          "Stripe portal unavailable. Manage bank details below, or use /pro for JazzCash.",
      );
      setOpenBank(true);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not open billing");
      setOpenBank(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={openPortal}
          className="inline-flex rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy disabled:opacity-60"
        >
          {busy ? "Opening…" : "Manage plan (Stripe)"}
        </button>
        <button
          type="button"
          onClick={() => setOpenBank((v) => !v)}
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {openBank ? "Hide bank details" : "Bank & payout details"}
        </button>
        <Link
          href="/pro?plan=pro_plus"
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-navy"
        >
          Plan status
        </Link>
      </div>
      <p className="text-xs text-text-secondary">
        CLIVORA charges <strong>$20/mo</strong> for Pro Plus. Invoice amounts go from client to you
        directly — keep all work on platform.
      </p>
      {msg && <p className="text-xs text-text-secondary">{msg}</p>}
      {openBank && <BankPayoutSettings compact />}
    </div>
  );
}
