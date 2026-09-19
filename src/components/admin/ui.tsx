"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Upload,
} from "lucide-react";

export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AdminBtn({
  children,
  variant = "outline",
  onClick,
  href,
  className,
  disabled,
}: {
  children: React.ReactNode;
  variant?: "outline" | "primary" | "dark";
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}) {
  const styles = cn(
    "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition",
    variant === "outline" && "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    variant === "primary" && "bg-teal-600 text-white hover:bg-teal-700",
    variant === "dark" && "bg-slate-900 text-white hover:bg-slate-800",
    disabled && "pointer-events-none opacity-50",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}

export function ExportImportAdd({
  entity,
  onAdd,
  onExport,
  onImport,
  addLabel,
}: {
  entity: string;
  onAdd?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  addLabel?: string;
}) {
  return (
    <>
      {onExport && (
        <AdminBtn variant="outline" onClick={onExport}>
          <Download className="h-3.5 w-3.5" /> Export {entity}
        </AdminBtn>
      )}
      {onImport && (
        <AdminBtn variant="outline" onClick={onImport}>
          <Upload className="h-3.5 w-3.5" /> Import {entity}
        </AdminBtn>
      )}
      {onAdd && (
        <AdminBtn variant="primary" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" /> {addLabel ?? `Add ${entity}`}
        </AdminBtn>
      )}
    </>
  );
}

export type Kpi = {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  iconBg?: string;
  sub?: string;
};

export function KpiGrid({ items }: { items: Kpi[] }) {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((k) => (
        <div
          key={k.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-xs font-semibold text-slate-500">{k.label}</div>
            {k.icon && (
              <div className={cn("rounded-xl p-2", k.iconBg ?? "bg-teal-50 text-teal-600")}>
                {k.icon}
              </div>
            )}
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-slate-900">{k.value}</div>
          {(k.trend || k.sub) && (
            <div
              className={cn(
                "mt-1.5 flex items-center gap-1 text-[11px] font-semibold",
                k.trendUp === false ? "text-red-500" : "text-emerald-600",
              )}
            >
              {k.trend && (
                <>
                  {k.trendUp === false ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {k.trend}
                </>
              )}
              {k.sub && !k.trend && <span className="text-slate-500">{k.sub}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function StatusPill({
  status,
}: {
  status: string;
}) {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700",
    paid: "bg-teal-50 text-teal-700",
    completed: "bg-emerald-50 text-emerald-700",
    released: "bg-emerald-50 text-emerald-700",
    connected: "bg-emerald-50 text-emerald-700",
    verified: "bg-emerald-50 text-emerald-700",
    accepted: "bg-teal-50 text-teal-700",
    pending: "bg-amber-50 text-amber-700",
    processing: "bg-blue-50 text-blue-700",
    "in escrow": "bg-blue-50 text-blue-700",
    "in progress": "bg-blue-50 text-blue-700",
    draft: "bg-slate-100 text-slate-600",
    inactive: "bg-slate-100 text-slate-600",
    paused: "bg-amber-50 text-amber-700",
    "on hold": "bg-amber-50 text-amber-700",
    overdue: "bg-red-50 text-red-700",
    suspended: "bg-red-50 text-red-700",
    disputed: "bg-red-50 text-red-700",
    failed: "bg-red-50 text-red-700",
    cancelled: "bg-slate-100 text-slate-600",
    declined: "bg-red-50 text-red-700",
    withdrawn: "bg-violet-50 text-violet-700",
    refunded: "bg-violet-50 text-violet-700",
    filled: "bg-violet-50 text-violet-700",
    expired: "bg-slate-100 text-slate-600",
    blacklisted: "bg-red-50 text-red-700",
    freelancer: "bg-teal-50 text-teal-700",
    client: "bg-blue-50 text-blue-700",
    planning: "bg-violet-50 text-violet-700",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize", map[s] ?? "bg-slate-100 text-slate-600")}>
      {status}
    </span>
  );
}

export function FilterBar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
  tabs,
  activeTab,
  onTabChange,
  onReset,
  onFilters,
}: {
  searchPlaceholder: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children?: React.ReactNode;
  tabs?: { id: string; label: string; count?: number }[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  onReset?: () => void;
  onFilters?: () => void;
}) {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        <input
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="min-w-[200px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-400"
        />
        {children}
        {onFilters && (
          <button
            type="button"
            onClick={onFilters}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Filters
          </button>
        )}
        {onReset && (
          <button type="button" onClick={onReset} className="text-sm font-semibold text-teal-600">
            Reset
          </button>
        )}
      </div>
      {tabs && tabs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange?.(t.id)}
              className={cn(
                "border-b-2 px-3 py-2 text-sm font-semibold transition",
                activeTab === t.id
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-800",
              )}
            >
              {t.label}
              {t.count != null && <span className="ml-1 text-xs text-slate-400">({t.count})</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminTable({
  headers,
  children,
  footer,
}: {
  headers: string[];
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">
                <input type="checkbox" className="rounded border-slate-300" aria-label="Select all" />
              </th>
              {headers.map((h) => (
                <th key={h} className="whitespace-nowrap px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
      {footer && <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">{footer}</div>}
    </div>
  );
}

export function RowActions({
  onApprove,
  onHide,
  onVerify,
  onView,
  onEdit,
  onBlock,
  onUnblock,
  blocked,
  busy,
}: {
  onApprove?: () => void;
  onHide?: () => void;
  onVerify?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  blocked?: boolean;
  busy?: boolean;
} = {}) {
  const hasModeration = onApprove || onHide || onVerify;
  const hasUserActions = onView || onEdit || onBlock || onUnblock;

  if (!hasModeration && !hasUserActions) {
    return (
      <div className="flex items-center gap-1 text-slate-400">
        <button type="button" disabled className="rounded-lg p-1.5 opacity-40" title="No actions">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  if (hasUserActions && !hasModeration) {
    return (
      <div className="flex items-center gap-1 text-slate-500">
        {onView && (
          <button
            type="button"
            disabled={busy}
            onClick={onView}
            className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
            title="View"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            disabled={busy}
            onClick={onEdit}
            className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        {blocked
          ? onUnblock && (
              <button
                type="button"
                disabled={busy}
                onClick={onUnblock}
                className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                title="Unblock"
              >
                Unblock
              </button>
            )
          : onBlock && (
              <button
                type="button"
                disabled={busy}
                onClick={onBlock}
                className="rounded-lg bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                title="Block"
              >
                Block
              </button>
            )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {onApprove && (
        <button
          type="button"
          disabled={busy}
          onClick={onApprove}
          className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
        >
          Approve
        </button>
      )}
      {onVerify && (
        <button
          type="button"
          disabled={busy}
          onClick={onVerify}
          className="rounded-lg bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-100 disabled:opacity-50"
        >
          Verify
        </button>
      )}
      {onHide && (
        <button
          type="button"
          disabled={busy}
          onClick={onHide}
          className="rounded-lg bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
        >
          Hide
        </button>
      )}
    </div>
  );
}

export function AvatarCell({
  name,
  email,
  subtitle,
}: {
  name: string;
  email?: string;
  subtitle?: string;
}) {
  const initial = (name || email || "?").slice(0, 1).toUpperCase();
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
        {initial}
      </div>
      <div className="min-w-0">
        <div className="truncate font-bold text-slate-900">{name || "-"}</div>
        {(email || subtitle) && (
          <div className="truncate text-xs text-slate-500">{email || subtitle}</div>
        )}
      </div>
    </div>
  );
}

export function SidePanel({ children }: { children: React.ReactNode }) {
  return <aside className="space-y-4 xl:w-[300px] xl:shrink-0">{children}</aside>;
}

export function SideCard({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-slate-900">{title}</h3>
      {children}
      {footer && <div className="mt-3 border-t border-slate-100 pt-3 text-xs font-semibold text-teal-600">{footer}</div>}
    </div>
  );
}

export function ErrorBanner({
  message,
  onViewLogs,
}: {
  message: string;
  onViewLogs?: () => void;
}) {
  // Never show broken auth / config banners - they are not actionable in-app.
  const lower = (message || "").toLowerCase();
  if (
    !message?.trim() ||
    lower.includes("authentication is unavailable") ||
    lower.includes("authorization is temporarily unavailable") ||
    lower.includes("authentication is temporarily unavailable") ||
    lower.includes("auth_unavailable") ||
    lower.includes("stats request failed")
  ) {
    return null;
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <div className="flex items-center gap-2 font-semibold">
        <span>{message}</span>
      </div>
      {onViewLogs && (
        <button
          type="button"
          onClick={onViewLogs}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50"
        >
          View logs
        </button>
      )}
    </div>
  );
}

export function PageLayout({
  main,
  side,
}: {
  main: React.ReactNode;
  side?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row">
      <div className="min-w-0 flex-1">{main}</div>
      {side}
    </div>
  );
}

export function money(n: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${n.toLocaleString()}`;
  }
}

export function fmtDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function relative(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
