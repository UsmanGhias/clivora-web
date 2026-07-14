"use client";

import { Briefcase, Check, UserRound } from "lucide-react";
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";

const FLOATING = marketing.socialProof.floatingStats;

const AVATARS = [
  { initials: "AR", bg: "bg-violet-500" },
  { initials: "FA", bg: "bg-teal-500" },
  { initials: "UK", bg: "bg-sky-500" },
];

const FLAGS = ["🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇩🇪"];

function Sparkline({ tone }: { tone: "emerald" | "violet" }) {
  const stroke = tone === "emerald" ? "#10B981" : "#8B5CF6";
  return (
    <svg viewBox="0 0 80 28" className="h-7 w-20" aria-hidden>
      <path
        d="M2 22 C12 20, 18 8, 28 12 S42 24, 52 10 S68 4, 78 8"
        fill="none"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="78" cy="8" r="2.5" fill={stroke} />
    </svg>
  );
}

function DottedGlobe() {
  const dots: { x: number; y: number; o: number }[] = [];
  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < 28; col++) {
      const nx = (col - 13.5) / 13.5;
      const ny = (row - 8.5) / 8.5;
      if (nx * nx + ny * ny > 1) continue;
      dots.push({
        x: 50 + nx * 42,
        y: 50 + ny * 42,
        o: 0.18 + (1 - Math.abs(nx)) * 0.35,
      });
    }
  }

  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="globeGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(13,148,136,0.12)" />
          <stop offset="70%" stopColor="rgba(13,148,136,0.03)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#globeGlow)" />
      <ellipse
        cx="50"
        cy="50"
        rx="44"
        ry="44"
        fill="none"
        stroke="rgba(148,163,184,0.25)"
        strokeWidth="0.4"
        strokeDasharray="1.5 2"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="44"
        ry="18"
        fill="none"
        stroke="rgba(148,163,184,0.2)"
        strokeWidth="0.35"
        strokeDasharray="1.2 2.2"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="18"
        ry="44"
        fill="none"
        stroke="rgba(148,163,184,0.18)"
        strokeWidth="0.35"
        strokeDasharray="1.2 2.2"
      />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="0.55" fill={`rgba(100,116,139,${d.o})`} />
      ))}
      {/* Orbit nodes */}
      <circle cx="18" cy="32" r="3.2" fill="#ECFDF5" stroke="#10B981" strokeWidth="0.6" />
      <circle cx="82" cy="28" r="3.2" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="0.6" />
      <circle cx="78" cy="72" r="3.2" fill="#FFF7ED" stroke="#F97316" strokeWidth="0.6" />
      <path
        d="M22 34 Q40 20 48 42"
        fill="none"
        stroke="rgba(148,163,184,0.45)"
        strokeWidth="0.45"
        strokeDasharray="1.5 1.5"
      />
      <path
        d="M78 32 Q62 40 54 48"
        fill="none"
        stroke="rgba(148,163,184,0.4)"
        strokeWidth="0.45"
        strokeDasharray="1.5 1.5"
      />
      <path
        d="M74 70 Q60 62 52 54"
        fill="none"
        stroke="rgba(148,163,184,0.4)"
        strokeWidth="0.45"
        strokeDasharray="1.5 1.5"
      />
    </svg>
  );
}

function OrbitNode({
  className,
  tone,
  children,
}: {
  className?: string;
  tone: "green" | "violet" | "orange";
  children: React.ReactNode;
}) {
  const tones = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-600",
    violet: "border-violet-200 bg-violet-50 text-violet-600",
    orange: "border-orange-200 bg-orange-50 text-orange-600",
  };
  return (
    <span
      className={cn(
        "absolute z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TrustedNetworkMock() {
  const freelancers = FLOATING.find((s) => s.label.toLowerCase().includes("freelancer")) ?? FLOATING[0];
  const projects = FLOATING.find((s) => s.label.toLowerCase().includes("project")) ?? FLOATING[1];
  const paid = FLOATING.find((s) => s.label.toLowerCase().includes("paid")) ?? FLOATING[2];
  const countries = FLOATING.find((s) => s.label.toLowerCase().includes("countr")) ?? FLOATING[3];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] sm:aspect-[1/1.02]">
      <div className="absolute inset-[8%] sm:inset-[6%]">
        <DottedGlobe />
      </div>

      <OrbitNode className="left-[6%] top-[28%] hidden sm:flex" tone="green">
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </OrbitNode>
      <OrbitNode className="right-[8%] top-[22%] hidden sm:flex" tone="violet">
        <UserRound className="h-3.5 w-3.5" />
      </OrbitNode>
      <OrbitNode className="bottom-[30%] right-[4%] hidden sm:flex" tone="orange">
        <Briefcase className="h-3.5 w-3.5" />
      </OrbitNode>

      {/* Active Freelancers — top */}
      <div className="absolute left-1/2 top-0 z-20 w-[min(100%,240px)] -translate-x-1/2 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-lg shadow-slate-200/70 backdrop-blur-sm sm:left-[12%] sm:top-[4%] sm:w-[220px] sm:translate-x-0">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {AVATARS.map((a) => (
              <span
                key={a.initials}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white",
                  a.bg,
                )}
              >
                {a.initials}
              </span>
            ))}
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-extrabold text-white shadow-md shadow-primary/30">
            {freelancers.value}
          </span>
        </div>
        <p className="mt-2 text-xs font-bold text-navy">{freelancers.label}</p>
        <p className="text-[10px] text-slate-500">{freelancers.hint}</p>
      </div>

      {/* Projects Completed — mid left */}
      <div className="absolute left-0 top-[38%] z-20 w-[min(48%,170px)] rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-lg shadow-slate-200/70 backdrop-blur-sm sm:left-0 sm:w-[168px]">
        <p className="font-display text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
          {projects.value}
        </p>
        <Sparkline tone="emerald" />
        <p className="mt-1 text-[10px] font-semibold text-emerald-600">{projects.hint}</p>
        <p className="text-[10px] font-medium text-slate-500">{projects.label}</p>
      </div>

      {/* Countries — mid right */}
      <div className="absolute right-0 top-[36%] z-20 w-[min(48%,170px)] rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-lg shadow-slate-200/70 backdrop-blur-sm sm:right-0 sm:w-[168px]">
        <p className="font-display text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
          {countries.value}
        </p>
        <div className="mt-1.5 flex items-center -space-x-1.5">
          {FLAGS.map((f) => (
            <span
              key={f}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-slate-50 text-[11px] shadow-sm"
            >
              {f}
            </span>
          ))}
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[9px] font-bold text-slate-500">
            +
          </span>
        </div>
        <p className="mt-2 text-[10px] font-bold text-navy">{countries.label}</p>
        <p className="text-[10px] text-slate-500">{countries.hint}</p>
      </div>

      {/* Total Paid — bottom */}
      <div className="absolute bottom-0 left-1/2 z-20 w-[min(92%,260px)] -translate-x-1/2 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl shadow-slate-200/80 backdrop-blur-sm sm:bottom-[2%] sm:w-[240px]">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight text-navy">
              {paid.value}
            </p>
            <p className="mt-0.5 text-[10px] font-bold text-navy">{paid.label}</p>
            <p className="text-[10px] font-semibold text-primary">{paid.hint}</p>
          </div>
          <Sparkline tone="violet" />
        </div>
      </div>
    </div>
  );
}
