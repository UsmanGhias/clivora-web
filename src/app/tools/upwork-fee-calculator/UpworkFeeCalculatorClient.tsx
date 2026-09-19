"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  TrendingDown,
  Percent,
  Coins,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function UpworkFeeCalculatorClient() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(6500);
  const [proposalsPerMonth, setProposalsPerMonth] = useState<number>(20);
  const [connectsPerProposal, setConnectsPerProposal] = useState<number>(10);
  const [withdrawalMethod, setWithdrawalMethod] = useState<"standard" | "wire">("standard");

  const monthlyRevId = useId();
  const proposalsId = useId();
  const connectsId = useId();

  // Upwork Math:
  // 1. Service Fee: 10% of revenue
  const monthlyServiceFee = monthlyRevenue * 0.10;
  const annualServiceFee = monthlyServiceFee * 12;

  // 2. Connects: $0.15 per connect
  const monthlyConnectsCost = proposalsPerMonth * connectsPerProposal * 0.15;
  const annualConnectsCost = monthlyConnectsCost * 12;

  // 3. Withdrawal Fees: $30/mo wire or $2/mo standard (assuming 2 payouts/month)
  const monthlyWithdrawalFee = withdrawalMethod === "wire" ? 60 : 4;
  const annualWithdrawalFee = monthlyWithdrawalFee * 12;

  // Total Upwork Leakage
  const monthlyTotalLoss = monthlyServiceFee + monthlyConnectsCost + monthlyWithdrawalFee;
  const annualTotalLoss = annualServiceFee + annualConnectsCost + annualWithdrawalFee;

  // Net Take-Home
  const upworkNetTakeHome = Math.max(0, monthlyRevenue - monthlyTotalLoss);
  const clivoraNetTakeHome = monthlyRevenue; // $0 deal fee

  function resetDefaults() {
    setMonthlyRevenue(6500);
    setProposalsPerMonth(20);
    setConnectsPerProposal(10);
    setWithdrawalMethod("standard");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Interactive Controls */}
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-display text-lg font-bold text-navy">Monthly Billable Volume</h2>
          <button
            type="button"
            onClick={resetDefaults}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Monthly Revenue Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label htmlFor={monthlyRevId} className="font-semibold text-navy">
              Average Monthly Freelance Earnings
            </label>
            <span className="font-bold text-teal-800">${monthlyRevenue.toLocaleString()} / mo</span>
          </div>
          <input
            id={monthlyRevId}
            type="range"
            min={500}
            max={30000}
            step={250}
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
            className="w-full accent-teal-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>$500</span>
            <span>$15,000</span>
            <span>$30,000+</span>
          </div>
        </div>

        {/* Proposals & Connects */}
        <div className="grid gap-4 sm:grid-cols-2 border-t border-slate-100 pt-5">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label htmlFor={proposalsId} className="font-semibold text-navy">
                Proposals Submitted / Mo
              </label>
              <span className="font-bold text-slate-700">{proposalsPerMonth} bids</span>
            </div>
            <input
              id={proposalsId}
              type="range"
              min={1}
              max={60}
              value={proposalsPerMonth}
              onChange={(e) => setProposalsPerMonth(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <p className="text-[11px] text-slate-500">Average applications per month.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label htmlFor={connectsId} className="font-semibold text-navy">
                Connects per Proposal
              </label>
              <span className="font-bold text-slate-700">{connectsPerProposal} connects</span>
            </div>
            <input
              id={connectsId}
              type="range"
              min={4}
              max={16}
              value={connectsPerProposal}
              onChange={(e) => setConnectsPerProposal(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <p className="text-[11px] text-slate-500">Typical range: 4 to 16 tokens ($0.15 ea).</p>
          </div>
        </div>

        {/* Withdrawal Method */}
        <div className="border-t border-slate-100 pt-5">
          <span className="block font-semibold text-xs text-navy mb-2">Primary Payout Method</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWithdrawalMethod("standard")}
              className={`rounded-xl border p-3 text-left transition ${
                withdrawalMethod === "standard"
                  ? "border-teal-600 bg-teal-50/50 text-teal-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="block text-xs font-bold">ACH / Local Payout</span>
              <span className="text-[11px] text-slate-500">~$2 to $4 / mo</span>
            </button>
            <button
              type="button"
              onClick={() => setWithdrawalMethod("wire")}
              className={`rounded-xl border p-3 text-left transition ${
                withdrawalMethod === "wire"
                  ? "border-teal-600 bg-teal-50/50 text-teal-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="block text-xs font-bold">International Wire</span>
              <span className="text-[11px] text-slate-500">$30 per wire transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Output Breakdown Card */}
      <div className="space-y-6 lg:col-span-5">
        <div className="overflow-hidden rounded-3xl border border-red-200/90 bg-gradient-to-br from-white via-red-50/30 to-red-100/40 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-700">
              <TrendingDown className="h-3.5 w-3.5" />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-800">
              Total Revenue Forfeited to Upwork
            </p>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy tracking-tight">
              -${Math.round(annualTotalLoss).toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-slate-500">/ year</span>
          </div>
          <p className="text-xs text-red-700 font-semibold mt-1">
            -${Math.round(monthlyTotalLoss).toLocaleString()} lost every month
          </p>

          <div className="mt-6 space-y-2.5 border-t border-slate-200/80 pt-5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>10% Freelancer Service Fee:</span>
              <span className="font-bold text-red-800">-${Math.round(annualServiceFee).toLocaleString()} / yr</span>
            </div>
            <div className="flex justify-between">
              <span>Proposal Connects Tokens:</span>
              <span className="font-bold text-red-800">-${Math.round(annualConnectsCost).toLocaleString()} / yr</span>
            </div>
            <div className="flex justify-between">
              <span>Withdrawal / Payout Processing:</span>
              <span className="font-bold text-red-800">-${Math.round(annualWithdrawalFee).toLocaleString()} / yr</span>
            </div>
          </div>
        </div>

        {/* Clivora Advantage Card */}
        <div className="rounded-3xl border border-teal-200/90 bg-teal-50/50 p-6">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
            <ShieldCheck className="h-4 w-4 text-teal-700 shrink-0" />
            <span>Retain 100% on Clivora</span>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-teal-200/60">
              <span className="font-semibold text-navy">Upwork Take-Home:</span>
              <span className="font-bold text-slate-600">${Math.round(upworkNetTakeHome).toLocaleString()} / mo</span>
            </div>
            <div className="flex justify-between items-center bg-teal-100/60 p-3 rounded-xl border border-teal-300">
              <span className="font-bold text-teal-900">Clivora Direct Take-Home:</span>
              <span className="font-display text-base font-extrabold text-teal-800">
                ${Math.round(clivoraNetTakeHome).toLocaleString()} / mo
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-600">
            Clients pay you directly on your own invoice terms. No escrow lockouts, no bidding token fees, and $0 commission deductions.
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
