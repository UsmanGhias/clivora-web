/** Client analytics-style preview for “Everything freelancers need” section. */
export function AnalyticsPreviewMock() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
      <div className="border-b border-slate-100 bg-[#F8FAFC] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0F172A]">Analytics overview</p>
            <p className="text-[11px] text-[#64748B]">Jul 1 – Jul 31, 2026</p>
          </div>
          <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#475569]">
            This month
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {[
          { label: "Revenue", value: "$4,180", trend: "+12.4%", tone: "text-emerald-600" },
          { label: "Billable hours", value: "68h", trend: "+6.1%", tone: "text-emerald-600" },
          { label: "Open invoices", value: "$1,100", trend: "2 pending", tone: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">{s.label}</p>
            <p className="mt-1 text-xl font-extrabold text-[#0F172A]">{s.value}</p>
            <p className={`mt-0.5 text-[11px] font-semibold ${s.tone}`}>{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 px-4 pb-4 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 p-3 lg:col-span-3">
          <p className="text-xs font-bold text-[#0F172A]">Revenue trend</p>
          <svg viewBox="0 0 360 120" className="mt-2 h-28 w-full" aria-hidden>
            <defs>
              <linearGradient id="anFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              fill="url(#anFill)"
              points="0,90 45,82 90,70 135,74 180,55 225,48 270,40 315,34 360,28 360,120 0,120"
            />
            <polyline
              fill="none"
              stroke="#0D9488"
              strokeWidth="2.5"
              strokeLinecap="round"
              points="0,90 45,82 90,70 135,74 180,55 225,48 270,40 315,34 360,28"
            />
          </svg>
        </div>
        <div className="rounded-xl border border-slate-200 p-3 lg:col-span-2">
          <p className="text-xs font-bold text-[#0F172A]">By category</p>
          <ul className="mt-3 space-y-2.5">
            {[
              ["Web development", "48%", "#0D9488"],
              ["Design", "27%", "#6366F1"],
              ["Consulting", "15%", "#F59E0B"],
              ["Other", "10%", "#94A3B8"],
            ].map(([name, pct, color]) => (
              <li key={String(name)}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-[#64748B]">{name}</span>
                  <span className="font-bold text-[#0F172A]">{pct}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full" style={{ width: String(pct), background: String(color) }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
