import type { Profile } from "@/lib/profile-types";

export type { Profile, AccountType } from "@/lib/profile-types";

/**
 * 1-Year Founder Launch: every registered user gets Pro Plus at $0 platform fee.
 * Flip to `false` to restore paid-plan gating everywhere (plan-gates, AppShell, Connect, AskAi).
 */
export const FOUNDER_PROMO_ACTIVE = true;

const PRO_PLUS_PLANS = new Set(["pro_plus", "plus", "proplus", "founder_annual"]);
const PRO_PLANS = new Set([...PRO_PLUS_PLANS, "pro"]);
const PROMO_ELIGIBLE_PLANS = new Set([...PRO_PLANS, "free"]);

function planOf(profile: Profile | null) {
  return (profile?.subscription_plan ?? "free").toLowerCase();
}

export function isClientAccount(profile: Profile | null) {
  return (profile?.account_type ?? "").toLowerCase() === "client";
}

/** Paid-plan rules, independent of the founder promotion. */
export function hasPaidPro(profile: Profile | null) {
  return PRO_PLANS.has(planOf(profile));
}

export function hasPaidProPlus(profile: Profile | null) {
  return PRO_PLUS_PLANS.has(planOf(profile));
}

export function paidPlanLabel(profile: Profile | null) {
  const plan = planOf(profile);
  if (PRO_PLUS_PLANS.has(plan)) return "Pro Plus";
  if (plan === "pro") return "Pro";
  return "Free";
}

export function isProPlus(profile: Profile | null) {
  if (FOUNDER_PROMO_ACTIVE) return profile === null || PROMO_ELIGIBLE_PLANS.has(planOf(profile));
  return hasPaidProPlus(profile);
}

export function isPro(profile: Profile | null) {
  return FOUNDER_PROMO_ACTIVE || hasPaidPro(profile);
}

export function planLabel(profile: Profile | null) {
  if (!FOUNDER_PROMO_ACTIVE) return paidPlanLabel(profile);
  const plan = (profile?.subscription_plan ?? "pro_plus").toLowerCase();
  if (plan === "pro_plus" || plan === "founder_annual") return "Founder Pro Plus (1 Year Free)";
  return "Founder Pro (1 Year Free)";
}
