"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

interface Props {
  platform: "upwork" | "fiverr";
}

type Role = "freelancer" | "client";
type Horizon = 1 | 3 | 5;

const PRESETS = [2500, 5000, 10000, 20000];

export function LiveMarketplaceFeeComparison({ platform }: Props) {
  const [role, setRole] = useState<Role>("freelancer");
  const [monthlyAmount, setMonthlyAmount] = useState<number>(5000);
  const [horizonYears, setHorizonYears] = useState<Horizon>(1);
  const sliderId = useId();

  const isUpwork = platform === "upwork";
  const platformName = isUpwork ? "Upwork" : "Fiverr";

  // Calculations
  const months = horizonYears * 12;
  const totalVolume = monthlyAmount * months;

  let platformDeductions = 0;
  let breakdownRows: Array<{ label: string; amount: number; note: string }> = [];

  if (isUpwork) {
    if (role === "freelancer") {
      const serviceFee = totalVolume * 0.1;
      const connectsBurn = 35 * months;
      const withdrawalFees = 20 * months;
      platformDeductions = serviceFee + connectsBurn + withdrawalFees;

      breakdownRows = [
        {
          label: "10% Platform Service Cut",
          amount: serviceFee,
          note: "Flat 10% deducted on all contract billings",
        },
        {
          label: "Connects Proposal Tokens",
          amount: connectsBurn,
          note: "$0.15 per token (estimated 40 to 60 tokens burned per month)",
        },
        {
          label: "Payment & Withdrawal Friction",
          amount: withdrawalFees,
          note: "Wire, ACH, and FX conversion spreads",
        },
      ];
    } else {
      const marketplaceFee = totalVolume * 0.0799;
      const contractInitiation = 14.95 * (4 * horizonYears);
      platformDeductions = marketplaceFee + contractInitiation;

      breakdownRows = [
        {
          label: "7.99% Client Marketplace Surcharge",
          amount: marketplaceFee,
          note: "Added directly to every client invoice paid",
        },
        {
          label: "Contract Initiation Surcharges",
          amount: contractInitiation,
          note: "$9.95 to $14.95 initiation fee per new contractor hired",
        },
      ];
    }
  } else {
    // Fiverr
    if (role === "freelancer") {
      const commissionFee = totalVolume * 0.2;
      const tipsCut = monthlyAmount * 0.05 * 0.2 * months;
      const clearanceLoss = monthlyAmount * 0.015 * months;
      platformDeductions = commissionFee + tipsCut + clearanceLoss;

      breakdownRows = [
        {
          label: "20% Flat Seller Commission",
          amount: commissionFee,
          note: "Deducted automatically from every gig and milestone",
        },
        {
          label: "20% Cut on Client Tips",
          amount: tipsCut,
          note: "Fiverr extracts the full 20% even on gratuity",
        },
        {
          label: "FX Spread & Withdrawal Fees",
          amount: clearanceLoss,
          note: "Currency conversion markup + bank transfer charges",
        },
      ];
    } else {
      const buyerFee = totalVolume * 0.055 + 3 * 3 * months;
      platformDeductions = buyerFee;

      breakdownRows = [
        {
          label: "5.5% Buyer Order Surcharge + $3 Flat Fee",
          amount: buyerFee,
          note: "Extra processing charge applied to every checkout",
        },
      ];
    }
  }

  const clivoraFee = 0;
  const netKeptWithClivora = totalVolume;
  const netKeptWithCompetitor = Math.max(0, totalVolume - platformDeductions);
  const totalSavings = platformDeductions;

  return (
    <div className="rounded-3xl border border-teal-200 bg-white p-6 sm:p-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800">
            <TrendingUp className="h-3.5 w-3.5 text-teal-600" />
            Live Financial Comparison
          </span>
          <h3 className="mt-2 text-xl sm:text-2xl font-bold text-navy">
            Calculate your exact savings: Clivora vs {platformName}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Slide your monthly volume to see how much capital you retain with Clivora&apos;s $0 platform fee.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setRole("freelancer")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              role === "freelancer"
                ? "bg-white text-navy shadow-xs"
                : "text-slate-600 hover:text-navy"
            }`}
          >
            I am a Freelancer
          </button>
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              role === "client"
                ? "bg-white text-navy shadow-xs"
                : "text-slate-600 hover:text-navy"
            }`}
          >
            I am a Client
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="mt-6 grid gap-6 md:grid-cols-12 items-center">
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor={sliderId} className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {role === "freelancer" ? "Monthly Freelance Revenue" : "Monthly Contractor Spend"}
            </label>
            <span className="font-mono text-lg sm:text-xl font-bold text-navy">
              ${monthlyAmount.toLocaleString()}
              <span className="text-xs font-normal text-slate-500"> / month</span>
            </span>
          </div>

          <input
            id={sliderId}
            aria-label={role === "freelancer" ? "Monthly Freelance Revenue" : "Monthly Contractor Spend"}
            type="range"
            min={1000}
            max={30000}
            step={500}
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(Number(e.target.value))}
            className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />

          {/* Quick presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400">Presets:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setMonthlyAmount(preset)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  monthlyAmount === preset
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Horizon selector */}
        <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Time Horizon
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 3, 5].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setHorizonYears(yr as Horizon)}
                className={`rounded-xl py-2 text-xs font-bold transition text-center ${
                  horizonYears === yr
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {yr} {yr === 1 ? "Year" : "Years"}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Total Volume: ${(monthlyAmount * months).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Comparison Scoreboard */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* Competitor Card */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              {platformName} Platform Extraction
            </span>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
              {isUpwork ? "10% + Connects" : "20% Flat Cut"}
            </span>
          </div>

          <div>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-rose-700">
              -${Math.round(platformDeductions).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-rose-900/80">
              Total fees extracted over {horizonYears} {horizonYears === 1 ? "year" : "years"}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-rose-200/60 text-xs">
            {breakdownRows.map((row) => (
              <div key={row.label} className="flex justify-between items-center text-rose-900/90">
                <span className="text-slate-600">{row.label}</span>
                <span className="font-mono font-bold text-rose-700">-${Math.round(row.amount).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-rose-200/40 font-bold text-navy">
              <span>Net Value Received:</span>
              <span className="font-mono">${Math.round(netKeptWithCompetitor).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Clivora Card */}
        <div className="rounded-2xl border border-teal-300 bg-teal-50/50 p-5 sm:p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              CLIVORA Operating System
            </span>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-800">
              $0 Deal Fee
            </span>
          </div>

          <div>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-teal-800">
              +${Math.round(totalSavings).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-teal-900/80 font-medium">
              Extra money retained in your pocket over {horizonYears} {horizonYears === 1 ? "year" : "years"}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-teal-200/60 text-xs">
            <div className="flex justify-between items-center text-teal-900">
              <span className="text-slate-600">Clivora Platform Take Rate:</span>
              <span className="font-mono font-bold text-teal-700">$0 (0%)</span>
            </div>
            <div className="flex justify-between items-center text-teal-900">
              <span className="text-slate-600">Job Application / Token Costs:</span>
              <span className="font-mono font-bold text-teal-700">$0 (Free)</span>
            </div>
            <div className="flex justify-between items-center text-teal-900">
              <span className="text-slate-600">Fund Clearance Hold:</span>
              <span className="font-mono font-bold text-teal-700">0 Days (Instant)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-teal-200/40 font-bold text-navy">
              <span>Total Retained With Clivora:</span>
              <span className="font-mono text-teal-900 font-extrabold">${Math.round(netKeptWithClivora).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Footer */}
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-navy to-slate-900 p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-sm font-bold">
            Stop losing ${Math.round(platformDeductions / months).toLocaleString()}/month to {platformName}
          </p>
          <p className="text-xs text-slate-300">
            Start managing clients, contracts, proposals, and invoices with 0% platform fee.
          </p>
        </div>

        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-teal-300 transition-colors shadow-sm shrink-0 w-full sm:w-auto"
        >
          <span>Claim Your $0-Fee Account</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
