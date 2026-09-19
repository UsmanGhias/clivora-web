"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Briefcase,
  Layers,
  Code2,
  Wrench,
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  CreditCard,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteSearchBarProps {
  className?: string;
  variant?: "icon" | "mobile" | "header" | "inline";
  light?: boolean;
  onSelect?: () => void;
  placeholder?: string;
}

type QuickLink = {
  label: string;
  desc: string;
  href: string;
  category: "Platform" | "Developer Suite" | "Resources";
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
  keywords?: string[];
};

const SEARCH_DIRECTORY: QuickLink[] = [
  {
    label: "Remote Jobs Directory",
    desc: "1,200+ verified engineering, design, and product listings",
    href: "/jobs",
    category: "Platform",
    icon: Briefcase,
    keywords: ["jobs", "careers", "work", "hiring", "remote", "developer", "designer"],
  },
  {
    label: "Connect Marketplace",
    desc: "Private direct hiring with $0 deal fees",
    href: "/connect",
    category: "Platform",
    icon: Users,
    keywords: ["connect", "hire", "freelancer", "marketplace", "escrow"],
  },
  {
    label: "Clivora Architecture Studio",
    desc: "Interactive cloud systems topology and live enterprise canvas",
    href: "https://arch.clivora.io",
    category: "Developer Suite",
    icon: Layers,
    external: true,
    keywords: ["architecture", "diagram", "drawio", "topology", "cloud", "odoo", "zatca", "system design"],
  },
  {
    label: "Clivora Code Studio",
    desc: "Interactive multi-language engineering sandbox & case studies",
    href: "https://play.clivora.io",
    category: "Developer Suite",
    icon: Code2,
    external: true,
    keywords: ["code", "playground", "sandbox", "python", "typescript", "odoo", "sql", "livecodes"],
  },
  {
    label: "Clivora DevTools Suite",
    desc: "JSON formatter, JWT decoder, SHA-256 ZATCA digest, and UUID utilities",
    href: "https://tools.clivora.io",
    category: "Developer Suite",
    icon: Wrench,
    external: true,
    keywords: ["tools", "json", "jwt", "hash", "sha256", "uuid", "base64", "timestamp", "zatca"],
  },
  {
    label: "Platform Features",
    desc: "CRM, direct invoices, time tracker, and private Connect",
    href: "/features",
    category: "Platform",
    icon: Sliders,
    keywords: ["features", "crm", "invoices", "timesheets", "projects", "contracts"],
  },
  {
    label: "Documentation Center",
    desc: "Guides, API specs, and platform onboarding workflows",
    href: "/docs",
    category: "Resources",
    icon: BookOpen,
    keywords: ["docs", "documentation", "api", "guides", "help", "manual"],
  },
  {
    label: "Pricing & Plans",
    desc: "Free forever tier, Pro ($9/mo), and Pro Plus ($19/mo)",
    href: "/pricing",
    category: "Platform",
    icon: CreditCard,
    keywords: ["pricing", "plans", "cost", "pro", "subscription", "free"],
  },
];

const POPULAR_TAGS = [
  "Full Stack",
  "Odoo 19",
  "React & Next.js",
  "Python AI",
  "ZATCA Phase 2",
  "UI/UX Design",
];

