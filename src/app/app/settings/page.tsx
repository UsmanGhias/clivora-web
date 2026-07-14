import { redirect } from "next/navigation";
import { getProfile, isClientAccount, planLabel } from "@/lib/profile";
import { isProPlus } from "@/lib/plan";
import { createClient } from "@/lib/supabase/server";
import { ClientSettingsPanel } from "@/components/client/ClientSettingsPanel";
import { FreelancerSettingsPanel } from "@/components/freelancer/FreelancerSettingsPanel";

export const metadata = { title: "Settings" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const params = searchParams ? await searchParams : {};
  const tab = (params.tab as string) || "account";

  if (isClientAccount(profile)) {
    const supabase = await createClient();
    const uid = profile.id;
    let jobsPosted = 0;
    let activeProjects = 0;
    let invoices = 0;
    let totalSpent = 0;
    try {
      const [jobs, projects, inv] = await Promise.all([
        supabase
          .from("connect_need_posts")
          .select("id", { count: "exact", head: true })
          .eq("client_user_id", uid),
        supabase
          .from("project_shares")
          .select("share_id", { count: "exact", head: true })
          .eq("client_uid", uid),
        supabase
          .from("invoice_shares")
          .select("share_id, total")
          .eq("client_uid", uid)
          .limit(200),
      ]);
      jobsPosted = jobs.count ?? 0;
      activeProjects = projects.count ?? 0;
      if (inv.data) {
        invoices = inv.data.length;
        totalSpent = inv.data.reduce((s, r) => s + (Number(r.total) || 0), 0);
      }
    } catch {
      /* ignore */
    }
    return (
      <ClientSettingsPanel
        profile={profile}
        plan={planLabel(profile)}
        plus={isProPlus(profile)}
        stats={{ jobsPosted, activeProjects, invoices, totalSpent }}
      />
    );
  }

  const supabase = await createClient();
  let hasStripeBilling = false;
  try {
    const { data } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", profile.id)
      .maybeSingle();
    hasStripeBilling = Boolean(data?.stripe_customer_id);
  } catch {
    /* ignore */
  }

  return (
    <FreelancerSettingsPanel
      profile={profile}
      plan={planLabel(profile)}
      plus={isProPlus(profile)}
      hasStripeBilling={hasStripeBilling}
      initialTab={tab}
    />
  );
}
