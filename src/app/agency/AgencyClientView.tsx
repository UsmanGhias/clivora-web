"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, TrendingUp, DollarSign, Building2, ShieldCheck, ArrowRight, Layers, FileText, Users } from "lucide-react";

export function AgencyClientView() {
  const [monthlyBilling, setMonthlyBilling] = useState<number>(25000);

  const upworkLossMonthly = Math.round(monthlyBilling * 0.10);
  const upworkLossAnnual = upworkLossMonthly * 12;

  const fiverrLossMonthly = Math.round(monthlyBilling * 0.20);
  const fiverrLossAnnual = fiverrLossMonthly * 12;

  const clivoraPlatformFee = 0;
  const annualSavingsVsUpwork = upworkLossAnnual;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase">
          <Building2 className="w-3.5 h-3.5" />
          <span>Agency Operating System &middot; 0% Platform Commission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Keep 100% of your agency billing. Never surrender 10-20% to a platform.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Stop losing thousands of dollars every month on platform marketplace taxes. Clivora equips software studios, digital agencies, and boutique consultancies with branded client portals, milestone invoicing, and subcontracting rails with zero commission.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup?role=freelancer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 shadow-md transition-colors"
          >
            <span>Launch Free Agency Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#calculator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Calculate Fee Savings
          </a>
        </div>
      </div>

      {/* Interactive Fee Calculator */}
      <div id="calculator" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
        <div className="space-y-2 text-center pb-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Agency Marketplace Fee Elimination Calculator
          </h2>
          <p className="text-sm text-slate-500">
            See how much cash stays in your agency&apos;s treasury when you bill clients through Clivora vs legacy platforms.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="billing-slider" className="text-sm font-semibold text-slate-700">
                Estimated Monthly Agency Invoicing:
              </label>
              <span className="text-xl font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                ${monthlyBilling.toLocaleString()} / mo
              </span>
            </div>
            <input
              id="billing-slider"
              type="range"
              min="5000"
              max="150000"
              step="5000"
              value={monthlyBilling}
              onChange={(e) => setMonthlyBilling(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>$5,000/mo</span>
              <span>$50,000/mo</span>
              <span>$100,000/mo</span>
              <span>$150,000/mo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 space-y-1">
              <div className="text-xs font-bold uppercase text-rose-700">Upwork Loss (10%)</div>
              <div className="text-2xl font-black text-rose-900">-${upworkLossMonthly.toLocaleString()}</div>
              <div className="text-xs text-rose-600 font-medium">-${upworkLossAnnual.toLocaleString()} per year</div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <div className="text-xs font-bold uppercase text-amber-700">Fiverr Pro Loss (20%)</div>
              <div className="text-2xl font-black text-amber-900">-${fiverrLossMonthly.toLocaleString()}</div>
              <div className="text-xs text-amber-600 font-medium">-${fiverrLossAnnual.toLocaleString()} per year</div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 relative overflow-hidden">
              <div className="text-xs font-bold uppercase text-emerald-700">Clivora Take-Rate (0%)</div>
              <div className="text-2xl font-black text-emerald-900">$0 Platform Fee</div>
              <div className="text-xs text-emerald-700 font-semibold">
                You save +${annualSavingsVsUpwork.toLocaleString()}/yr
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Invoices settle directly into your business bank account, Wise, or Stripe.</span>
            </div>
            <Link
              href="/signup?role=freelancer"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0"
            >
              Start Billing with 0% Cut
            </Link>
          </div>
        </div>
      </div>

      {/* Core Agency Capabilities Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Engineered for high-volume agency operations
          </h2>
          <p className="text-sm text-slate-600">
            Everything your software squad needs to close, deliver, and get paid without platform friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Branded Client Portals</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Give your clients an executive review space. Clients track milestone deliverables, review code releases, approve phases, and download formal tax invoices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Milestone Escrow & Invoicing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Structure enterprise contracts into clear milestone stages. Support for multi-currency invoicing in USD, EUR, GBP, AED, and SAR with direct settlement.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Subcontractor Talent Sourcing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Scale your team when project loads spike. Access Clivora&apos;s verified remote job crawler and talent network indexing 7,150+ tech professionals worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Agency Testimonial / Proof */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Built by Agency Founders for Agency Founders</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            Proven at scale by CODCrafters
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            CODCrafters runs enterprise ERP implementations and distributed architectures across 25+ countries using Clivora&apos;s direct billing rails.
          </p>
        </div>
        <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            href="/signup?role=freelancer"
            className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm text-center hover:bg-slate-100 transition-colors"
          >
            Open Free Agency Account
          </Link>
          <a
            href="https://www.codcrafters.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm text-center hover:bg-white/20 transition-colors"
          >
            Visit CODCrafters
          </a>
        </div>
      </div>
    </div>
  );
}
