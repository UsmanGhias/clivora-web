function LineChart() {
  const pts = "4,52 28,44 52,38 76,28 100,22 124,18 148,12 172,8";
  return (
    <svg viewBox="0 0 176 60" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="wsFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D9488" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="url(#wsFill)" points={`${pts} 172,60 4,60`} />
      <polyline fill="none" stroke="#0D9488" strokeWidth="2" points={pts} strokeLinecap="round" />
    </svg>
  );
}

function Donut() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#E2E8F0" strokeWidth="8" />
      <circle
        cx="32"
        cy="32"
        r="24"
        fill="none"
        stroke="#0D9488"
        strokeWidth="8"
        strokeDasharray="100 51"
        transform="rotate(-90 32 32)"
      />
      <circle
        cx="32"
        cy="32"
        r="24"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="8"
        strokeDasharray="35 116"
        strokeDashoffset="-100"
        transform="rotate(-90 32 32)"
      />
    </svg>
  );
}

/** Rich freelancer workspace desktop mock (workspace section). */
export function WorkspaceDesktopMock() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="flex h-[440px]">
        <aside className="flex w-[118px] shrink-0 flex-col bg-[#0F172A] p-2 text-white">
          <p className="text-[9px] font-black">CLIVORA</p>
          <nav className="mt-3 space-y-0.5 text-[8px]">
            {["Dashboard", "Projects", "Proposals", "Invoices", "Clients", "Time", "Messages"].map(
              (l, i) => (
                <div
                  key={l}
                  className={`rounded-md px-1.5 py-1 ${i === 0 ? "bg-[#0D9488]/25 text-white" : "text-white/55"}`}
                >
                  {l}
                </div>
              ),
            )}
          </nav>
          <div className="mt-auto rounded-lg bg-white/10 p-1.5">
            <p className="text-[7px] font-bold text-amber-300">Pro Plus</p>
            <p className="text-[6px] text-white/60">Upgrade for unlimited</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden bg-[#F8FAFC] p-2">
          <p className="text-[10px] font-bold text-navy">Good morning, Usman!</p>
          <div className="mt-1.5 grid grid-cols-4 gap-1">
            {[
              ["Earnings", "$24,560"],
              ["Projects", "6"],
              ["Proposals", "5"],
              ["Messages", "4"],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg border border-slate-200 bg-white p-1.5">
                <p className="text-[7px] text-slate-500">{l}</p>
                <p className="text-[9px] font-bold text-navy">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-1.5 grid grid-cols-3 gap-1">
            <div className="col-span-2 rounded-lg border border-slate-200 bg-white p-1.5">
              <p className="text-[8px] font-semibold text-navy">Earnings Overview</p>
              <div className="mt-1 h-12">
                <LineChart />
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-1.5">
              <p className="text-[8px] font-semibold text-navy">Invoices</p>
              <div className="mt-1 flex justify-center">
                <Donut />
              </div>
            </div>
          </div>

          <div className="mt-1.5 grid grid-cols-2 gap-1">
            <div className="rounded-lg border border-slate-200 bg-white p-1.5">
              <p className="text-[8px] font-semibold text-navy">Active Projects</p>
              {["SaaS Dashboard", "Mobile UI", "Brand Kit"].map((p, i) => (
                <div key={p} className="mt-1">
                  <div className="flex justify-between text-[7px]">
                    <span className="text-slate-500">{p}</span>
                    <span className="font-semibold">{[72, 45, 90][i]}%</span>
                  </div>
                  <div className="mt-0.5 h-0.5 rounded-full bg-slate-100">
                    <div className="h-0.5 rounded-full bg-primary" style={{ width: `${[72, 45, 90][i]}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-1.5">
              <p className="text-[8px] font-semibold text-navy">Recent Activity</p>
              <ul className="mt-1 space-y-1 text-[7px] text-slate-500">
                <li>Invoice #214 paid</li>
                <li>Proposal sent to Nova Labs</li>
                <li>Project milestone completed</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
