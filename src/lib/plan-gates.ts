import type { Profile } from "@/lib/profile-types";
import { isPro } from "@/lib/plan";
import { site } from "@/lib/site";

/** Mirrors Flutter PlanLimits for web create gates. */
export const FREE_MAX_CLIENTS = site.freeLimits.clients;
export const FREE_MAX_PROJECTS = site.freeLimits.projects;
export const FREE_MAX_INVOICES_PER_MONTH = site.freeLimits.invoicesPerMonth;

export function canCreateCustomer(profile: Profile | null, currentCount: number) {
  if (isPro(profile)) return { ok: true as const };
  if (currentCount >= FREE_MAX_CLIENTS) {
    return {
      ok: false as const,
      reason: `Free plan allows ${FREE_MAX_CLIENTS} clients. Upgrade to Pro for unlimited.`,
      upgradeHref: "/pro",
    };
  }
  return { ok: true as const };
}

export function canCreateProject(profile: Profile | null, currentCount: number) {
  if (isPro(profile)) return { ok: true as const };
  if (currentCount >= FREE_MAX_PROJECTS) {
    return {
      ok: false as const,
      reason: `Free plan allows ${FREE_MAX_PROJECTS} projects. Upgrade to Pro for unlimited.`,
      upgradeHref: "/pro",
    };
  }
  return { ok: true as const };
}

export function canCreateInvoice(profile: Profile | null, invoicesThisMonth: number) {
  if (isPro(profile)) return { ok: true as const };
  if (invoicesThisMonth >= FREE_MAX_INVOICES_PER_MONTH) {
    return {
      ok: false as const,
      reason: `Free plan allows ${FREE_MAX_INVOICES_PER_MONTH} invoices/month. Upgrade to Pro for unlimited.`,
      upgradeHref: "/pro",
    };
  }
  return { ok: true as const };
}

export function invoicesCreatedThisMonth(rows: Array<{ created_at?: string | null }>) {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  return rows.filter((r) => {
    if (!r.created_at) return false;
    const d = new Date(r.created_at);
    return d.getUTCFullYear() === y && d.getUTCMonth() === m;
  }).length;
}
