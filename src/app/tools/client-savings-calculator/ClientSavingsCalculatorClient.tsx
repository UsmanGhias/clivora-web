"use client";

import React, { useState, useId, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  TrendingDown,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
  Share2,
  FileText,
  Building2,
  Briefcase,
} from "lucide-react";

type TimeHorizon = "1yr" | "3yr" | "5yr";

export function ClientSavingsCalculatorClient() {
  const searchParams = useSearchParams();

  const initialSpend = Number(searchParams?.get("spend")) || 75000;
  const initialContractors = Number(searchParams?.get("contractors")) || 3;
  const initialFeeRate = Number(searchParams?.get("feeRate")) || 7.99;

  const [annualSpend, setAnnualSpend] = useState<number>(initialSpend);
  const [activeContractors, setActiveContractors] = useState<number>(initialContractors);
  const [clientFeeRate, setClientFeeRate] = useState<number>(initialFeeRate);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("1yr");

  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [, startTransition] = useTransition();

  const spendId = useId();
  const contractorsId = useId();
  const feeRateId = useId();

  const yearsMultiplier = timeHorizon === "5yr" ? 5 : timeHorizon === "3yr" ? 3 : 1;
  const horizonLabel = timeHorizon === "5yr" ? "5 Years" : timeHorizon === "3yr" ? "3 Years" : "1 Year";

  // Calculations
  // Upwork Client Marketplace Surcharge: typically 5% to 7.99% of total contract volume
  const horizonSpend = annualSpend * yearsMultiplier;
  const upworkMarketplaceFee = Math.round(horizonSpend * (clientFeeRate / 100));

  // Contract Initiation Fee: $4.99 - $14.99 per new contract. Assuming 2 contracts per contractor per year.
  const contractInitiationFee = Math.round(activeContractors * 2 * 9.99 * yearsMultiplier);

  // Payout / processing / wire fees paid by corporate accounts: ~$120/yr
  const processingFees = 120 * yearsMultiplier;

  // Total Upwork Corporate Waste
  const totalUpworkLoss = upworkMarketplaceFee + contractInitiationFee + processingFees;

  // Clivora Surcharge: $0
  const clivoraCost = 0;
  const netSavings = totalUpworkLoss;

  const updateUrl = (spend: number, contractors: number, fee: number) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("spend", spend.toString());
    url.searchParams.set("contractors", contractors.toString());
    url.searchParams.set("feeRate", fee.toString());
    window.history.replaceState({}, "", url.toString());
  };

  function resetDefaults() {
    setAnnualSpend(75000);
    setActiveContractors(3);
    setClientFeeRate(7.99);
    setTimeHorizon("1yr");
    updateUrl(75000, 3, 7.99);
  }

  const receiptText = `================================================
*** CLIVORA CLIENT PROCUREMENT AUDIT ***
Audited Horizon: ${horizonLabel}
Annual Contractor Spend: $${annualSpend.toLocaleString()}/yr
Active Contractors: ${activeContractors}
------------------------------------------------
TRADITIONAL BROKER (UPWORK) CLIENT CHARGES:
  Client Marketplace Fee (${clientFeeRate}%): $${upworkMarketplaceFee.toLocaleString()}
  Contract Initiation Surcharges: $${contractInitiationFee.toLocaleString()}
  Payment Processing Overhead: $${processingFees.toLocaleString()}
  TOTAL BROKER MARKUP FORFEITED: $${totalUpworkLoss.toLocaleString()}
------------------------------------------------
CLIVORA PLATFORM SURCHARGE:
  Client Marketplace Fee: $0.00
  Contract Initiation Fee: $0.00
  Total Clivora Surcharge: $0.00
------------------------------------------------
TOTAL BUDGET RETAINED ON CLIVORA: +$${netSavings.toLocaleString()}
Audit link: https://clivora.io/tools/client-savings-calculator?spend=${annualSpend}&contractors=${activeContractors}
================================================`;

  function handleCopyReceipt() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(receiptText);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  }

  function handleCopyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  const shareText = `Our company would save $${netSavings.toLocaleString()} over ${horizonLabel} by hiring contractors on Clivora instead of paying Upwork's 7.99% client markup:`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://clivora.io/tools/client-savings-calculator";
  const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedInIntent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Parameters Input */}
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-navy">Corporate Procurement Parameters</h2>
            <p className="text-xs text-slate-500">Calculate how much your team forfeits to client marketplace surcharges.</p>
          </div>
          <button
            type="button"
            onClick={resetDefaults}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Time Horizon Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-navy">Calculation Horizon</label>
          <div className="grid grid-cols-3 gap-2">
            {(["1yr", "3yr", "5yr"] as TimeHorizon[]).map((horizon) => (
              <button
                key={horizon}
                type="button"
                onClick={() => setTimeHorizon(horizon)}
                className={`rounded-xl py-2 px-3 text-xs font-bold transition-all ${
                  timeHorizon === horizon
                    ? "bg-navy text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {horizon === "1yr" ? "1 Year" : horizon === "3yr" ? "3 Years" : "5 Years"}
              </button>
            ))}
          </div>
        </div>

        {/* Annual Spend */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label htmlFor={spendId} className="font-semibold text-navy">
              Annual Contractor &amp; Engineering Spend
            </label>
            <span className="font-bold text-teal-800">${annualSpend.toLocaleString()} / yr</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
            <input
              id={spendId}
              type="number"
              min={5000}
              max={1500000}
              step={5000}
              value={annualSpend}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setAnnualSpend(val);
                startTransition(() => updateUrl(val, activeContractors, clientFeeRate));
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-4 text-sm font-semibold text-navy focus:border-teal-600 focus:bg-white focus:outline-none"
            />
          </div>
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={annualSpend}
            onChange={(e) => {
              const val = Number(e.target.value);
              setAnnualSpend(val);
              startTransition(() => updateUrl(val, activeContractors, clientFeeRate));
            }}
            className="w-full accent-teal-600"
          />
        </div>

        {/* Contractors & Rate */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label htmlFor={contractorsId} className="font-semibold text-navy">
                Active External Contractors
              </label>
              <span className="font-bold text-slate-700">{activeContractors} people</span>
            </div>
            <input
              id={contractorsId}
              type="number"
              min={1}
              max={100}
              value={activeContractors}
              onChange={(e) => {
                const val = Number(e.target.value) || 1;
                setActiveContractors(val);
                startTransition(() => updateUrl(annualSpend, val, clientFeeRate));
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-semibold text-navy focus:border-teal-600 focus:bg-white focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">Developers, designers, or consultants hired.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label htmlFor={feeRateId} className="font-semibold text-navy">
                Upwork Client Fee Surcharge
              </label>
              <span className="font-bold text-slate-700">{clientFeeRate}%</span>
            </div>
            <select
              id={feeRateId}
              value={clientFeeRate}
              onChange={(e) => {
                const val = Number(e.target.value);
                setClientFeeRate(val);
                startTransition(() => updateUrl(annualSpend, activeContractors, val));
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-semibold text-navy focus:border-teal-600 focus:bg-white focus:outline-none"
            >
              <option value={7.99}>7.99% (Standard Marketplace Fee)</option>
              <option value={5.0}>5.00% (Enterprise / High Volume)</option>
              <option value={3.0}>3.00% (Contractor Direct Pay Surcharge)</option>
            </select>
            <p className="text-[11px] text-slate-500">Upwork charges up to 7.99% on every invoice payment.</p>
          </div>
        </div>

        {/* Share Section */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500">Share with Leadership:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Share Link"}</span>
              </button>
              <a
                href={twitterIntent}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <Share2 className="h-3.5 w-3.5 text-sky-500" />
                <span>Post on X</span>
              </a>
              <a
                href={linkedInIntent}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <Share2 className="h-3.5 w-3.5 text-blue-600" />
                <span>Share on LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Results & Receipt Card */}
      <div className="space-y-6 lg:col-span-5">
        {/* Monospace Thermal Paper Receipt */}
        <div className="relative rounded-3xl border border-slate-300 bg-stone-50 p-6 sm:p-7 shadow-md font-mono text-xs text-stone-800">
          <div className="text-center pb-4 border-b border-dashed border-stone-300 space-y-1">
            <p className="font-extrabold tracking-widest text-stone-900 text-sm">*** CLIVORA PROCUREMENT AUDIT ***</p>
            <p className="text-[10px] text-stone-500 uppercase tracking-wider">Client Fee Waste Analysis</p>
            <p className="text-[10px] text-stone-400">Horizon: {horizonLabel} · Spend: ${annualSpend.toLocaleString()}/yr</p>
          </div>

          <div className="py-4 space-y-2 border-b border-dashed border-stone-300 text-[11px]">
            <div className="flex justify-between">
              <span>Gross Contractor Budget:</span>
              <span className="font-bold">${horizonSpend.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-700">
              <span>Upwork Surcharge ({clientFeeRate}%):</span>
              <span className="font-bold">+${upworkMarketplaceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-700">
              <span>Contract Initiation Fees:</span>
              <span className="font-bold">+${contractInitiationFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-700">
              <span>Account Processing Overhead:</span>
              <span className="font-bold">+${processingFees.toLocaleString()}</span>
            </div>
          </div>

          <div className="py-4 space-y-2 border-b border-stone-400 text-xs">
            <div className="flex justify-between font-bold text-red-800">
              <span>TOTAL BROKER SURCHARGE:</span>
              <span>${totalUpworkLoss.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-teal-800">
              <span>CLIVORA CLIENT FEE (0%):</span>
              <span>$0.00</span>
            </div>
          </div>

          <div className="pt-4 text-center space-y-1">
            <p className="text-[10px] uppercase font-bold text-stone-500">Corporate Budget Retained with Clivora</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-teal-800">
              +${netSavings.toLocaleString()}
            </p>
            <p className="text-[10px] text-stone-500">
              Saves ${Math.round(totalUpworkLoss / yearsMultiplier).toLocaleString()} each year in zero-value fees
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-dashed border-stone-300">
            <button
              type="button"
              onClick={handleCopyReceipt}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-200/80 hover:bg-stone-300 text-stone-800 font-bold text-xs transition"
            >
              {copiedReceipt ? <Check className="h-3.5 w-3.5 text-teal-700" /> : <FileText className="h-3.5 w-3.5" />}
              <span>{copiedReceipt ? "Receipt Copied to Clipboard!" : "Copy Executive Statement"}</span>
            </button>
          </div>
        </div>

        {/* Action Callout */}
        <div className="rounded-3xl border border-teal-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-teal-700 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900">
              Ready to Stop Paying Client Surcharges?
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            Post your technical brief on Clivora with $0 fees. Vetted software engineers and consultants submit proposals
            directly to your desk.
          </p>

          <div className="space-y-2 pt-1">
            <Link
              href="/start-a-project"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-navy py-2.5 px-4 text-xs font-bold text-white transition hover:bg-navy/90 text-center"
            >
              <span>Post a Project Free (Start SOW)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/connect"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-bold text-navy transition hover:bg-slate-100 text-center"
            >
              <span>Explore Vetted Talent Directory</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
