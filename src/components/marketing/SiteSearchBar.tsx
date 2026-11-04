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
  ShieldCheck,
  Smartphone,
  Scale,
  FileText,
  Calculator,
  MessageSquare,
  Newspaper,
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
  category: "Open Source" | "Platform" | "Developer Suite" | "Resources";
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
  keywords?: string[];
};

const SEARCH_DIRECTORY: QuickLink[] = [
  {
    label: "Open Source Freelancer OS",
    desc: "100% Free Apache 2.0 / MIT code, self-hostable Docker, and GitHub repo",
    href: "/open-source",
    category: "Open Source",
    icon: ShieldCheck,
    keywords: ["open source", "opensource", "github", "git", "repo", "apache", "mit", "license", "code", "self host", "docker", "star"],
  },
  {
    label: "Remote Jobs Directory",
    desc: "7,361+ verified engineering, design, and product listings with direct apply",
    href: "/jobs",
    category: "Platform",
    icon: Briefcase,
    keywords: ["jobs", "careers", "work", "hiring", "remote", "developer", "designer", "engineer", "roles"],
  },
  {
    label: "Connect Marketplace",
    desc: "Private direct hiring with $0 deal fees and milestone protection",
    href: "/connect",
    category: "Platform",
    icon: Users,
    keywords: ["connect", "hire", "freelancer", "marketplace", "escrow", "direct", "contracts"],
  },
  {
    label: "Android APK Direct Download",
    desc: "Native Flutter mobile app (v5.6.1) with SQLite offline sync",
    href: "/download/apk",
    category: "Platform",
    icon: Smartphone,
    keywords: ["apk", "android", "mobile", "app", "download", "install", "flutter", "offline", "sync"],
  },
  {
    label: "Fee Comparison vs Upwork & Fiverr",
    desc: "Interactive calculator: see how 0% Clivora beats 20% marketplace taxes",
    href: "/compare",
    category: "Resources",
    icon: Scale,
    keywords: ["compare", "fees", "calculator", "upwork", "fiverr", "take rate", "commission", "savings", "tax"],
  },
  {
    label: "Freelancer Operating System",
    desc: "Client CRM, milestone invoices, contracts, proposals, and timesheets",
    href: "/for-freelancers",
    category: "Platform",
    icon: Sliders,
    keywords: ["freelancer", "freelancers", "os", "crm", "invoices", "proposals", "timesheets", "features"],
  },
  {
    label: "Client Management & Talent Search",
    desc: "Post jobs for free, review candidates, and manage milestone payouts",
    href: "/for-clients",
    category: "Platform",
    icon: Users,
    keywords: ["clients", "client", "talent", "hire", "post job", "recruiting", "milestones"],
  },
  {
    label: "Instant AI SOW Generator",
    desc: "Generate professional client proposals, milestones, and scope of work",
    href: "/start-a-project",
    category: "Platform",
    icon: FileText,
    keywords: ["sow", "proposal", "scope of work", "contract", "ai generator", "start project", "estimate"],
  },
  {
    label: "Clivora Architecture Studio",
    desc: "Interactive cloud systems topology, distributed architecture, and live ER canvas",
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
    label: "Freelance Rate & Tax Calculators",
    desc: "Free hourly rate, project pricing, and take-home income calculators",
    href: "/tools",
    category: "Resources",
    icon: Calculator,
    keywords: ["rate calculator", "calculator", "tax", "hourly", "project price", "free tools"],
  },
  {
    label: "Clivora Engineering Blog",
    desc: "Technical deep-dives, open-source architecture, and platform release notes",
    href: "https://community.clivora.io/blog",
    category: "Resources",
    icon: Newspaper,
    external: true,
    keywords: ["blog", "articles", "news", "updates", "engineering", "release notes"],
  },
  {
    label: "Clivora Community Forum",
    desc: "Open developer discussions, feature requests, and community Q&A",
    href: "https://community.clivora.io/forum",
    category: "Resources",
    icon: MessageSquare,
    external: true,
    keywords: ["forum", "community", "discussions", "feedback", "support", "questions"],
  },
  {
    label: "Documentation Center",
    desc: "Guides, API specs, self-hosting Docker guides, and developer workflows",
    href: "/docs",
    category: "Resources",
    icon: BookOpen,
    keywords: ["docs", "documentation", "api", "guides", "help", "manual", "docker"],
  },
  {
    label: "Pricing & Plans",
    desc: "100% Free Founder Launch tier with $0 platform fees",
    href: "/pricing",
    category: "Platform",
    icon: CreditCard,
    keywords: ["pricing", "plans", "cost", "pro", "subscription", "free"],
  },
];

const POPULAR_TAGS = [
  "Open Source",
  "Android APK",
  "Remote Jobs",
  "Connect Direct",
  "Architecture",
  "Fee Calculator",
  "Odoo 19",
  "React & Next.js",
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
          className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-4 pt-[5vh] sm:pt-[8vh] bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search Clivora platform"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
            className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl animate-in zoom-in-95 duration-150 my-auto sm:my-0"
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
                placeholder="Search jobs, open source, apk, architecture..."
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
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="hidden sm:inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                  ESC
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
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
                        onClick={() => {
                          setQuery(tag);
                          inputRef.current?.focus();
                        }}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-teal-500/40 hover:bg-teal-50 hover:text-teal-900 cursor-pointer"
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
