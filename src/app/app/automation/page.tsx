import { getProfile } from "@/lib/profile";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { redirect } from "next/navigation";
import { AutomationClient } from "./AutomationClient";

export default async function AutomationPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const enabled =
    (await isFeatureEnabled("automation_builder")) ||
    (await isFeatureEnabled("phase7_automation_builder"));
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Automation</h1>
        <p className="text-sm text-text-secondary">
          Trigger/action rules enqueue durable jobs (no silent discard).
        </p>
      </div>
      {enabled ? (
        <AutomationClient />
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-text-secondary">
          Automation builder is behind a feature flag and not enabled yet.
        </p>
      )}
    </div>
  );
}
