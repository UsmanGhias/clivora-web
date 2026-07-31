"use client";

import { useState } from "react";
import Link from "next/link";
import { BankPayoutSettings } from "@/components/app/BankPayoutSettings";
import { PRO_PLUS_PRICE_USD } from "@/lib/pricing";

/** Links to plan management and surfaces bank details + policy. */
export function ManageBillingButton({ showBankForm }: { showBankForm?: boolean }) {
  const [openBank, setOpenBank] = useState(!!showBankForm);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/pro"
          className="inline-flex rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy disabled:opacity-60"
        >
          Manage plan
        </Link>
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
        CLIVORA charges <strong>${PRO_PLUS_PRICE_USD}/mo</strong> for Pro Plus. Invoice amounts go
        from client to you directly - keep all work on platform.
      </p>
      {openBank && <BankPayoutSettings compact />}
    </div>
  );
}
