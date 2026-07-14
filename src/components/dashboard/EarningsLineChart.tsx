"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const DEMO = [
  { day: "Jul 1", amount: 420 },
  { day: "Jul 5", amount: 680 },
  { day: "Jul 10", amount: 540 },
  { day: "Jul 15", amount: 920 },
  { day: "Jul 21", amount: 1150 },
  { day: "Jul 25", amount: 880 },
  { day: "Jul 31", amount: 1320 },
];

const EMPTY = DEMO.map((d) => ({ day: d.day, amount: 0, previous: 0 }));

export function EarningsLineChart({
  total,
  accent = "teal",
  title = "Earnings overview",
  trendLabel,
  summaryBoxes,
  showPreviousLegend,
}: {
  total: number;
  accent?: "teal" | "slate";
  title?: string;
  trendLabel?: string;
  summaryBoxes?: Array<{ label: string; value: string; tone: string }>;
  showPreviousLegend?: boolean;
}) {
  const stroke = accent === "slate" ? "#475569" : "#0D9488";
  const fill = stroke;
  const gradId = accent === "slate" ? "spendGrad" : "earnGrad";
  const isEmpty = total === 0;
  const scaled = isEmpty
    ? EMPTY
    : DEMO.map((d) => ({
        ...d,
        amount: Math.round((d.amount / 1320) * Math.max(total / 6, 200)),
        previous: Math.round((d.amount / 1320) * Math.max(total / 8, 150) * 0.72),
      }));

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">{title}</h2>
          <p className="mt-1 font-display text-2xl font-extrabold text-navy">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {trendLabel && (
            <p
              className={cn(
                "mt-1 text-xs font-semibold",
                accent === "slate" ? "text-client-accent" : "text-success",
              )}
            >
              {trendLabel}
            </p>
          )}
          {showPreviousLegend && !isEmpty && (
            <div className="mt-2 flex items-center gap-4 text-[11px] font-semibold text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: stroke }} />
                {title.includes("Spend") ? "Spending" : "Earnings"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Previous month
              </span>
            </div>
          )}
        </div>
        <select className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary">
          <option>This month</option>
          <option>Last month</option>
        </select>
      </div>
      <div className="relative h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={scaled}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fill} stopOpacity={isEmpty ? 0.08 : 0.35} />
                <stop offset="100%" stopColor={fill} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip
              formatter={(v, name) => [
                `$${Number(v ?? 0).toLocaleString()}`,
                name === "previous" ? "Previous" : title.includes("Spend") ? "Spend" : "Earnings",
              ]}
              contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
            />
            {showPreviousLegend && !isEmpty && (
              <Area
                type="monotone"
                dataKey="previous"
                stroke="#CBD5E1"
                strokeWidth={2}
                fill="transparent"
                dot={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="amount"
              stroke={isEmpty ? "#CBD5E1" : stroke}
              strokeWidth={2.5}
              strokeDasharray={isEmpty ? "6 4" : undefined}
              fill={`url(#${gradId})`}
              dot={isEmpty ? false : { r: 3, fill: stroke }}
              activeDot={isEmpty ? false : { r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="rounded-lg border border-dashed border-border bg-surface/90 px-4 py-2 text-sm font-semibold text-text-secondary">
              No data yet
            </p>
          </div>
        )}
      </div>
      {summaryBoxes && summaryBoxes.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {summaryBoxes.map((b) => (
            <div key={b.label} className={cn("rounded-xl px-3 py-2.5", b.tone)}>
              <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">{b.label}</p>
              <p className="mt-0.5 text-sm font-extrabold">{b.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
