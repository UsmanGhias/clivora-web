function SpendChart() {
  const bars = [42, 58, 36, 72, 48, 64];
  return (
    <svg viewBox="0 0 176 60" className="h-full w-full" aria-hidden>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={8 + i * 28}
          y={60 - h}
          width="18"
          height={h}
          rx="4"
          fill={i === 3 ? "#0D9488" : "#CBD5E1"}
        />
      ))}
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-slate-200 bg-white p-2 shadow-sm">
      <p className="text-[9px] font-medium text-[#475569]">{label}</p>
      <p className="mt-0.5 text-xs font-bold text-[#0F172A]">{value}</p>
    </div>
  );
}

function NavItem({ label, active, badge }: { label: string; active?: boolean; badge?: number }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-[9px] font-medium ${
        active ? "border-l-2 border-[#475569] bg-white/10 text-white" : "text-white/65"
      }`}
    >
      <span className="truncate">{label}</span>
      {badge != null && (
        <span className="rounded-full bg-[#475569] px-1.5 py-px text-[8px] font-bold text-white">{badge}</span>
      )}
    </div>
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
    <div className={`w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 ${compact ? "text-[95%]" : ""}`}>
      <div className={compact ? "flex h-[380px]" : "flex h-[480px]"}>
        <aside className={`flex shrink-0 flex-col bg-[#0F172A] p-2.5 text-white ${compact ? "w-[108px]" : "w-[132px]"}`}>
          <p className="text-[10px] font-black tracking-wide">CLIVORA</p>
          <p className="mt-1 text-[8px] font-semibold uppercase tracking-wider text-white/50">Client Portal</p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#475569] text-[8px] font-bold">MA</span>
            <p className="truncate text-[9px] font-semibold">Muhammad A.</p>
          </div>
          <nav className="mt-3 space-y-0.5">
            <NavItem label="Dashboard" active />
            <NavItem label="Jobs" badge={3} />
            <NavItem label="Projects" badge={6} />
            <NavItem label="Proposals" badge={5} />
            <NavItem label="Messages" badge={4} />
            <NavItem label="Payments" />
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden bg-[#F8FAFC] p-2.5">
          <p className="text-[10px] font-bold text-[#0F172A]">Good afternoon, Muhammad!</p>
          <p className="text-[9px] text-[#475569]">Your hiring workspace at a glance.</p>

          <div className="mt-2 grid grid-cols-5 gap-1.5">
            <Stat label="Open Jobs" value="3" />
            <Stat label="Active Projects" value="6" />
            <Stat label="Pending Proposals" value="5" />
            <Stat label="Unread Messages" value="4" />
            <Stat label="Total Spent" value="$6,420" />
          </div>

          <div className="mt-2 grid grid-cols-5 gap-1.5">
            <div className="col-span-3 rounded-[12px] border border-slate-200 bg-white p-2 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold text-[#0F172A]">Spending</p>
                <span className="text-[8px] text-[#475569]">Monthly</span>
              </div>
              <div className="mt-1 h-14"><SpendChart /></div>
            </div>

            <div className="col-span-2 rounded-[12px] border border-slate-200 bg-white p-2 shadow-sm">
              <p className="text-[9px] font-semibold text-[#0F172A]">Active Projects</p>
              <ul className="mt-1.5 space-y-1.5">
                {projects.map((p) => (
                  <li key={p.name}>
                    <div className="flex justify-between text-[8px]">
                      <span className="truncate text-[#475569]">{p.name}</span>
                      <span className="font-semibold text-[#0F172A]">{p.pct}%</span>
                    </div>
                    <div className="mt-0.5 h-1 rounded-full bg-slate-100">
                      <div className="h-1 rounded-full bg-[#475569]" style={{ width: `${p.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-2 rounded-[12px] border border-slate-200 bg-white p-2 shadow-sm">
            <p className="text-[9px] font-semibold text-[#0F172A]">Top Freelancers</p>
            <ul className="mt-1.5 space-y-1">
              {freelancers.map((f) => (
                <li key={f.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[7px] font-bold text-[#475569]">
                      {f.name[0]}
                    </span>
                    <span className="text-[8px] text-[#475569]">{f.name}</span>
                  </div>
                  <span className="flex items-center gap-0.5 text-[8px] font-semibold text-amber-500">
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
