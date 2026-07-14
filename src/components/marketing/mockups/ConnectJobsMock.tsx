const SKILLS = ["React", "TypeScript", "Node.js", "Figma", "AWS", "Python"];

const CATEGORIES = ["All", "Development", "Design", "Marketing", "Writing"];

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`rounded-lg px-2 py-1.5 text-[9px] font-medium ${
        active ? "border-l-2 border-[#0D9488] bg-[#0D9488]/20 text-white" : "text-white/65"
      }`}
    >
      {label}
    </div>
  );
}

export function ConnectJobsMock() {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <div className="flex h-[460px]">
        <aside className="flex w-[120px] shrink-0 flex-col bg-[#0F172A] p-2.5 text-white">
          <p className="text-[9px] font-black tracking-wide">CLIVORA</p>
          <p className="text-[8px] font-bold text-[#0D9488]">CONNECT</p>
          <nav className="mt-4 space-y-0.5">
            <NavItem label="Find Jobs" active />
            <NavItem label="My Proposals" />
            <NavItem label="Saved Jobs" />
            <NavItem label="Profile" />
            <NavItem label="Messages" />
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC]">
          <div className="border-b border-slate-200 bg-white px-3 py-2">
            <div className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-2.5 py-1.5">
              <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0 text-[#475569]" aria-hidden>
                <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] text-[#475569]">Search jobs, skills, or keywords…</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {CATEGORIES.map((c, i) => (
                <span
                  key={c}
                  className={`rounded-full px-2 py-0.5 text-[8px] font-semibold ${
                    i === 0 ? "bg-[#0D9488] text-white" : "bg-white text-[#475569] ring-1 ring-slate-200"
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1 overflow-hidden p-2.5">
              <div className="rounded-[12px] border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded bg-amber-100 px-1.5 py-px text-[7px] font-bold uppercase text-amber-700">
                      Featured
                    </span>
                    <h3 className="mt-1 text-[11px] font-bold text-[#0F172A]">Build a Modern SaaS Dashboard</h3>
                    <p className="mt-1 text-[8px] leading-relaxed text-[#475569]">
                      React + TypeScript dashboard with analytics, billing, and team management modules.
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-[#0D9488]">$4,500</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {["React", "TypeScript", "Tailwind"].map((s) => (
                    <span key={s} className="rounded-md bg-slate-100 px-1.5 py-px text-[7px] font-medium text-[#475569]">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F172A] text-[7px] font-bold text-white">
                      N
                    </span>
                    <span className="text-[8px] text-[#475569]">Nova Labs · Posted 2d ago</span>
                  </div>
                  <span className="rounded-lg bg-[#0D9488] px-2 py-1 text-[8px] font-bold text-white">Apply</span>
                </div>
              </div>

              <div className="mt-2 rounded-[12px] border border-slate-200 bg-white p-2.5 opacity-70 shadow-sm">
                <p className="text-[10px] font-semibold text-[#0F172A]">Mobile App UI/UX Design</p>
                <p className="mt-0.5 text-[8px] text-[#475569]">Figma · 4 weeks · $2,800</p>
              </div>
            </div>

            <aside className="w-[100px] shrink-0 border-l border-slate-200 bg-white p-2">
              <p className="text-[9px] font-bold text-[#0F172A]">Top Skills</p>
              <ul className="mt-2 space-y-1.5">
                {SKILLS.map((s, i) => (
                  <li key={s} className="flex items-center justify-between text-[8px]">
                    <span className="text-[#475569]">{s}</span>
                    <span className="font-semibold text-[#0D9488]">{120 - i * 14}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
