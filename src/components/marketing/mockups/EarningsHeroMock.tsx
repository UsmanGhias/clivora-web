/** Hero mockup: earnings + available balance + withdraw (marketing image 1). */
export function EarningsHeroMock() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="flex h-[460px] sm:h-[500px]">
        <aside className="hidden w-[128px] shrink-0 flex-col bg-[#0F172A] p-2.5 text-white sm:flex">
          <p className="text-[10px] font-black tracking-wide">CLIVORA</p>
          <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-wider text-teal-300/80">
            Freelancer OS
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0D9488] text-[8px] font-bold">
              UG
            </span>
            <div className="min-w-0">
              <p className="truncate text-[9px] font-semibold">Usman Ghias</p>
              <span className="rounded bg-amber-400/90 px-1 py-px text-[7px] font-bold text-[#0F172A]">
                Pro Plus
              </span>
            </div>
          </div>
          <nav className="mt-3 space-y-0.5 text-[9px]">
            {[
              ["Dashboard", true],
              ["Earnings", false],
              ["Withdraw", false],
              ["Projects", false],
              ["Invoices", false],
            ].map(([label, active]) => (
              <div
                key={String(label)}
                className={`rounded-lg px-2 py-1.5 font-medium ${
                  active ? "bg-[#0D9488]/25 text-white" : "text-white/60"
                }`}
              >
                {label}
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden bg-[#F8FAFC] p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold text-[#0F172A]">Earnings & payouts</p>
              <p className="text-[9px] text-[#64748B]">Track income and withdraw to your bank</p>
            </div>
            <span className="rounded-lg bg-teal-50 px-2 py-1 text-[8px] font-bold text-[#0D9488]">
              This month
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:col-span-1">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Available balance
              </p>
              <p className="mt-1 font-display text-lg font-extrabold text-[#0F172A]">$3,240.00</p>
              <p className="mt-0.5 text-[8px] font-semibold text-emerald-600">Ready to withdraw</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Earned this month
              </p>
              <p className="mt-1 font-display text-lg font-extrabold text-[#0F172A]">$4,180.00</p>
              <p className="mt-0.5 text-[8px] font-semibold text-emerald-600">+12.4% vs last month</p>
            </div>
            <div className="col-span-2 rounded-xl bg-[#0F172A] p-2.5 text-white shadow-sm sm:col-span-1">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-white/50">
                Next payout
              </p>
              <p className="mt-1 text-sm font-extrabold">Jul 18, 2026</p>
              <button
                type="button"
                className="mt-2 w-full rounded-lg bg-[#0D9488] py-1.5 text-[9px] font-bold text-white"
              >
                Withdraw funds
              </button>
            </div>
          </div>

          <div className="mt-2.5 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-[#0F172A]">Earnings overview</p>
              <div className="flex gap-2 text-[8px] text-[#64748B]">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" /> This month
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" /> Previous
                </span>
              </div>
            </div>
            <svg viewBox="0 0 320 90" className="mt-2 h-20 w-full" aria-hidden>
              <defs>
                <linearGradient id="heroEarnFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D9488" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="url(#heroEarnFill)"
                points="0,70 40,62 80,55 120,48 160,36 200,40 240,28 280,22 320,18 320,90 0,90"
              />
              <polyline
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                points="0,75 40,70 80,68 120,60 160,58 200,52 240,50 280,46 320,44"
              />
              <polyline
                fill="none"
                stroke="#0D9488"
                strokeWidth="2.2"
                strokeLinecap="round"
                points="0,70 40,62 80,55 120,48 160,36 200,40 240,28 280,22 320,18"
              />
              <circle cx="200" cy="40" r="3.5" fill="#0D9488" />
              <rect x="168" y="12" width="72" height="22" rx="6" fill="#0F172A" />
              <text x="204" y="26" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">
                Jul 21 · $820
              </text>
            </svg>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <p className="text-[9px] font-bold text-[#0F172A]">Recent withdrawals</p>
              <ul className="mt-1.5 space-y-1.5">
                {[
                  ["Bank · ****4821", "$1,200", "Paid"],
                  ["JazzCash", "$450", "Processing"],
                ].map(([label, amt, status]) => (
                  <li key={label} className="flex items-center justify-between text-[8px]">
                    <span className="text-[#64748B]">{label}</span>
                    <span className="font-bold text-[#0F172A]">{amt}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-semibold ${
                        status === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <p className="text-[9px] font-bold text-[#0F172A]">Pending invoices</p>
              <ul className="mt-1.5 space-y-1.5">
                {[
                  ["INV-214", "$680"],
                  ["INV-209", "$420"],
                ].map(([id, amt]) => (
                  <li key={id} className="flex items-center justify-between text-[8px]">
                    <span className="font-semibold text-[#0F172A]">{id}</span>
                    <span className="text-[#64748B]">{amt}</span>
                    <span className="rounded-full bg-sky-50 px-1.5 py-0.5 font-semibold text-sky-700">
                      Sent
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