export function SiteSearchBar({
  className,
  variant = "icon",
  light = true,
  onSelect,
  placeholder = "Search jobs, skills, or docs...",
}: SiteSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K or '/'
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (
        e.key === "/" &&
        !isOpen &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock scroll when modal is open and auto-focus input
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredLinks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_DIRECTORY;
    return SEARCH_DIRECTORY.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(q);
      const matchDesc = item.desc.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchLabel || matchDesc || matchKeywords;
    });
  }, [query]);

  // Total selectable rows: 1 search action + filtered links
  const totalItems = (query.trim() ? 1 : 0) + filteredLinks.length;

  const navigateTo = (url: string, external?: boolean) => {
    setIsOpen(false);
    onSelect?.();
    if (external) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigateTo(`/jobs?q=${encodeURIComponent(trimmed)}`);
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim() && selectedIndex === 0) {
        handleSearchSubmit();
      } else {
        const itemIndex = query.trim() ? selectedIndex - 1 : selectedIndex;
        const item = filteredLinks[itemIndex];
        if (item) {
          navigateTo(item.href, item.external);
        } else if (query.trim()) {
          handleSearchSubmit();
        }
      }
    }
  };

  return (
    <>
      {/* 1. Mobile Drawer Trigger Button */}
      {variant === "mobile" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-500 shadow-2xs transition hover:border-teal-500/40 hover:bg-white hover:text-slate-900",
            className
          )}
          aria-label="Search Clivora platform"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-teal-600" />
            <span className="font-medium text-slate-500">{placeholder}</span>
          </div>
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
            ⌘K
          </kbd>
        </button>
      ) : (
        /* 2. Desktop & Header Icon Button */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "group flex h-9 items-center gap-2 rounded-xl border px-2.5 text-xs transition-all shadow-2xs",
            light
              ? "border-slate-200/90 bg-slate-100/70 text-slate-600 hover:border-teal-500/40 hover:bg-white hover:text-navy hover:shadow-xs"
              : "border-white/10 bg-white/5 text-white/70 hover:border-teal-400/40 hover:bg-white/10 hover:text-white",
            className
          )}
          aria-label="Search Clivora platform (⌘K)"
          title="Search (⌘K)"
        >
          <Search
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              light ? "text-slate-400 group-hover:text-teal-600" : "text-white/50 group-hover:text-teal-300"
            )}
          />
          <span
            className={cn(
              "hidden xl:inline text-xs font-medium",
              light ? "text-slate-400 group-hover:text-slate-600" : "text-white/40 group-hover:text-white/70"
            )}
          >
            Search...
          </span>
          <kbd
            className={cn(
              "hidden xl:inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold",
              light
                ? "border-slate-200/90 bg-white text-slate-400 shadow-2xs"
                : "border-white/10 bg-white/10 text-white/50"
            )}
          >
            ⌘K
          </kbd>
        </button>
      )}

      {/* 3. High-End Command Palette Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[10vh] sm:pt-[12vh] bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search Clivora platform"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
            className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl animate-in zoom-in-95 duration-150"
          >
            {/* Input Header */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5"
            >
              <Search className="h-5 w-5 shrink-0 text-teal-600" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search jobs, skills, architecture, tools..."
                className="w-full bg-transparent text-base sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Clear query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                ESC
              </button>
            </form>

            {/* Suggestions & Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {/* If user typed a search query, show direct Search action first */}
              {query.trim() && (
                <div
                  onClick={() => handleSearchSubmit()}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-colors",
                    selectedIndex === 0
                      ? "bg-teal-50 text-teal-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                      <Search className="h-3.5 w-3.5" />
                    </div>
                    <span>
                      Search remote jobs for <strong className="text-teal-700">&ldquo;{query.trim()}&rdquo;</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-teal-600 font-medium">
                    <span>Search Jobs</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              )}

              {/* Filtered Directory Links */}
              {filteredLinks.length > 0 && (
                <div className="mt-2 space-y-0.5">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Platform & Tools
                  </div>
                  {filteredLinks.map((item, index) => {
                    const rowIdx = (query.trim() ? 1 : 0) + index;
                    const isSelected = selectedIndex === rowIdx;
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        onClick={() => navigateTo(item.href, item.external)}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-colors",
                          isSelected
                            ? "bg-teal-50/80 text-teal-950 shadow-2xs"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                              isSelected
                                ? "bg-teal-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                              <span>{item.label}</span>
                              {item.external && <ExternalLink className="h-3 w-3 text-slate-400" />}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight line-clamp-1">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-500">
                          {item.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No results message */}
              {query.trim() && filteredLinks.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">
                  <p>No internal pages found matching &ldquo;{query}&rdquo;.</p>
                  <p className="mt-1">
                    Press <kbd className="rounded border border-slate-200 px-1 py-0.5 font-semibold">Enter</kbd> to search remote jobs.
                  </p>
                </div>
              )}

              {/* Popular Searches Quick Tags (Shown when query is empty) */}
              {!query.trim() && (
                <div className="mt-3 border-t border-slate-100 pt-3 px-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Sparkles className="h-3 w-3 text-teal-600" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {POPULAR_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => navigateTo(`/jobs?q=${encodeURIComponent(tag)}`)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-teal-500/40 hover:bg-teal-50 hover:text-teal-900"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[9px] font-semibold text-slate-500 shadow-2xs">
                    ↑↓
                  </kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[9px] font-semibold text-slate-500 shadow-2xs">
                    ↵
                  </kbd>
                  <span>select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[9px] font-semibold text-slate-500 shadow-2xs">
                    esc
                  </kbd>
                  <span>close</span>
                </span>
              </div>
              <span className="font-semibold text-teal-700">Clivora OS</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
