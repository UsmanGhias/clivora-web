import { getProfile } from "@/lib/profile";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { redirect } from "next/navigation";
import { CampaignsClient } from "./CampaignsClient";

export default async function CampaignsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const enabled =
    (await isFeatureEnabled("campaigns")) || (await isFeatureEnabled("phase6_campaigns"));
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Campaigns</h1>
        <p className="text-sm text-text-secondary">
          In-product content publishing (Draft → Published). Not email/IMAP.
        </p>
      </div>
      {enabled ? (
        <CampaignsClient />
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-text-secondary">
          Campaigns are behind a feature flag and not enabled yet. Ask an admin after Gates 1–12.
        </p>
      )}
    </div>
  );
}
