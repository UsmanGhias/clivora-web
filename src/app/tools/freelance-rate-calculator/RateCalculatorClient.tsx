"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Percent,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

export function RateCalculatorClient() {
  const [targetNetIncome, setTargetNetIncome] = useState<number>(85000);
  const [taxRate, setTaxRate] = useState<number>(25);
  const [annualExpenses, setAnnualExpenses] = useState<number>(7500);
  const [vacationWeeks, setVacationWeeks] = useState<number>(4);
  const [weeklyHours, setWeeklyHours] = useState<number>(38);
  const [billablePercent, setBillablePercent] = useState<number>(65);

  const targetNetId = useId();
  const taxRateId = useId();
  const annualExpensesId = useId();
  const vacationWeeksId = useId();
  const weeklyHoursId = useId();
  const billablePercentId = useId();

  // Calculations
  const effectiveTaxFactor = Math.max(0.01, 1 - taxRate / 100);
  const grossIncomeNeeded = targetNetIncome / effectiveTaxFactor;
  const totalRevenueRequired = grossIncomeNeeded + annualExpenses;

  const billableWeeks = Math.max(1, 52 - vacationWeeks);
  const billableHoursPerWeek = (weeklyHours * billablePercent) / 100;
  const totalBillableHoursYear = billableWeeks * billableHoursPerWeek;

  const hourlyRate = totalBillableHoursYear > 0 ? Math.round(totalRevenueRequired / totalBillableHoursYear) : 0;
  const dayRate = Math.round(hourlyRate * (weeklyHours / 5));
  const monthlyRevenueTarget = Math.round(totalRevenueRequired / 12);
  const weeklyRevenueTarget = Math.round(totalRevenueRequired / billableWeeks);

  // Upwork leakage on this annual revenue
  const upworkLeakage = Math.round(totalRevenueRequired * 0.10);
  const upworkConnects = 360; // ~$30/mo in connects
  const totalUpworkLoss = upworkLeakage + upworkConnects;

  function resetDefaults() {
    setTargetNetIncome(85000);
    setTaxRate(25);
    setAnnualExpenses(7500);
    setVacationWeeks(4);
    setWeeklyHours(38);
    setBillablePercent(65);
  }

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
              onChange={(e) => setTargetNetIncome(Number(e.target.value) || 0)}
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
              onChange={(e) => setTaxRate(Number(e.target.value))}
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
                onChange={(e) => setAnnualExpenses(Number(e.target.value) || 0)}
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
              onChange={(e) => setVacationWeeks(Number(e.target.value))}
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
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
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
              onChange={(e) => setBillablePercent(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <p className="text-[11px] text-slate-500">{billableHoursPerWeek.toFixed(1)} billable hrs/wk.</p>
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
        <div className="rounded-3xl border border-red-200/80 bg-red-50/40 p-6">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>Marketplace Fee Leakage Alert</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-red-800/90">
            On Upwork or Fiverr, this revenue volume forfeits roughly <strong>${totalUpworkLoss.toLocaleString()}</strong> every year
            in commissions and tokens.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-3 border border-red-200/60 text-xs">
            <div>
              <span className="block font-bold text-navy">Annual Clivora Fee:</span>
              <span className="text-[11px] text-slate-500">$0 commission on deals</span>
            </div>
            <span className="font-display text-lg font-bold text-teal-700">$0</span>
          </div>
          <Link
            href="/compare/upwork"
            className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 underline"
          >
            See full Upwork vs Clivora mathematical breakdown ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
