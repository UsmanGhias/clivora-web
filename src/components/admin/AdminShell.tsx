"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Banknote,
  Briefcase,
  ChevronDown,
  CreditCard,
  FileText,
  Flag,
  Handshake,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Moon,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sun,
  Ticket,
  Users,
  Wallet,
  Receipt,
  Landmark,
  ScrollText,
  Zap,
  Network,
  FolderKanban,
  Send,
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

import { site } from "@/lib/site";

export const ADMIN_VERSION = `v${site.appVersion}`;

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: string;
  section?: string;
};

const NAV: NavItem[] = [
  { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users, badgeKey: "users" },
  { href: "/admin/freelancers", label: "Freelancers", icon: Briefcase, badgeKey: "freelancers" },
  { href: "/admin/clients", label: "Clients", icon: Handshake, badgeKey: "clients" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, badgeKey: "projects" },
  { href: "/admin/jobs", label: "Jobs", icon: Zap, badgeKey: "jobs" },
  { href: "/admin/proposals", label: "Proposals", icon: Send, badgeKey: "proposals" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, badgeKey: "payments" },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt, badgeKey: "invoices" },
  { href: "/admin/payouts", label: "Payouts", icon: Banknote, badgeKey: "payouts" },
  { href: "/admin/escrow", label: "Escrow", icon: Landmark, badgeKey: "escrow" },
  { href: "/admin/connect", label: "Connect", icon: Network, section: "Connect" },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: Wallet },
  { href: "/admin/transactions", label: "Transactions", icon: Activity },
  { href: "/admin/reports", label: "Reports", icon: FileText, section: "Reports" },
  { href: "/admin/audit", label: "Audit Logs", icon: ScrollText },
  { href: "/admin/events", label: "Events", icon: Flag },
  { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle, badgeKey: "disputes" },
  { href: "/admin/support", label: "Support Tickets", icon: Ticket, badgeKey: "tickets" },
  { href: "/admin/settings", label: "System Settings", icon: Settings, section: "System" },
];

export type AdminBadgeCounts = Record<string, string | number>;

export function AdminShell({
  children,
  badges = {},
  adminName = "Admin",
  adminEmail = "",
  onRefresh,
  refreshing,
}: {
  children: React.ReactNode;
  badges?: AdminBadgeCounts;
  adminName?: string;
  adminEmail?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/admin");
  }, [router]);

  const filteredNav = useMemo(() => {
    if (!search.trim()) return NAV;
    const q = search.toLowerCase();
    return NAV.filter((n) => n.label.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className={cn("flex min-h-screen bg-[#F8FAFC] text-slate-900", dark && "dark bg-slate-950 text-white")}>
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 flex h-screen flex-col border-r border-white/5 bg-[#0F172A] text-slate-300 transition-all",
          collapsed ? "w-[72px]" : "w-[260px]",
        )}
      >
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-sm font-black text-teal-300">
            C
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-black tracking-wide text-white">CLIVORA</div>
              <div className="text-[11px] font-medium text-slate-400">Admin Panel</div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {NAV.map((item, idx) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            const badge = item.badgeKey ? badges[item.badgeKey] : undefined;
            const showSection = item.section && (!collapsed) && (idx === 0 || NAV[idx - 1]?.section !== item.section);
            return (
              <div key={item.href}>
                {showSection && (
                  <div className="mb-1 mt-4 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {item.section}
                  </div>
                )}
                <Link
                  href={item.href}
                  className={cn(
                    "mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition",
                    active
                      ? "bg-teal-500/20 text-white shadow-[inset_3px_0_0_0_#0D9488]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  )}
                  title={item.label}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-teal-300" : "")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {badge != null && badge !== "" && (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                            active ? "bg-teal-500/30 text-teal-100" : "bg-white/5 text-slate-400",
                          )}
                        >
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-3">
          {!collapsed && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                System Status
              </div>
              <p className="mt-1 text-[11px] text-slate-400">All systems operational.</p>
            </div>
          )}
          <p className={cn("mt-2 text-center text-[10px] text-slate-500", collapsed && "px-0")}>
            {collapsed ? ADMIN_VERSION : `${ADMIN_VERSION} · live`}
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 truncate">Search freelancers, projects, invoices...</span>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-900">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700"
            aria-label="Toggle theme"
          >
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            type="button"
            className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700"
            aria-label="Notifications"
          >
            <LifeBuoy className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-500 px-1 text-[9px] font-bold text-white">
              12
            </span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700"
            aria-label="Refresh"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 py-1 pl-1 pr-3 dark:border-slate-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-slate-800 text-xs font-bold text-white">
              {adminName.slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">{adminName}</div>
              <div className="text-[10px] text-slate-500">{adminEmail}</div>
            </div>
            <button type="button" onClick={signOut} className="text-slate-400 hover:text-slate-700" title="Sign out">
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-5 md:p-6">{children}</main>
      </div>

      {cmdOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh]" onClick={() => setCmdOpen(false)}>
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Jump to a page..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <kbd className="text-[10px] text-slate-400">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredNav.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => {
                    setCmdOpen(false);
                    setSearch("");
                    router.push(item.href);
                  }}
                >
                  <item.icon className="h-4 w-4 text-teal-600" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
