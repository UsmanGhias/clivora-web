"use client";

import React, { useState, useId, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Percent,
  Briefcase,
  AlertCircle,
  RotateCcw,
  Copy,
  Check,
  Share2,
  ArrowRight,
} from "lucide-react";

export function RateCalculatorClient() {
  const searchParams = useSearchParams();

  // Read initial values from URL query params or defaults
  const initialNet = Number(searchParams?.get("net")) || 85000;
  const initialTax = Number(searchParams?.get("tax")) || 25;
  const initialExpenses = Number(searchParams?.get("expenses")) || 7500;
  const initialVacation = Number(searchParams?.get("vacation")) || 4;
  const initialHours = Number(searchParams?.get("hours")) || 38;
  const initialBillable = Number(searchParams?.get("utilization")) || 65;

  const [targetNetIncome, setTargetNetIncome] = useState<number>(initialNet);
  const [taxRate, setTaxRate] = useState<number>(initialTax);
  const [annualExpenses, setAnnualExpenses] = useState<number>(initialExpenses);
  const [vacationWeeks, setVacationWeeks] = useState<number>(initialVacation);
  const [weeklyHours, setWeeklyHours] = useState<number>(initialHours);
  const [billablePercent, setBillablePercent] = useState<number>(initialBillable);

  const [copiedLink, setCopiedLink] = useState(false);
  const [, startTransition] = useTransition();

  const targetNetId = useId();
  const taxRateId = useId();
  const annualExpensesId = useId();
  const vacationWeeksId = useId();
  const weeklyHoursId = useId();
  const billablePercentId = useId();

  // Sync state changes with URL query parameters
  const updateUrl = (
    net: number,
    tax: number,
    expenses: number,
    vacation: number,
    hours: number,
    utilization: number
  ) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("net", net.toString());
    url.searchParams.set("tax", tax.toString());
    url.searchParams.set("expenses", expenses.toString());
    url.searchParams.set("vacation", vacation.toString());
    url.searchParams.set("hours", hours.toString());
    url.searchParams.set("utilization", utilization.toString());
    window.history.replaceState({}, "", url.toString());
  };

  // Calculations
  const effectiveTaxFactor = Math.max(0.01, 1 - taxRate / 100);
  const grossIncomeNeeded = targetNetIncome / effectiveTaxFactor;
  const totalRevenueRequired = grossIncomeNeeded + annualExpenses;

  const billableWeeks = Math.max(1, 52 - vacationWeeks);
  const billableHoursPerWeek = (weeklyHours * billablePercent) / 100;
  const totalBillableHoursYear = billableWeeks * billableHoursPerWeek;

  const hourlyRate =
    totalBillableHoursYear > 0 ? Math.round(totalRevenueRequired / totalBillableHoursYear) : 0;
  const dayRate = Math.round(hourlyRate * 8);
  const monthlyRevenueTarget = Math.round(totalRevenueRequired / 12);

  // Marketplace leakage calculations on this volume
  const upworkLeakage = Math.round(totalRevenueRequired * 0.10) + 360; // 10% + $30/mo connects
  const fiverrLeakage = Math.round(totalRevenueRequired * 0.20) + 120; // 20% + payout fees

  function resetDefaults() {
    setTargetNetIncome(85000);
    setTaxRate(25);
    setAnnualExpenses(7500);
    setVacationWeeks(4);
    setWeeklyHours(38);
    setBillablePercent(65);
    updateUrl(85000, 25, 7500, 4, 38, 65);
  }

  function handleCopyShareLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  const shareText = `My freelance target rate: $${hourlyRate}/hr ($${dayRate}/day) to net $${targetNetIncome.toLocaleString()}/yr. Calculated via Clivora's $0 fee rate calculator:`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://clivora.io/tools/freelance-rate-calculator";
  const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedInIntent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Controls Form */}
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-display text-lg font-bold text-navy">Financial Parameters</h2>
          <button
            type="button"
            onClick={resetDefaults}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Target Net Income */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label htmlFor={targetNetId} className="font-semibold text-navy">
              Target Annual Net Income (Take-Home)
            </label>
            <span className="font-bold text-teal-800">${targetNetIncome.toLocaleString()}</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
            <input
              id={targetNetId}
              type="number"
              min={10000}
              max={500000}
              step={1000}
              value={targetNetIncome}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setTargetNetIncome(val);
                startTransition(() =>
                  updateUrl(val, taxRate, annualExpenses, vacationWeeks, weeklyHours, billablePercent)
                );
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-4 text-sm font-semibold text-navy focus:border-teal-600 focus:bg-white focus:outline-none"
            />
          </div>
          <p className="text-xs text-slate-500">Your desired post-tax profit to cover personal living and savings.</p>
        </div>

        {/* Tax Rate & Overhead */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label htmlFor={taxRateId} className="font-semibold text-navy">
                Expected Tax Rate (%)
              </label>
              <span className="font-bold text-slate-700">{taxRate}%</span>
            </div>
            <input
              id={taxRateId}
              type="range"
              min={5}
              max={50}
              value={taxRate}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTaxRate(val);
                startTransition(() =>
                  updateUrl(targetNetIncome, val, annualExpenses, vacationWeeks, weeklyHours, billablePercent)
                );
              }}
              className="w-full accent-teal-600"
            />
            <p className="text-[11px] text-slate-500">Income tax + self-employment tax (avg 20-30%).</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label htmlFor={annualExpensesId} className="font-semibold text-navy">
                Annual Business Overhead
              </label>
              <span className="font-bold text-slate-700">${annualExpenses.toLocaleString()}</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
              <input
                id={annualExpensesId}
                type="number"
                min={0}
                max={50000}
                step={500}
                value={annualExpenses}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setAnnualExpenses(val);
                  startTransition(() =>
                    updateUrl(targetNetIncome, taxRate, val, vacationWeeks, weeklyHours, billablePercent)
                  );
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-7 pr-3 text-xs font-semibold text-navy focus:border-teal-600 focus:bg-white focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500">Software, hardware, insurance, accounting.</p>
          </div>
        </div>

        {/* Time Utilization */}
        <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label htmlFor={vacationWeeksId} className="font-semibold text-navy">
                Vacation &amp; Sick Time
              </label>
              <span className="font-bold text-slate-700">{vacationWeeks} wks</span>
            </div>
            <input
              id={vacationWeeksId}
              type="range"
              min={1}
              max={12}
              value={vacationWeeks}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVacationWeeks(val);
                startTransition(() =>
                  updateUrl(targetNetIncome, taxRate, annualExpenses, val, weeklyHours, billablePercent)
                );
              }}
              className="w-full accent-teal-600"
            />
            <p className="text-[11px] text-slate-500">{billableWeeks} working weeks.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label htmlFor={weeklyHoursId} className="font-semibold text-navy">
                Total Weekly Hours
              </label>
              <span className="font-bold text-slate-700">{weeklyHours} hrs</span>
            </div>
            <input
              id={weeklyHoursId}
              type="range"
              min={15}
              max={60}
              value={weeklyHours}
              onChange={(e) => {
                const val = Number(e.target.value);
                setWeeklyHours(val);
                startTransition(() =>
                  updateUrl(targetNetIncome, taxRate, annualExpenses, vacationWeeks, val, billablePercent)
                );
              }}
              className="w-full accent-teal-600"
            />
            <p className="text-[11px] text-slate-500">Total hours dedicated.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label htmlFor={billablePercentId} className="font-semibold text-navy">
                Billable Utilization
              </label>
              <span className="font-bold text-teal-800">{billablePercent}%</span>
            </div>
            <input
              id={billablePercentId}
              type="range"
              min={30}
              max={95}
              value={billablePercent}
              onChange={(e) => {
                const val = Number(e.target.value);
                setBillablePercent(val);
                startTransition(() =>
                  updateUrl(targetNetIncome, taxRate, annualExpenses, vacationWeeks, weeklyHours, val)
                );
              }}
              className="w-full accent-teal-600"
            />
            <p className="text-[11px] text-slate-500">{billableHoursPerWeek.toFixed(1)} billable hrs/wk.</p>
          </div>
        </div>

        {/* Share Calculation Section */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500">Share this rate breakdown:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyShareLink}
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

      {/* Output Results Card */}
      <div className="space-y-6 lg:col-span-5">
        <div className="overflow-hidden rounded-3xl border border-teal-200/80 bg-gradient-to-br from-white via-teal-50/20 to-teal-100/30 p-6 sm:p-8 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-800">
            Recommended Target Rates
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy tracking-tight">
              ${hourlyRate}
            </span>
            <span className="text-base font-semibold text-slate-500">/ hour</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200/60 pt-5">
            <div className="rounded-2xl border border-white/60 bg-white/80 p-3.5 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Day Rate (8h)</span>
              <p className="mt-1 font-display text-xl font-extrabold text-navy">${dayRate}</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 p-3.5 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly Revenue</span>
              <p className="mt-1 font-display text-xl font-extrabold text-navy">${monthlyRevenueTarget.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-slate-200/60 pt-4 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Gross billable target:</span>
              <span className="font-bold text-navy">${Math.round(totalRevenueRequired).toLocaleString()} / yr</span>
            </div>
            <div className="flex justify-between">
              <span>Annual billable capacity:</span>
              <span className="font-bold text-navy">{Math.round(totalBillableHoursYear)} hours</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated taxes ({taxRate}%):</span>
              <span className="font-bold text-slate-700">${Math.round(grossIncomeNeeded - targetNetIncome).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Marketplace Comparison Box */}
        <div className="rounded-3xl border border-red-200/80 bg-red-50/40 p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>Marketplace Fee Leakage Alert</span>
          </div>
          <p className="text-xs leading-relaxed text-red-800/90">
            Billing this volume through traditional gig platforms extracts heavy commissions from your revenue:
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-red-200/60">
              <div>
                <span className="block font-bold text-navy">Upwork Loss (10% + Connects):</span>
                <span className="text-[11px] text-slate-500">${upworkLeakage.toLocaleString()} / year</span>
              </div>
              <Link
                href={`/tools/upwork-fee-calculator?revenue=${monthlyRevenueTarget}`}
                className="font-bold text-red-700 hover:text-red-950 underline"
              >
                Inspect Upwork ↗
              </Link>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-red-200/60">
              <div>
                <span className="block font-bold text-navy">Fiverr Loss (20% + Fees):</span>
                <span className="text-[11px] text-slate-500">${fiverrLeakage.toLocaleString()} / year</span>
              </div>
              <Link
                href={`/tools/fiverr-fee-calculator?revenue=${monthlyRevenueTarget}`}
                className="font-bold text-red-700 hover:text-red-950 underline"
              >
                Inspect Fiverr ↗
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-teal-200 text-xs">
            <div>
              <span className="block font-bold text-navy">Annual Clivora Fee:</span>
              <span className="text-[11px] text-slate-500">$0 commission on client invoices</span>
            </div>
            <span className="font-display text-lg font-bold text-teal-700">$0</span>
          </div>

          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-navy py-2.5 px-4 text-xs font-bold text-white transition hover:bg-navy/90"
            >
              <span>Keep 100% with Clivora Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
