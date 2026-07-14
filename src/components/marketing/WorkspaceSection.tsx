"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  FileText,
  FolderKanban,
  MessageSquare,
  Receipt,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";
import { MobileAppMocks } from "./mockups/MobileAppMocks";
import { WorkspaceDesktopMock } from "./mockups/WorkspaceDesktopMock";

const featureIcons = [
  FolderKanban,
  Receipt,
  Timer,
  MessageSquare,
  Users,
  Bot,
  FileText,
  BarChart3,
];

const toneBg: Record<string, string> = {
  teal: "bg-teal-50 text-teal-700",
  violet: "bg-violet-50 text-violet-600",
  orange: "bg-orange-50 text-orange-600",
  blue: "bg-sky-50 text-sky-600",
  green: "bg-emerald-50 text-emerald-600",
  indigo: "bg-indigo-50 text-indigo-600",
  pink: "bg-pink-50 text-pink-600",
  amber: "bg-amber-50 text-amber-600",
};

const stepTones = ["teal", "violet", "orange", "amber", "green", "blue", "pink"] as const;

export function WorkspaceSection() {
  const w = marketing.workspace;

  return (
    <section id="workspace" className="border-b border-slate-200/80 bg-[#F8FAFC] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Freelancer workspace</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
            {w.headline[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {w.headline[1]}
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{w.body}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/50 sm:p-6">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                <Zap className="h-3 w-3" />
                All-in-one freelance OS
              </span>
              <h3 className="mt-3 font-display text-xl font-extrabold text-navy sm:text-2xl">
                {w.headline[0]} {w.headline[1]}
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {w.features.map((f, i) => {
                  const Icon = featureIcons[i] ?? FolderKanban;
                  const tone = stepTones[i % stepTones.length];
                  return (
                    <div
                      key={f.title}
                      className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 shadow-sm"
                    >
                      <span className={cn("inline-flex rounded-lg p-1.5", toneBg[tone])}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <p className="mt-2 text-xs font-bold text-navy">{f.title}</p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">{f.description}</p>
                    </div>
                  );
                })}
              </div>

              <Link
                href={w.cta.href}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-700"
              >
                {w.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <WorkspaceDesktopMock />
              <div className="pointer-events-none absolute -bottom-4 -right-2 hidden scale-[0.72] sm:block lg:-right-6">
                <MobileAppMocks />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="font-display text-xl font-extrabold text-navy sm:text-2xl">{w.workflow.title}</h3>
          <div className="relative mx-auto mt-8 max-w-5xl">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-slate-200 sm:block" aria-hidden />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {w.workflow.steps.map((step, i) => {
                const tone = stepTones[i % stepTones.length];
                return (
                  <div key={step.title} className="relative flex flex-col items-center text-center">
                    <span
                      className={cn(
                        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-sm",
                        toneBg[tone],
                      )}
                    >
                      {i + 1}
                    </span>
                    <p className="mt-2 text-xs font-bold text-navy">{step.title}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
