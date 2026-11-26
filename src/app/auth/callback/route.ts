import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { earlyAccessPlanForSignup } from "@/lib/early-access";
import { safeNextPath } from "@/lib/safe-redirect";
import { getPublicSiteUrl } from "@/lib/site-url";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));
  const accountTypeParam = searchParams.get("account_type");
  const base = getPublicSiteUrl();

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const meta = data.user.user_metadata ?? {};
      const accountType =
        accountTypeParam ||
        (meta.account_type as string | undefined) ||
        (meta.accountType as string | undefined) ||
        "freelancer";
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, subscription_plan, account_type")
        .eq("id", data.user.id)
        .maybeSingle();

      const patch: Record<string, unknown> = {
        id: data.user.id,
        email: data.user.email ?? "",
        name:
          (meta.full_name as string | undefined) ||
          (meta.name as string | undefined) ||
          data.user.email?.split("@")[0] ||
          "",
        updated_at: new Date().toISOString(),
      };

      // Never overwrite an existing role or paid/free plan on login.
      if (!existingProfile) {
        patch.account_type = accountType === "client" ? "client" : "freelancer";
        patch.subscription_plan = earlyAccessPlanForSignup();
      }

      await supabase.from("profiles").upsert(patch);
      return NextResponse.redirect(`${base}${next}`);
    }
  }

  return NextResponse.redirect(`${base}/login?error=auth_callback`);
}
