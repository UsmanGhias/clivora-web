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
        <p className="text-[7px] font-semibold text-[#0F172A]">Earnings overview</p>
        <svg viewBox="0 0 120 28" className="mt-1 h-7 w-full" aria-hidden>
          <polyline fill="none" stroke="#0D9488" strokeWidth="1.5" points="4,22 24,18 44,16 64,10 84,12 104,6" />
        </svg>
      </div>
      <div className="mt-1.5 flex justify-around rounded-xl bg-[#0F172A] py-1.5">
        {["Home", "Jobs", "Proposals", "Msgs", "Menu"].map((t, i) => (
          <span key={t} className={`text-[5.5px] font-semibold ${i === 0 ? "text-[#0D9488]" : "text-white/50"}`}>
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
            <span className={`inline-flex rounded px-1 py-0.5 text-[6px] font-bold ${tone}`}>•</span>
            <p className="mt-0.5 text-[7px] font-bold text-[#0F172A]">{title}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-around rounded-xl bg-[#0F172A] py-1.5">
        {["Home", "Clients", "Hub", "Billing", "More"].map((t, i) => (
          <span key={t} className={`text-[5.5px] font-semibold ${i === 2 ? "text-[#0D9488]" : "text-white/50"}`}>
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
