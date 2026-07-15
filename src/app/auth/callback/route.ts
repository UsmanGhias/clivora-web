import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { earlyAccessPlanForSignup } from "@/lib/early-access";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";
  const accountTypeParam = searchParams.get("account_type");
  // Always land on production host (never localhost from email templates).
  const base = site.url.replace(/\/$/, "");

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
        .select("subscription_plan")
        .eq("id", data.user.id)
        .maybeSingle();
      const existingPlan = String(existingProfile?.subscription_plan ?? "").toLowerCase();
      const subscriptionPlan = existingPlan && existingPlan !== "free" ? existingPlan : earlyAccessPlanForSignup();

      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email ?? "",
        name:
          (meta.full_name as string | undefined) ||
          (meta.name as string | undefined) ||
          data.user.email?.split("@")[0] ||
          "",
        account_type: accountType === "client" ? "client" : "freelancer",
        subscription_plan: subscriptionPlan,
        updated_at: new Date().toISOString(),
      });
      return NextResponse.redirect(`${base}${next.startsWith("/") ? next : `/${next}`}`);
    }
  }

  return NextResponse.redirect(`${base}/login?error=auth_callback`);
}
