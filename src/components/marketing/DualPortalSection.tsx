"use client";

import { useState } from "react";
import {
  BarChart3,
  Bot,
  Briefcase,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Network,
  Settings2,
  Shield,
  Sparkles,
  Timer,
  UserRound,
  Wallet,
} from "lucide-react";
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";
import { DualPortalMock } from "./mockups/DualPortalMock";

const toneIconBg: Record<string, string> = {
  violet: "bg-violet-100 text-violet-600",
  green: "bg-emerald-100 text-emerald-600",
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-sky-100 text-sky-600",
  teal: "bg-teal-100 text-teal-700",
};

const leftIcons = [LayoutDashboard, FolderKanban, FileText];
const rightIcons = [MessageSquare, Network, Bot];
const stripIcons = [BarChart3, Wallet, FileText, Timer, Shield, Settings2];

export function DualPortalSection() {
  const d = marketing.dualPortal;
  const [tab, setTab] = useState<"freelancer" | "client">("freelancer");

  return (
    <section id="platform" className="relative overflow-hidden bg-[#F8FAFC] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {d.badge}
        </span>
        <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl">
          {d.headline[0]}{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            {d.headline[1]}
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">{d.body}</p>

        <div className="mt-8 flex w-full max-w-md mx-auto flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:inline-flex sm:w-auto sm:max-w-none sm:flex-row sm:rounded-full">
          {d.tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition sm:flex-none sm:rounded-full sm:py-2.5",
                tab === t.id
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-navy hover:bg-slate-50",
              )}
            >
              {t.id === "freelancer" ? (
                <UserRound className="h-4 w-4" />
              ) : (
                <Briefcase className="h-4 w-4" />
              )}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 hidden max-w-[1400px] items-stretch gap-4 px-5 lg:grid lg:grid-cols-[200px_minmax(0,1fr)_200px] lg:px-8 xl:gap-5">
        <div className="flex flex-col justify-center gap-3">
          {d.sideFeatures.left.map((f, i) => {
            const Icon = leftIcons[i] ?? LayoutDashboard;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"
              >
                <div className={cn("mb-2.5 inline-flex rounded-xl p-2", toneIconBg[f.tone])}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-navy">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="min-w-0">
          <DualPortalMock focus={tab} />
        </div>

        <div className="flex flex-col justify-center gap-3">
          {d.sideFeatures.right.map((f, i) => {
            const Icon = rightIcons[i] ?? MessageSquare;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"
              >
                <div className={cn("mb-2.5 inline-flex rounded-xl p-2", toneIconBg[f.tone])}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-navy">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl px-5 lg:hidden">
        <DualPortalMock focus={tab} />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[...d.sideFeatures.left, ...d.sideFeatures.right].map((f, i) => {
            const Icon = [...leftIcons, ...rightIcons][i] ?? LayoutDashboard;
            return (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className={cn("mb-2 inline-flex rounded-xl p-2", toneIconBg[f.tone])}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-navy">{f.title}</p>
                <p className="mt-1 text-xs text-slate-500">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-5 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:gap-x-0 sm:px-2">
          {d.bottomStrip.map((label, i) => {
            const Icon = stripIcons[i] ?? Settings2;
            return (
              <div
                key={label}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 sm:px-3.5"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="whitespace-nowrap">{label}</span>
                {i < d.bottomStrip.length - 1 && (
                  <span className="ml-3 hidden h-4 w-px bg-slate-200 sm:inline-block" aria-hidden />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-emerald-50/50 px-6 py-4 sm:flex-row">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
          <Sparkles className="h-4 w-4 text-primary" />
          {d.socialProof}
        </p>
        <span className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
          <span className="flex -space-x-2">
            {["UG", "MA", "SK", "NR", "RL"].map((c) => (
              <span
                key={c}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-500 bg-navy text-[8px] font-bold"
              >
                {c}
              </span>
            ))}
          </span>
          {d.activeUsers}
        </span>
      </div>
    </section>
  );
}
