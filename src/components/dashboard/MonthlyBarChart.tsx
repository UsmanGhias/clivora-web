"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DEMO = [
  { month: "Feb", amount: 2800 },
  { month: "Mar", amount: 3200 },
  { month: "Apr", amount: 4100 },
  { month: "May", amount: 4750 },
  { month: "Jun", amount: 5200 },
  { month: "Jul", amount: 6100 },
];

export function MonthlyBarChart({ total }: { total: number }) {
  const isEmpty = total === 0;
  const data = isEmpty
    ? DEMO.map((d) => ({ ...d, amount: 0 }))
    : DEMO.map((d) => ({
        ...d,
        amount: Math.round((d.amount / 6100) * Math.max(total / 6, 400)),
      }));

  return (
    <div className="relative h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}`, "Earnings"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
          />
          <Bar dataKey="amount" fill={isEmpty ? "#E2E8F0" : "#0D9488"} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="rounded-lg border border-dashed border-border bg-surface/90 px-4 py-2 text-sm font-semibold text-text-secondary">
            No data yet
          </p>
        </div>
      )}
    </div>
  );
}
