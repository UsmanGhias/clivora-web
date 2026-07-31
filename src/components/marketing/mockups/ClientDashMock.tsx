import Link from "next/link";
import {
  Briefcase,
  FolderKanban,
  MessageSquare,
  Receipt,
  TrendingDown,
  Wallet,
} from "lucide-react";

function SpendChart() {
  const bars = [
    { month: "Jan", amount: 1.2, h: 36 },
    { month: "Feb", amount: 1.8, h: 52 },
    { month: "Mar", amount: 0.9, h: 28 },
    { month: "Apr", amount: 2.4, h: 70 },
    { month: "May", amount: 1.5, h: 44 },
    { month: "Jun", amount: 2.1, h: 62 },
  ];
  const peak = Math.max(...bars.map((b) => b.h));
  const chartH = 52;
  const labelY = 64;
  const colW = 176 / bars.length;

  return (
    <div className="flex h-full min-h-[72px] flex-col">
      <svg viewBox="0 0 176 68" className="h-full w-full flex-1" aria-hidden>
        {[12, 28, 44].map((y) => (
          <line key={y} x1="4" x2="172" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="2 3" />
        ))}
        {bars.map((b, i) => {
          const active = b.h === peak;
          const barH = (b.h / 76) * chartH;
          const x = i * colW + colW / 2 - 7;
          const y = chartH - barH + 4;
          return (
            <g key={b.month}>
              {active && (
                <text
                  x={i * colW + colW / 2}
                  y={Math.max(8, y - 4)}
                  textAnchor="middle"
                  className="fill-teal-700"
                  style={{ fontSize: 7, fontWeight: 700 }}
                >
                  ${b.amount.toFixed(1)}k
                </text>
              )}
              <rect
                x={x}
                y={y}
                width={14}
                height={Math.max(8, barH)}
                rx={2}
                fill={active ? "#0D9488" : "#E2E8F0"}
              />
              <text
                x={i * colW + colW / 2}
                y={labelY}
                textAnchor="middle"
                className="fill-slate-500"
                style={{ fontSize: 7, fontWeight: 600 }}
              >
                {b.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
}) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white px-2 py-1.5">
      <div className="flex items-center gap-1">
        <Icon className="h-2.5 w-2.5 shrink-0 text-teal-700" aria-hidden />
        <p className="truncate text-[8px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      </div>
      <p className="mt-0.5 font-display text-xs font-bold tabular-nums text-[#0F172A]">{value}</p>
    </div>
  );
}

function NavItem({
  label,
  href,
  active,
  badge,
}: {
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-md px-2 py-1.5 text-[9px] font-medium transition hover:bg-white/10 ${
        active ? "bg-white/12 text-white" : "text-white/60"
      }`}
    >
      <span className="truncate">{label}</span>
      {badge != null && (
        <span className="rounded bg-white/15 px-1.5 py-px text-[8px] font-bold text-white/90">{badge}</span>
      )}
    </Link>
  );
}

export function ClientDashMock({ compact = false }: { compact?: boolean }) {
  const projects = [
    { name: "E-commerce Revamp", pct: 55 },
    { name: "API Integration", pct: 80 },
    { name: "Content Portal", pct: 30 },
  ];
  const freelancers = [
    { name: "Sarah K.", rating: "4.9" },
    { name: "James L.", rating: "4.8" },
    { name: "Aisha M.", rating: "5.0" },
  ];

  return (
    <div
      className={`w-full max-w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.45)] ${compact ? "text-[95%]" : ""}`}
    >
      <div className={compact ? "flex min-h-[320px] sm:h-[380px]" : "flex min-h-[360px] sm:h-[480px]"}>
        <aside
          className={`hidden shrink-0 flex-col bg-[#0B1220] p-2.5 text-white sm:flex ${compact ? "w-[108px]" : "w-[132px]"}`}
        >
          <p className="font-display text-[11px] font-bold tracking-[0.04em]">CLIVORA</p>
          <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-teal-300/80">
            Client
          </p>
          <div className="mt-3 flex items-center gap-1.5 border-b border-white/10 pb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 text-[8px] font-bold">
              MA
            </span>
            <p className="truncate text-[9px] font-semibold">Muhammad A.</p>
          </div>
          <nav className="mt-2 space-y-0.5">
            <NavItem label="Dashboard" href="/login?next=/app" active />
            <NavItem label="Jobs" href="/login?next=/app/connect" badge={3} />
            <NavItem label="Projects" href="/login?next=/app/projects" badge={6} />
            <NavItem label="Proposals" href="/login?next=/app/proposals" badge={5} />
            <NavItem label="Messages" href="/login?next=/app/messages" badge={4} />
            <NavItem label="Payments" href="/login?next=/app/payments" />
            <NavItem label="Settings" href="/login?next=/app/settings" />
            <NavItem label="Profile" href="/login?next=/app/account" />
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden bg-[#F4F7F6] p-2.5">
          <p className="font-display text-[11px] font-bold text-[#0F172A]">Good afternoon, Muhammad</p>
          <p className="text-[9px] text-slate-500">Hiring workspace · live invoice totals</p>

          <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Open jobs" value="3" icon={Briefcase} />
            <Stat label="Projects" value="6" icon={FolderKanban} />
            <Stat label="Proposals" value="5" icon={Receipt} />
            <Stat label="Messages" value="4" icon={MessageSquare} />
            <Stat label="Spent" value="$6,420" icon={Wallet} />
          </div>

          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-5">
            <div className="rounded-lg border border-slate-200/80 bg-white p-2 sm:col-span-3">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-teal-700" aria-hidden />
                  <div>
                    <p className="text-[9px] font-bold text-[#0F172A]">Spending</p>
                    <p className="text-[8px] text-slate-500">Invoice totals by month</p>
                  </div>
                </div>
                <span className="text-[8px] font-semibold tabular-nums text-teal-700">Peak $2.4k Apr</span>
              </div>
              <div className="mt-1.5 h-[78px]">
                <SpendChart />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-white p-2 sm:col-span-2">
              <p className="text-[9px] font-bold text-[#0F172A]">Active projects</p>
              <ul className="mt-2 space-y-2">
                {projects.map((p) => (
                  <li key={p.name}>
                    <div className="flex justify-between gap-2 text-[8px]">
                      <span className="truncate text-slate-600">{p.name}</span>
                      <span className="shrink-0 font-bold tabular-nums text-[#0F172A]">{p.pct}%</span>
                    </div>
                    <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-slate-500 to-teal-600"
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-slate-200/80 bg-white p-2">
            <p className="text-[9px] font-bold text-[#0F172A]">Trusted freelancers</p>
            <ul className="mt-1.5 divide-y divide-slate-100">
              {freelancers.map((f) => (
                <li key={f.name} className="flex items-center justify-between gap-2 py-1.5 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[7px] font-bold text-white">
                      {f.name[0]}
                    </span>
                    <span className="truncate text-[8px] font-medium text-slate-700">{f.name}</span>
                  </div>
                  <span className="flex shrink-0 items-center gap-0.5 text-[8px] font-bold tabular-nums text-amber-600">
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-current" aria-hidden>
                      <path d="M6 1l1.5 3.5L11 5l-2.5 2.5.6 3.5L6 9.5 4.9 11l.6-3.5L3 5l3.5-.5z" />
                    </svg>
                    {f.rating}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
