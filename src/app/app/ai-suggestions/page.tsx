import { getProfile } from "@/lib/profile";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { redirect } from "next/navigation";
import { AiSuggestionsClient } from "./AiSuggestionsClient";

export default async function AiSuggestionsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const enabled =
    (await isFeatureEnabled("ai_structured")) || (await isFeatureEnabled("phase8_ai_structured"));
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">AI suggestions</h1>
        <p className="text-sm text-text-secondary">
          Structured suggestions require human review. Never auto-pay or auto-publish.
        </p>
      </div>
      {enabled ? (
        <AiSuggestionsClient />
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-text-secondary">
          Structured AI suggestions are behind a feature flag and not enabled yet.
        </p>
      )}
    </div>
  );
}
