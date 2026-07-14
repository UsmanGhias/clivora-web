function LineChart({ stroke = "#0D9488" }: { stroke?: string }) {
  const pts = "4,52 28,44 52,38 76,28 100,22 124,18 148,12 172,8";
  return (
    <svg viewBox="0 0 176 60" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="earnFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="url(#earnFill)" points={`${pts} 172,60 4,60`} />
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={pts} strokeLinecap="round" />
    </svg>
  );
}

function Stat({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="rounded-[10px] border border-slate-200 bg-white p-2 shadow-sm">
      <p className="text-[9px] font-medium text-[#475569]">{label}</p>
      <p className="mt-0.5 text-xs font-bold text-[#0F172A]">{value}</p>
      {trend && <p className="mt-0.5 text-[9px] font-semibold text-emerald-600">{trend}</p>}
    </div>
  );
}

function NavItem({ label, active, badge }: { label: string; active?: boolean; badge?: number }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-[9px] font-medium ${
        active ? "border-l-2 border-[#0D9488] bg-[#0D9488]/20 text-white" : "text-white/65"
      }`}
    >
      <span className="truncate">{label}</span>
      {badge != null && (
        <span className="rounded-full bg-[#0D9488] px-1.5 py-px text-[8px] font-bold text-white">{badge}</span>
      )}
    </div>
  );
}

export function FreelancerDashMock({ compact = false }: { compact?: boolean }) {
  const projects = [
    { name: "SaaS Dashboard", pct: 72 },
    { name: "Mobile App UI", pct: 45 },
    { name: "Brand Identity", pct: 90 },
  ];
  const clients = [
    { name: "Acme Corp", spend: "$8,400" },
    { name: "Nova Labs", spend: "$5,200" },
    { name: "Pixel Co", spend: "$3,100" },
  ];

  return (
    <div className={`w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 ${compact ? "text-[95%]" : ""}`}>
      <div className={compact ? "flex h-[380px]" : "flex h-[480px]"}>
        <aside className={`flex shrink-0 flex-col bg-[#0F172A] p-2.5 text-white ${compact ? "w-[108px]" : "w-[132px]"}`}>
          <p className="text-[10px] font-black tracking-wide">CLIVORA</p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0D9488] text-[8px] font-bold">UG</span>
            <div className="min-w-0">
              <p className="truncate text-[9px] font-semibold">Usman Ghias</p>
              <span className="rounded bg-amber-400/90 px-1 py-px text-[7px] font-bold text-[#0F172A]">Pro Plus</span>
            </div>
          </div>
          <nav className="mt-3 space-y-0.5">
            <NavItem label="Dashboard" active />
            <NavItem label="Projects" badge={6} />
            <NavItem label="Proposals" badge={5} />
            <NavItem label="Messages" badge={4} />
            <NavItem label="Earnings" />
            <NavItem label="Connect" />
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden bg-[#F8FAFC] p-2.5">
          <p className="text-[10px] font-bold text-[#0F172A]">Good morning, Usman!</p>
          <p className="text-[9px] text-[#475569]">Here&apos;s your freelance overview.</p>

          <div className="mt-2 grid grid-cols-4 gap-1.5">
            <Stat label="Total Earnings" value="$24,560" trend={compact ? undefined : "+12.4%"} />
            <Stat label="Active Projects" value="6" />
            <Stat label="Pending Proposals" value="5" />
            <Stat label="Unread Messages" value="4" />
          </div>

          <div className="mt-2 grid grid-cols-5 gap-1.5">
            <div className="col-span-3 rounded-[12px] border border-slate-200 bg-white p-2 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold text-[#0F172A]">Earnings</p>
                <span className="text-[8px] text-[#475569]">Last 6 months</span>
              </div>
              <div className="mt-1 h-14"><LineChart /></div>
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
                      <div className="h-1 rounded-full bg-[#0D9488]" style={{ width: `${p.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-2 rounded-[12px] border border-slate-200 bg-white p-2 shadow-sm">
            <p className="text-[9px] font-semibold text-[#0F172A]">Top Clients</p>
            <ul className="mt-1.5 space-y-1">
              {clients.map((c, i) => (
                <li key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[7px] font-bold text-[#475569]">
                      {c.name[0]}
                    </span>
                    <span className="text-[8px] text-[#475569]">{c.name}</span>
                  </div>
                  <span className="text-[8px] font-semibold text-[#0F172A]">{c.spend}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
