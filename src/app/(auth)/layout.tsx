import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] text-navy">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_-10%,rgba(13,148,136,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_80%,rgba(15,23,42,0.06),transparent_50%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size="sm" showText={false} variant="onLight" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm font-extrabold tracking-wide">CLIVORA</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-primary">
              Freelancer OS
            </span>
          </span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-primary">
          ← Back to home
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-4 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-8">
        <div className="hidden lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Welcome back</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-navy">
            One account for web, Android, and Connect.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
            Manage clients, projects, invoices, and marketplace opportunities from the same CLIVORA
            workspace — free to start.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-600">
            {[
              "Freelancer OS + Client portal in one login",
              "Private Connect marketplace with $0 deal fees",
              "Cloud sync between website and Android app",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
