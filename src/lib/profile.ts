import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/profile-types";

export type { Profile, AccountType } from "@/lib/profile-types";
export {
  isClientAccount,
  isPro,
  isProPlus,
  planLabel,
} from "@/lib/plan";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, email, name, account_type, subscription_plan, role, is_blocked, is_restricted, block_reason, avatar_url",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (data) return data as Profile;

  return {
    id: user.id,
    email: user.email ?? null,
    name: (user.user_metadata?.name as string | undefined) ?? null,
    account_type: (user.user_metadata?.account_type as string | undefined) ?? "freelancer",
    subscription_plan: "free",
    is_blocked: false,
    is_restricted: false,
  };
}

export function isBlocked(profile: Profile | null) {
  return profile?.is_blocked === true;
}

export function isRestricted(profile: Profile | null) {
  return profile?.is_restricted === true;
}
