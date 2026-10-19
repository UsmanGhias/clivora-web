"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2, ShieldCheck } from "lucide-react";

export function CommissionSavingsCalculator() {
  const [monthlyEarnings, setMonthlyEarnings] = useState<number>(5000);

  // Upwork: ~10% freelancer fee + 5% client transaction fee
  const upworkFreelancerFee = monthlyEarnings * 0.10;
  const upworkAnnualLoss = upworkFreelancerFee * 12;

  // Fiverr: 20% seller fee
  const fiverrFreelancerFee = monthlyEarnings * 0.20;
  const fiverrAnnualLoss = fiverrFreelancerFee * 12;

  // Clivora: $0 platform fee on deals (optional $19/mo Pro Plus)
  const clivoraDealFee = 0;
  const clivoraAnnualSavings = upworkAnnualLoss;

  const presets = [2500, 5000, 10000, 20000];

  return (
    <section className="border-t border-slate-200/80 bg-gradient-to-b from-[#F8FAFC] to-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-800">
            <Calculator className="h-3.5 w-3.5 text-teal-600" />
            <span>Interactive Fee Calculator</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Calculate your annual marketplace savings
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Legacy platforms extract 10% to 20% from every contract you deliver. See how much money stays in your account with Clivora&apos;s 0% deal fee.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-10">
          {/* Slider & Presets */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="earnings-slider" className="text-sm font-bold text-navy">
                Your Monthly Contract Billing:
              </label>
              <div className="text-2xl font-extrabold text-teal-700">
                ${monthlyEarnings.toLocaleString()} <span className="text-sm font-semibold text-slate-500">/ month</span>
              </div>
            </div>

            <input
              id="earnings-slider"
              type="range"
              min="1000"
              max="30000"
              step="500"
              value={monthlyEarnings}
              onChange={(e) => setMonthlyEarnings(Number(e.target.value))}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-600"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-500 self-center mr-1">Quick Select:</span>
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMonthlyEarnings(preset)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    monthlyEarnings === preset
                      ? "bg-teal-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  ${preset.toLocaleString()}/mo
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upwork Loss */}
            <div className="rounded-2xl border border-red-200/70 bg-red-50/40 p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-red-700">Upwork Cut (10%)</div>
              <div className="mt-2 text-2xl font-black text-red-900">
                -${upworkFreelancerFee.toLocaleString()}
                <span className="text-xs font-semibold text-red-600"> /mo</span>
              </div>
              <p className="mt-1 text-xs text-red-700/80">
                You lose <strong className="font-bold text-red-900">${upworkAnnualLoss.toLocaleString()}</strong> every year just in platform fees.
              </p>
            </div>

            {/* Fiverr Loss */}
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Fiverr Cut (20%)</div>
              <div className="mt-2 text-2xl font-black text-amber-950">
                -${fiverrFreelancerFee.toLocaleString()}
                <span className="text-xs font-semibold text-amber-700"> /mo</span>
              </div>
              <p className="mt-1 text-xs text-amber-800/80">
                You surrender <strong className="font-bold text-amber-950">${fiverrAnnualLoss.toLocaleString()}</strong> per year on full delivery.
              </p>
            </div>

            {/* Clivora Kept */}
            <div className="rounded-2xl border-2 border-teal-600 bg-teal-50/50 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-teal-900">Clivora (0% Fee)</div>
                <span className="rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                  100% Kept
                </span>
              </div>
              <div className="mt-2 text-2xl font-black text-teal-800">
                ${clivoraDealFee}
                <span className="text-xs font-semibold text-teal-700"> deal fee</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-teal-900">
                Keep <strong className="font-extrabold text-teal-950">+${clivoraAnnualSavings.toLocaleString()}</strong> extra in your pocket annually.
              </p>
            </div>
          </div>

          {/* Value Props & CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 text-teal-800">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span>Zero commission on client invoices</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-800">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span>White-label client portal included</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-800">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span>Stripe & Safepay milestone escrow</span>
              </div>
            </div>

            <Link
              href="/signup?role=freelancer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-teal-900/10 hover:bg-teal-800 transition"
            >
              <span>Keep 100% Of Your Pay</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
