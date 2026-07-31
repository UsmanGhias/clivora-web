function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[158px] rounded-[24px] border-[3px] border-[#1E293B] bg-[#1E293B] p-1 shadow-xl shadow-slate-400/30">
        <div className="absolute left-1/2 top-1.5 z-10 h-3 w-14 -translate-x-1/2 rounded-full bg-[#0F172A]" />
        <div className="overflow-hidden rounded-[18px] bg-[#F1F5F9]">
          <div className="flex items-center justify-between bg-white px-3 pb-1 pt-5">
            <span className="text-[8px] font-semibold text-[#0F172A]">9:41</span>
            <div className="flex gap-0.5">
              <span className="h-1.5 w-2.5 rounded-sm bg-[#0F172A]" />
              <span className="h-1.5 w-2 rounded-sm bg-[#0F172A]" />
            </div>
          </div>
          {children}
        </div>
        <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-slate-600" />
      </div>
      <p className="mt-2 text-[9px] font-medium text-[#475569]">{label}</p>
    </div>
  );
}

function IconHome({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="mx-auto h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M2.5 7.5 8 3l5.5 4.5V13a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V7.5Z" className={active ? "fill-current/20" : ""} />
    </svg>
  );
}

function IconBrief({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="mx-auto h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2.5" y="5" width="11" height="8" rx="1.5" className={active ? "fill-current/20" : ""} />
      <path d="M6 5V4a2 2 0 0 1 4 0v1" />
    </svg>
  );
}

function IconMsg({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="mx-auto h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 4.5h10v7H7l-3 2v-2H3v-7Z" className={active ? "fill-current/20" : ""} />
    </svg>
  );
}

function IconGrid({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="mx-auto h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" className={active ? "fill-current/20" : ""} />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg viewBox="0 0 16 16" className="mx-auto h-3 w-3" fill="currentColor" aria-hidden>
      <circle cx="4" cy="8" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="12" cy="8" r="1.2" />
    </svg>
  );
}

function IconUsers({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="mx-auto h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="6" cy="5.5" r="2" className={active ? "fill-current/20" : ""} />
      <path d="M2.5 13c0-2 1.6-3.5 3.5-3.5s3.5 1.5 3.5 3.5" />
      <circle cx="11" cy="6" r="1.5" />
      <path d="M13.5 13c0-1.5-1-2.7-2.5-3" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg viewBox="0 0 16 16" className="mx-auto h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="4" width="12" height="9" rx="1.5" />
      <path d="M2 7h12" />
      <circle cx="11" cy="10" r="0.9" fill="currentColor" />
    </svg>
  );
}

function HubTileIcon({ title }: { title: string }) {
  const common = "h-3 w-3";
  switch (title) {
    case "Reports":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M3 13V7M7 13V3M11 13V9" />
        </svg>
      );
    case "Analytics":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M2.5 11.5 6 7.5l3 2.5 4.5-5.5" />
        </svg>
      );
    case "Expenses":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="8" cy="8" r="5" />
          <path d="M8 5v6M6.5 6.5h2.2a1.3 1.3 0 0 1 0 2.6H6.5" />
        </svg>
      );
    case "Contracts":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M4 2.5h6l2.5 2.5V13.5H4z" />
          <path d="M10 2.5V5h2.5M6 8h4M6 10.5h3" />
        </svg>
      );
    case "AI Tools":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M8 2.5 9 6l3.5 1L9 8l-1 3.5L7 8 3.5 7 7 6z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M3 5h10M5 3v10M11 3v10M3 11h10" />
        </svg>
      );
  }
}

