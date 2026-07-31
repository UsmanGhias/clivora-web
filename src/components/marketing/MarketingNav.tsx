"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Globe, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";

type SessionUser = {
  email: string | null;
  name: string | null;
};

export function MarketingNav({ variant = "light" }: { variant?: "light" | "overlay" }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const light = variant === "light";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Defer auth so first paint is not blocked by Supabase JS on marketing pages.
  useEffect(() => {
    let mounted = true;
    let unsub: (() => void) | undefined;

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();

          async function load() {
            try {
              const {
                data: { user: u },
              } = await supabase.auth.getUser();
              if (!mounted) return;
              if (!u) {
                setUser(null);
                return;
              }
              const { data: profile } = await supabase
                .from("profiles")
                .select("name")
                .eq("id", u.id)
                .maybeSingle();
              if (!mounted) return;
              setUser({
                email: u.email ?? null,
                name: (profile?.name as string | null) ?? null,
              });
            } catch {
              if (mounted) setUser(null);
            }
          }

          await load();
          const { data: sub } = supabase.auth.onAuthStateChange(() => {
            void load();
          });
          unsub = () => sub.subscription.unsubscribe();
        } catch {
          if (mounted) setUser(null);
        }
      })();
    }, 1200);

    return () => {
      mounted = false;
      window.clearTimeout(timer);
      unsub?.();
    };
  }, []);

  async function signOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  const loggedIn = !!user;
  const displayName = (user?.name || user?.email || "Account").split(" ")[0];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          light
            ? scrolled
              ? "border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl"
              : "border-b border-transparent bg-[#F8FAFC]/90 backdrop-blur-md"
            : scrolled
              ? "border-b border-white/10 bg-navy/90 backdrop-blur-xl"
              : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Clivora Home">
            <Logo size="sm" showText={false} variant={light ? "onLight" : "onDark"} />
            <span className="hidden flex-col leading-none sm:flex">
              <span
                className={cn(
                  "font-display text-sm font-extrabold tracking-wide",
                  light ? "text-navy" : "text-white",
                )}
              >
                {marketing.brand.name}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
                {marketing.brand.productLine}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {marketing.nav.links.map((link) => {
              const hasChildren = "children" in link && !!link.children?.length;
              const isExternal = "external" in link && link.external;
              const itemClass = cn(
                "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                light
                  ? "text-slate-600 hover:bg-slate-100 hover:text-navy"
                  : "text-white/75 hover:bg-white/10 hover:text-white",
                isExternal && light ? "text-primary hover:text-primary" : null,
              );
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenMenu(link.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  {isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={itemClass}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className={itemClass}>
                      {link.label}
                      {hasChildren ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : null}
                    </Link>
                  )}
                  {hasChildren && openMenu === link.label ? (
                    <div className="absolute left-0 top-full pt-2">
                      <div className="min-w-[200px] rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                        {link.children!.map((child) => (
                          <Link
                            key={child.href + child.label}
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-teal-50 hover:text-navy"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium",
                light ? "text-slate-500 hover:bg-slate-100" : "text-white/70 hover:bg-white/10",
              )}
              aria-label="Language"
            >
              <Globe className="h-4 w-4" />
              {marketing.nav.locale}
            </button>

            {loggedIn ? (
              <>
                <span
                  className={cn(
                    "hidden text-sm font-medium xl:inline",
                    light ? "text-slate-500" : "text-white/70",
                  )}
                >
                  Hi, {displayName}
                </span>
                <Link
                  href="/app"
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm font-semibold",
                    light ? "text-navy hover:text-primary" : "text-white/90 hover:text-white",
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/app"
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-bold transition",
                    light
                      ? "bg-navy text-white hover:bg-navy/90"
                      : "bg-white text-navy hover:bg-white/90",
                  )}
                >
                  Open portal
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium",
                    light ? "text-slate-500 hover:bg-slate-100" : "text-white/70 hover:bg-white/10",
                  )}
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href={marketing.nav.login.href}
                  className={cn(
                    "text-sm font-semibold",
                    light ? "text-navy hover:text-primary" : "text-white/80 hover:text-white",
                  )}
                >
                  {marketing.nav.login.label}
                </Link>
                <Link
                  href={marketing.nav.cta.href}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-bold transition",
                    light
                      ? "bg-navy text-white hover:bg-navy/90"
                      : "bg-white text-navy hover:bg-white/90",
                  )}
                >
                  {marketing.nav.cta.label}
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className={cn("lg:hidden", light ? "text-navy" : "text-white")}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-[68px] z-40 max-h-[calc(100svh-68px)] overflow-y-auto border-b border-slate-200 bg-white p-5 shadow-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {marketing.nav.links.map((link) => {
              const isExternal = "external" in link && link.external;
              return (
                <div key={link.label} className="border-b border-slate-100 py-2">
                  {isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-base font-semibold text-primary"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-base font-semibold text-navy"
                    >
                      {link.label}
                    </Link>
                  )}
                  {"children" in link && link.children
                    ? link.children.map((child) => (
                        <Link
                          key={child.href + child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1.5 pl-3 text-sm text-slate-500"
                        >
                          {child.label}
                        </Link>
                      ))
                    : null}
                </div>
              );
            })}
            {loggedIn ? (
              <>
                <Link
                  href="/app"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 rounded-xl bg-navy px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Open portal
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void signOut();
                  }}
                  className="mt-2 py-2 text-base font-semibold text-slate-600"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href={marketing.nav.login.href}
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 py-2 text-base font-semibold text-navy"
                >
                  {marketing.nav.login.label}
                </Link>
                <Link
                  href={marketing.nav.cta.href}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-xl bg-navy px-4 py-3 text-center text-sm font-bold text-white"
                >
                  {marketing.nav.cta.label}
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </>
  );
}
