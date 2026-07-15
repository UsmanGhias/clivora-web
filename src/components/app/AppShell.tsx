"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Sparkles,
  Network,
  Receipt,
  Clock,
  Star,
  UserCircle,
  Bookmark,
  Briefcase,
  Plus,
  Diamond,
  BarChart3,
  Wallet,
  ChevronDown,
  CreditCard,
  ArrowLeftRight,
  Banknote,
  ScrollText,
  ListTodo,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/profile-types";
import { isProPlus, planLabel } from "@/lib/plan";
import { Logo } from "@/components/ui/Logo";
import type { PortalNavCounts } from "@/lib/portal-nav";
import { CommandPalette, type CommandItem } from "@/components/app/CommandPalette";
import { UserAvatar } from "@/components/app/UserAvatar";
import { EarlyAccessProPopup } from "@/components/app/EarlyAccessProPopup";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  cta?: boolean;
};

type NavGroup = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: NavItem[];
  matchPrefixes: string[];
};

function NavLink({
  item,
  active,
  isClient,
  nested,
}: {
  item: NavItem;
  active: boolean;
  isClient: boolean;
  nested?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        nested && "py-2 pl-10",
        item.cta
          ? isClient
            ? "mt-2 bg-client-accent text-white hover:bg-client-header"
            : "mt-2 bg-primary text-white hover:bg-primary-dark"
          : active
            ? isClient
              ? "border-l-4 border-client-accent bg-white/10 text-white"
              : "border-l-4 border-primary bg-primary/20 text-white"
            : "text-white/70 hover:bg-white/5 hover:text-white",
      )}
    >
      {!nested && <Icon className="h-4 w-4 shrink-0" />}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold",
            isClient ? "bg-client-accent text-white" : "bg-primary text-white",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function AppShell({
  profile,
  isClient,
  counts,
  children,
}: {
  profile: Profile;
  isClient: boolean;
  counts?: PortalNavCounts;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const plus = isProPlus(profile);
  const plan = planLabel(profile);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const freelancerNav: NavItem[] = [
    { href: "/app", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/connect", label: "Find jobs (Connect)", icon: Network },
    { href: "/app/connect/manage", label: "Post a need", icon: Plus },
    { href: "/app/proposals", label: "Proposals", icon: FileText, badge: counts?.proposals },
    { href: "/app/projects", label: "Projects", icon: FolderKanban, badge: counts?.projects },
    { href: "/app/contracts", label: "Contracts", icon: ScrollText },
    { href: "/app/invoices", label: "Invoices", icon: Receipt },
    { href: "/app/tasks", label: "Tasks", icon: ListTodo },
    { href: "/app/messages", label: "Messages", icon: MessageSquare, badge: counts?.messages },
    { href: "/app/earnings", label: "Earnings", icon: Wallet },
    { href: "/app/timesheets", label: "Time tracking", icon: Clock },
    { href: "/app/clients", label: "Clients", icon: Users },
    { href: "/app/reviews", label: "Reviews", icon: Star },
    { href: "/app/account", label: "My profile", icon: UserCircle },
    { href: "/app/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/app/team", label: "Team", icon: Briefcase },
    { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/app/settings", label: "Settings", icon: Settings },
  ];

  const clientTop: NavItem[] = [
    { href: "/app", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/connect/manage", label: "Post a job", icon: Plus },
    { href: "/app/connect", label: "Marketplace / Connect", icon: Network },
    { href: "/app/proposals", label: "Proposals", icon: FileText, badge: counts?.proposals },
    { href: "/app/projects", label: "Projects", icon: FolderKanban, badge: counts?.projects },
    { href: "/app/contracts", label: "Contracts", icon: ScrollText },
    { href: "/app/messages", label: "Messages", icon: MessageSquare, badge: counts?.messages },
  ];

  const paymentsGroup: NavGroup = {
    label: "Payments",
    icon: Receipt,
    matchPrefixes: ["/app/payments", "/app/invoices"],
    children: [
      { href: "/app/payments", label: "Overview", icon: Wallet },
      { href: "/app/invoices", label: "Invoices", icon: FileText },
      { href: "/app/payments/transactions", label: "Transactions", icon: ArrowLeftRight },
      { href: "/app/payments/payment-methods", label: "Payment methods", icon: CreditCard },
      { href: "/app/payments/payouts", label: "Payouts", icon: Banknote },
    ],
  };

  const clientBottom: NavItem[] = [
    { href: "/app/team", label: "My team", icon: Users },
    { href: "/app/tasks", label: "Tasks", icon: ListTodo },
    { href: "/app/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/app/reviews", label: "Reviews", icon: Star },
    { href: "/app/timesheets", label: "Time tracking", icon: Clock },
    { href: "/app/analytics", label: "Reports", icon: BarChart3 },
    { href: "/app/settings", label: "Settings", icon: Settings },
  ];

  const nav = isClient ? clientTop : freelancerNav;

  const paymentsOpenDefault =
    isClient &&
    paymentsGroup.matchPrefixes.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
  const [paymentsOpen, setPaymentsOpen] = useState(paymentsOpenDefault);

  const mobileNav = isClient
    ? [
        { href: "/app", label: "Home", icon: LayoutDashboard },
        { href: "/app/connect", label: "Connect", icon: Network },
        { href: "/app/messages", label: "Messages", icon: MessageSquare },
        { href: "/app/notifications", label: "Alerts", icon: Bell },
        { href: "/app/settings", label: "Settings", icon: Settings },
      ]
    : [
        { href: "/app", label: "Home", icon: LayoutDashboard },
        { href: "/app/proposals", label: "Proposals", icon: FileText },
        { href: "/app/projects", label: "Work", icon: FolderKanban },
        { href: "/app/connect", label: "Connect", icon: Network },
        { href: "/app/account", label: "Account", icon: UserCircle },
      ];

  const commandItems: CommandItem[] = useMemo(() => {
    const common: CommandItem[] = [
      { href: "/app", label: "Dashboard", group: "Navigate" },
      { href: "/app/messages", label: "Messages", group: "Navigate" },
      { href: "/app/projects", label: "Projects", group: "Navigate" },
      { href: "/app/proposals", label: "Proposals", group: "Navigate" },
      { href: "/app/connect", label: "Connect", group: "Navigate" },
      { href: "/app/invoices", label: "Invoices", group: "Navigate" },
      { href: "/app/timesheets", label: "Time tracking", group: "Navigate" },
      { href: "/app/bookmarks", label: "Bookmarks", group: "Navigate" },
      { href: "/app/reviews", label: "Reviews", group: "Navigate" },
      { href: "/app/analytics", label: isClient ? "Reports" : "Analytics", group: "Navigate" },
      { href: "/app/team", label: isClient ? "My team" : "Team", group: "Navigate" },
      { href: "/app/settings", label: "Settings", group: "Account" },
      { href: "/app/notifications", label: "Notifications", group: "Account" },
      { href: "/pro", label: "Billing / Plans", group: "Account" },
      { href: "/app/connect/manage", label: isClient ? "Post a job" : "Post a need", group: "Actions" },
    ];
    if (isClient) {
      common.push(
        { href: "/app/payments", label: "Payments overview", group: "Payments" },
        { href: "/app/payments/transactions", label: "Transactions", group: "Payments" },
        { href: "/app/payments/payment-methods", label: "Payment methods", group: "Payments" },
        { href: "/app/settings", label: "My profile", group: "Account" },
      );
    } else {
      common.push(
        { href: "/app/account", label: "My profile", group: "Account" },
        { href: "/app/earnings", label: "Earnings", group: "Navigate" },
        { href: "/app/clients", label: "Clients", group: "Navigate" },
        { href: "/app/hub", label: "Hub", group: "Navigate" },
      );
    }
    const seen = new Set<string>();
    return common.filter((item) => {
      const key = `${item.href}|${item.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [isClient]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!profileMenuOpen) return;
    function onDoc(e: MouseEvent) {
      if (!profileMenuRef.current?.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [profileMenuOpen]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/app") return pathname === "/app";
    if (href === "/app/payments") return pathname === "/app/payments";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const pageTitle =
    pathname === "/app"
      ? "Dashboard"
      : pathname.startsWith("/app/payments")
        ? "Payments"
        : pathname.startsWith("/app/invoices")
          ? "Invoices"
          : pathname.startsWith("/app/team")
            ? isClient
              ? "My team"
              : "Team"
            : [...clientTop, ...clientBottom, ...freelancerNav, ...paymentsGroup.children].find((n) =>
                isActive(n.href),
              )?.label ?? "App";

  const profileHref = "/app/account";

  return (
    <div
      className={cn(
        "flex min-h-screen bg-background text-text-primary",
        isClient && "theme-client",
      )}
    >
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy text-white lg:flex">
        <div className="border-b border-white/10 px-4 py-5">
          <Link href="/app" className="block">
            <Logo size="sm" variant="onDark" />
          </Link>
          <p
            className={cn(
              "mt-2 text-[10px] font-bold uppercase tracking-[0.14em]",
              isClient ? "text-white/50" : "text-primary-light",
            )}
          >
            {isClient ? "Client portal" : "Freelancer portal"}
          </p>
        </div>

        <div className="relative border-b border-white/10 px-4 py-4" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setProfileMenuOpen((o) => !o)}
            className="flex w-full items-center gap-3 rounded-xl px-1 py-1 text-left transition hover:bg-white/5"
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
          >
            <span className="relative shrink-0">
              <UserAvatar
                name={profile.name}
                email={profile.email}
                avatarUrl={profile.avatar_url}
                size="lg"
                className="bg-white/10"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-navy bg-success" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{profile.name || profile.email}</p>
              {plus && (
                <span
                  className={cn(
                    "mt-1 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase",
                    isClient ? "bg-white/15 text-white" : "bg-primary/20 text-primary-light",
                  )}
                >
                  <Diamond className="h-3 w-3" />
                  {plan}
                </span>
              )}
              {!plus && (
                <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-white/50">
                  Free plan
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-white/40 transition",
                profileMenuOpen && "rotate-180",
              )}
            />
          </button>
          {profileMenuOpen && (
            <div
              role="menu"
              className="absolute left-3 right-3 top-[calc(100%-0.5rem)] z-50 overflow-hidden rounded-xl border border-white/10 bg-navy shadow-xl"
            >
              <Link
                href={profileHref}
                role="menuitem"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                <UserCircle className="h-4 w-4" />
                My profile
              </Link>
              <Link
                href="/app/settings"
                role="menuitem"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link
                href="/pro"
                role="menuitem"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                <CreditCard className="h-4 w-4" />
                Billing
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileMenuOpen(false);
                  void signOut();
                }}
                className="flex w-full items-center gap-2 border-t border-white/10 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {nav.map((item, i) => (
            <NavLink
              key={`${item.href}-${item.label}-${i}`}
              item={item}
              active={isActive(item.href) && !item.cta}
              isClient={isClient}
            />
          ))}

          {isClient && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setPaymentsOpen((o) => !o)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  paymentsOpenDefault
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <Receipt className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">Payments</span>
                <ChevronDown
                  className={cn("h-4 w-4 transition", paymentsOpen && "rotate-180")}
                />
              </button>
              {paymentsOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {paymentsGroup.children.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={isActive(item.href)}
                      isClient={isClient}
                      nested
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {isClient &&
            clientBottom.map((item, i) => (
              <NavLink
                key={`${item.href}-${item.label}-${i}`}
                item={item}
                active={isActive(item.href)}
                isClient={isClient}
              />
            ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          {isClient ? (
            <Link
              href="/app/connect/manage"
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-3 py-2.5 text-sm font-bold text-white hover:bg-white/5"
            >
              <Plus className="h-4 w-4" />
              Post a job
            </Link>
          ) : (
            <Link
              href="/app/connect/manage"
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-bold text-white hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4" />
              Post a need
            </Link>
          )}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-bold text-white/80">{plus ? `${plan} plan` : "Free Plan"}</p>
            <p className="mt-1 text-[10px] text-white/50">
              {plus ? "Renews on Oct 10, 2026" : "Upgrade for Connect credits"}
            </p>
            <Link
              href={plus ? "/app/settings?tab=billing" : "/pro?plan=pro_plus"}
              className={cn(
                "mt-2 block rounded-lg px-3 py-1.5 text-center text-xs font-semibold text-white",
                isClient ? "bg-white/15 hover:bg-white/25" : "bg-primary",
              )}
            >
              {plus ? "You're on Plus, enjoy" : "Manage plan"}
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <div className="lg:hidden">
              <Logo size="sm" variant="onLight" showText={false} />
            </div>
            <p className="hidden font-display text-sm font-bold text-navy sm:block">{pageTitle}</p>
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="relative mx-auto hidden max-w-md flex-1 text-left sm:block"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <span className="block w-full rounded-full border border-border bg-background py-2 pl-10 pr-16 text-sm text-text-muted">
                {isClient
                  ? "Search freelancers, projects, invoices..."
                  : "Search anything..."}
              </span>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-bold text-text-muted">
                ⌘K
              </span>
            </button>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="rounded-full p-2 text-text-secondary hover:bg-background sm:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/app/messages"
                className="rounded-full p-2 text-text-secondary hover:bg-background"
                aria-label="Messages"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>
              <Link
                href="/app/notifications"
                className="relative rounded-full p-2 text-text-secondary hover:bg-background"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {(counts?.notifications ?? 0) > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white">
                    {counts!.notifications}
                  </span>
                )}
              </Link>
              <Link
                href={plus ? "/app/settings?tab=billing" : "/pro?plan=pro_plus"}
                className={cn(
                  "hidden items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white sm:inline-flex",
                  isClient ? "bg-navy" : "bg-primary",
                )}
                title={plus ? `You're on ${plan}` : "Upgrade to Pro Plus"}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {plus ? `${plan} Enjoy` : "Pro Plus"}
              </Link>
              <Link href={profileHref} className="block shrink-0">
                <UserAvatar
                  name={profile.name}
                  email={profile.email}
                  avatarUrl={profile.avatar_url}
                  size="md"
                />
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="hidden rounded-full p-2 text-text-muted hover:bg-background lg:inline-flex"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy lg:hidden">
        <div className="mx-auto flex max-w-lg justify-around px-1 py-2">
          {mobileNav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1 text-[10px] font-semibold",
                  active
                    ? isClient
                      ? "text-white"
                      : "text-primary-light"
                    : "text-white/50",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <EarlyAccessProPopup isClient={isClient} />

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        items={commandItems}
        isClient={isClient}
      />
    </div>
  );
}