function DashboardPhone() {
  return (
    <div className="px-2 pb-2 pt-1">
      <div className="flex items-center gap-1.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0D9488] text-[8px] font-bold text-white">
          U
        </span>
        <div>
          <p className="text-[8px] font-bold text-[#0F172A]">Good morning, Usman</p>
          <span className="rounded bg-teal-50 px-1 text-[6px] font-bold text-[#0D9488]">Pro Plus</span>
        </div>
      </div>
      <div className="mt-2 rounded-lg border border-slate-200 bg-white p-1.5">
        <div className="flex items-center justify-between">
          <p className="text-[7px] font-semibold text-[#0F172A]">Profile 100%</p>
          <span className="text-[6px] text-emerald-600">All set</span>
        </div>
        <div className="mt-1 h-1 rounded-full bg-slate-100">
          <div className="h-1 w-full rounded-full bg-[#0D9488]" />
        </div>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1">
        {[
          { l: "Earnings", v: "$4,180", c: "text-emerald-600", t: "+12%" },
          { l: "Projects", v: "6", c: "text-violet-600", t: "4 active" },
          { l: "Proposals", v: "5", c: "text-orange-600", t: "Pending" },
          { l: "Messages", v: "4", c: "text-sky-600", t: "Unread" },
        ].map((s) => (
          <div key={s.l} className="rounded-lg border border-slate-200 bg-white p-1.5">
            <p className="text-[6px] text-[#64748B]">{s.l}</p>
            <p className="text-[9px] font-bold text-[#0F172A]">{s.v}</p>
            <p className={`text-[6px] font-semibold ${s.c}`}>{s.t}</p>
          </div>
        ))}
      </div>
      <div className="mt-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
        <div className="flex items-center justify-between">
          <p className="text-[7px] font-semibold text-[#0F172A]">Earnings overview</p>
          <span className="text-[6px] font-bold text-[#0D9488]">$6.2k Jun</span>
        </div>
        <svg viewBox="0 0 120 36" className="mt-1 h-9 w-full" aria-hidden>
          {[10, 20, 28].map((y) => (
            <line key={y} x1="4" x2="116" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="2 2" />
          ))}
          <polyline
            fill="none"
            stroke="#0D9488"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="10,26 30,22 50,18 70,12 90,14 110,8"
          />
          <circle cx="110" cy="8" r="2.2" fill="#0D9488" />
          {["J", "F", "M", "A", "M", "J"].map((m, i) => (
            <text
              key={m + i}
              x={10 + i * 20}
              y={34}
              textAnchor="middle"
              fill="#94A3B8"
              style={{ fontSize: 5, fontWeight: 600 }}
            >
              {m}
            </text>
          ))}
        </svg>
      </div>
      <div className="mt-1.5 flex justify-around rounded-xl bg-[#0F172A] px-1 py-1">
        {[
          { t: "Home", Icon: IconHome, active: true },
          { t: "Jobs", Icon: IconBrief },
          { t: "Msgs", Icon: IconMsg },
          { t: "Hub", Icon: IconGrid },
          { t: "More", Icon: IconMore },
        ].map(({ t, Icon, active }) => (
          <span
            key={t}
            className={`flex flex-col items-center gap-0.5 text-[5px] font-semibold ${
              active ? "text-[#0D9488]" : "text-white/50"
            }`}
          >
            <Icon active={active} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function HubPhone() {
  return (
    <div className="px-2 pb-2 pt-1">
      <p className="text-[9px] font-bold text-[#0F172A]">Command Center</p>
      <p className="text-[6px] text-[#64748B]">All tools in one place</p>
      <div className="mt-2 grid grid-cols-2 gap-1">
        {[
          ["Reports", "bg-violet-50 text-violet-600"],
          ["Analytics", "bg-teal-50 text-teal-700"],
          ["Expenses", "bg-rose-50 text-rose-600"],
          ["Contracts", "bg-sky-50 text-sky-700"],
          ["AI Tools", "bg-teal-50 text-teal-700"],
          ["Workflows", "bg-amber-50 text-amber-700"],
        ].map(([title, tone]) => (
          <div key={title} className="rounded-lg border border-slate-200 bg-white p-1.5">
            <span className={`inline-flex h-5 w-5 items-center justify-center rounded ${tone}`}>
              <HubTileIcon title={title} />
            </span>
            <p className="mt-0.5 text-[7px] font-bold text-[#0F172A]">{title}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-around rounded-xl bg-[#0F172A] px-1 py-1">
        {[
          { t: "Home", Icon: IconHome },
          { t: "Clients", Icon: IconUsers },
          { t: "Hub", Icon: IconGrid, active: true },
          { t: "Billing", Icon: IconWallet },
          { t: "More", Icon: IconMore },
        ].map(({ t, Icon, active }) => (
          <span
            key={t}
            className={`flex flex-col items-center gap-0.5 text-[5px] font-semibold ${
              active ? "text-[#0D9488]" : "text-white/50"
            }`}
          >
            <Icon active={active} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MobileAppMocks() {
  return (
    <div className="flex w-full max-w-full items-start justify-center gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-6 shadow-lg shadow-slate-200/60">
      <PhoneFrame label="Freelancer Home">
        <DashboardPhone />
      </PhoneFrame>
      <PhoneFrame label="Command Center">
        <HubPhone />
      </PhoneFrame>
    </div>
  );
}
