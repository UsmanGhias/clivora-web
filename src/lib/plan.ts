import type { Profile } from "@/lib/profile-types";

export type { Profile, AccountType } from "@/lib/profile-types";

export function isClientAccount(profile: Profile | null) {
  return (profile?.account_type ?? "").toLowerCase() === "client";
}

export function isProPlus(profile: Profile | null) {
  const plan = (profile?.subscription_plan ?? "free").toLowerCase();
  return plan === "pro_plus" || plan === "plus" || plan === "proplus";
}

export function isPro(profile: Profile | null) {
  const plan = (profile?.subscription_plan ?? "free").toLowerCase();
  return plan === "pro" || isProPlus(profile);
}

export function planLabel(profile: Profile | null) {
  if (isProPlus(profile)) return "Pro Plus";
  if (isPro(profile)) return "Pro";
  return "Free";
}
