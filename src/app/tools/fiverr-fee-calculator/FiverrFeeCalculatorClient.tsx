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
} from "lucide-react";

type TimeHorizon = "1yr" | "3yr" | "5yr";

export function FiverrFeeCalculatorClient() {
  const searchParams = useSearchParams();

  // Read initial parameters from URL if present
  const initialRevenue = Number(searchParams?.get("revenue")) || 4500;
  const initialOrders = Number(searchParams?.get("orders")) || 15;
  const initialTips = Number(searchParams?.get("tips")) || 250;
  const initialWithdrawal = searchParams?.get("withdrawal") || "bank";

  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(initialRevenue);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(initialOrders);
  const [monthlyTips, setMonthlyTips] = useState<number>(initialTips);
  const [withdrawalMethod, setWithdrawalMethod] = useState<"bank" | "paypal" | "payoneer">(
    initialWithdrawal === "paypal" ? "paypal" : initialWithdrawal === "payoneer" ? "payoneer" : "bank"
  );
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("1yr");

  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [, startTransition] = useTransition();

  const monthlyRevId = useId();
  const ordersId = useId();
  const tipsId = useId();

  const yearsMultiplier = timeHorizon === "5yr" ? 5 : timeHorizon === "3yr" ? 3 : 1;
  const horizonLabel = timeHorizon === "5yr" ? "5 Years" : timeHorizon === "3yr" ? "3 Years" : "1 Year";

  // Gross Earnings (Orders + Tips)
  const totalGrossMonthly = monthlyRevenue + monthlyTips;
  const horizonGross = totalGrossMonthly * 12 * yearsMultiplier;

  // 1. Fiverr 20% flat seller cut on all orders and tips
  const monthlyServiceCut = totalGrossMonthly * 0.20;
  const horizonServiceCut = monthlyServiceCut * 12 * yearsMultiplier;

  // 2. Withdrawal fee (e.g. $3 per bank payout, or ~2.5% PayPal conversion, or $1 Payoneer)
  const monthlyWithdrawalFee =
    withdrawalMethod === "paypal"
      ? (totalGrossMonthly - monthlyServiceCut) * 0.025
      : withdrawalMethod === "payoneer"
        ? 2.0
        : 6.0; // 2 bank transfers per month at $3 each
  const horizonWithdrawalFee = monthlyWithdrawalFee * 12 * yearsMultiplier;

  // Total Losses to Fiverr
  const monthlyTotalLoss = monthlyServiceCut + monthlyWithdrawalFee;
  const horizonTotalLoss = horizonServiceCut + horizonWithdrawalFee;

  function resetDefaults() {
    setMonthlyRevenue(4500);
    setMonthlyOrders(15);
    setMonthlyTips(250);
    setWithdrawalMethod("bank");
    setTimeHorizon("1yr");
  }

  function getShareUrl() {
    if (typeof window === "undefined") return "https://clivora.io/tools/fiverr-fee-calculator";
    const url = new URL("/tools/fiverr-fee-calculator", window.location.origin);
    url.searchParams.set("revenue", String(monthlyRevenue));
    url.searchParams.set("orders", String(monthlyOrders));
    url.searchParams.set("tips", String(monthlyTips));
    if (withdrawalMethod !== "bank") url.searchParams.set("withdrawal", withdrawalMethod);
    return url.toString();
  }

  const receiptText = [
    "================================================",
    "       CLIVORA INDEPENDENT PLATFORM AUDIT       ",
    "        FIVERR PLATFORM 20% FEE RECEIPT         ",
    "================================================",
    `Date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    `Audit Horizon:               ${horizonLabel}`,
    `Gross Fiverr Sales & Tips:   $${Math.round(horizonGross).toLocaleString()}.00`,
    "------------------------------------------------",
    "FIVERR 20% DEDUCTIONS:",
    `  • 20% Seller Service Cut:  -$${Math.round(horizonServiceCut).toLocaleString()}.00`,
    `  • Payout / Withdrawal Fees:-$${Math.round(horizonWithdrawalFee).toLocaleString()}.00`,
    "------------------------------------------------",
    `TOTAL SURRENDERED TO FIVERR: -$${Math.round(horizonTotalLoss).toLocaleString()}.00`,
    "CLIVORA PLATFORM DEAL FEE:        $0.00",
    "================================================",
    `NET SAVINGS KEPT ON CLIVORA: +$${Math.round(horizonTotalLoss).toLocaleString()}.00`,
    "================================================",
    "Keep 100% of your earnings. Zero platform commission.",
    `Calculate your numbers: ${getShareUrl()}`,
  ].join("\n");

  function handleCopyReceipt() {
    navigator.clipboard.writeText(receiptText);
    startTransition(() => {
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2500);
    });
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(getShareUrl());
    startTransition(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  }

  function handleShareX() {
    const text = `I just calculated my 20% Fiverr fee loss: -$${Math.round(horizonTotalLoss).toLocaleString()} surrendered over ${horizonLabel} to platform cuts. On Clivora, deal fees are $0. Calculate your real take-home:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleShareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Interactive Controls Column */}
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-navy">Fiverr Gig Volume & Metrics</h2>
            <p className="text-xs text-slate-500">Calculate how much of your hard work is consumed by Fiverr&apos;s 20% cut.</p>
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
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Audit Time Horizon
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: "1yr", label: "1 Year", subtitle: "Immediate Impact" },
                { id: "3yr", label: "3 Years", subtitle: "Career Standard" },
                { id: "5yr", label: "5 Years", subtitle: "Compounding Loss" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeHorizon(t.id)}
                className={`rounded-2xl border p-3 text-center transition ${
                  timeHorizon === t.id
                    ? "border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="block text-xs font-extrabold">{t.label}</span>
                <span className="text-[10px] text-slate-500 font-medium">{t.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <label htmlFor={monthlyRevId} className="font-semibold text-navy">
              Monthly Gig Order Billings
            </label>
            <span className="font-mono text-sm font-bold text-teal-800">
              ${monthlyRevenue.toLocaleString()} / mo
            </span>
          </div>
          <input
            id={monthlyRevId}
            type="range"
            min={300}
            max={25000}
            step={100}
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>$300</span>
            <span>$12,500</span>
            <span>$25,000+</span>
          </div>
        </div>

        {/* Orders & Tips */}
        <div className="grid gap-4 sm:grid-cols-2 border-t border-slate-100 pt-5">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label htmlFor={ordersId} className="font-semibold text-navy">
                Orders Completed / Mo
              </label>
              <span className="font-mono font-bold text-slate-700">{monthlyOrders} orders</span>
            </div>
            <input
              id={ordersId}
              type="range"
              min={1}
              max={60}
              value={monthlyOrders}
              onChange={(e) => setMonthlyOrders(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Average completed gig orders.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label htmlFor={tipsId} className="font-semibold text-navy">
                Monthly Buyer Tips
              </label>
              <span className="font-mono font-bold text-slate-700">${monthlyTips} / mo</span>
            </div>
            <input
              id={tipsId}
              type="range"
              min={0}
              max={1500}
              step={25}
              value={monthlyTips}
              onChange={(e) => setMonthlyTips(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Fiverr taxes tips at the same 20% rate.</p>
          </div>
        </div>

        {/* Withdrawal Method */}
        <div className="border-t border-slate-100 pt-5">
          <span className="block font-semibold text-xs text-navy mb-2">Payout / Withdrawal Method</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "bank", label: "Bank Transfer", cost: "$3 per withdrawal" },
              { id: "paypal", label: "PayPal", cost: "~2.5% FX/transfer fee" },
              { id: "payoneer", label: "Fiverr Card / Payoneer", cost: "$1 to $3 per transfer" },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setWithdrawalMethod(method.id as "bank" | "paypal" | "payoneer")}
                className={`rounded-2xl border p-2.5 text-left transition ${
                  withdrawalMethod === method.id
                    ? "border-teal-600 bg-teal-50/50 text-teal-900 ring-1 ring-teal-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="block text-xs font-bold">{method.label}</span>
                <span className="text-[10px] text-slate-500">{method.cost}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output & Shareable Receipt Column */}
      <div className="space-y-6 lg:col-span-5">
        {/* Total Loss Banner Card */}
        <div className="overflow-hidden rounded-3xl border border-red-200/90 bg-gradient-to-br from-white via-red-50/30 to-red-100/40 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-700">
              <TrendingDown className="h-3.5 w-3.5" />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-800">
              Total Lost to Fiverr 20% Cut ({horizonLabel})
            </p>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy tracking-tight">
              -${Math.round(horizonTotalLoss).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">total cut</span>
          </div>
          <p className="text-xs text-red-700 font-semibold mt-1">
            -${Math.round(monthlyTotalLoss).toLocaleString()} forfeited every single month
          </p>

          <div className="mt-5 space-y-2 border-t border-slate-200/80 pt-4 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>20% Seller Service Fee:</span>
              <span className="font-mono font-bold text-red-800">
                -${Math.round(horizonServiceCut).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payout / Withdrawal Fees:</span>
              <span className="font-mono font-bold text-red-800">
                -${Math.round(horizonWithdrawalFee).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200/60 text-[11px]">
              <span>Buyer Platform Surcharge:</span>
              <span>5.5% + $3.00 (paid by client)</span>
            </div>
          </div>
        </div>

        {/* Shareable Thermal Paper Audit Receipt */}
        <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-3">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-slate-600" />
              <span className="font-mono text-xs font-bold text-slate-900 tracking-wider uppercase">
                Platform Tax Statement
              </span>
            </div>
            <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-mono font-bold text-red-800 uppercase">
              20% Commission
            </span>
          </div>

          {/* Monospaced Receipt Content */}
          <div className="mt-4 font-mono text-[11px] leading-relaxed text-slate-700 space-y-1 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-slate-500 text-[10px] pb-1 border-b border-dashed border-slate-200">
              <span>AUDIT TIMEFRAME:</span>
              <span className="font-bold text-slate-700">{horizonLabel}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Gross Sales & Tips:</span>
              <span className="font-bold">${Math.round(horizonGross).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-700">
              <span>Fiverr 20% Cut:</span>
              <span>-${Math.round(horizonServiceCut).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-700">
              <span>Payout Fees:</span>
              <span>-${Math.round(horizonWithdrawalFee).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-slate-300 pt-2 font-bold text-red-800">
              <span>TOTAL DEDUCTION:</span>
              <span>-${Math.round(horizonTotalLoss).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-teal-800 pt-1">
              <span>CLIVORA DEAL FEE:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-extrabold text-teal-900 bg-teal-100/60 -mx-2 px-2 py-1.5 rounded-lg mt-2 border border-teal-200">
              <span>YOU KEEP ON CLIVORA:</span>
              <span>+${Math.round(horizonTotalLoss).toLocaleString()}</span>
            </div>
          </div>

          {/* Social Share & Copy Actions */}
          <div className="mt-5 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                {copiedReceipt ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-teal-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Receipt</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-teal-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleShareX}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-black py-2 px-3 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                <span>Post on X</span>
              </button>

              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A66C2] py-2 px-3 text-xs font-bold text-white hover:bg-[#004182] transition"
              >
                <span>Post on LinkedIn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Clivora Value Card */}
        <div className="rounded-3xl border border-teal-200/90 bg-teal-50/50 p-6">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
            <ShieldCheck className="h-4 w-4 text-teal-700 shrink-0" />
            <span>Retain 100% of Your Earnings</span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            Clients pay you directly on your own terms. Send custom milestone invoices, host private project portals, and keep 100% of your money.
          </p>

          <Link
            href="/signup"
            className="mt-4 inline-flex items-center justify-center w-full gap-1.5 rounded-xl bg-navy py-2.5 px-4 text-xs font-bold text-white transition hover:bg-navy/90"
          >
            <span>Start Free on Clivora</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
