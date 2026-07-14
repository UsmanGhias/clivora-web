import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import {
  AdminServiceConfigurationError,
  requireAdminServiceConfig,
} from "@/lib/admin-service";
import { adminStats, loadEvents } from "@/lib/admin-store";
import {
  buildStats,
  fetchEventsFromSupabase,
  fetchProfileCount,
  fetchProfilesFromSupabase,
} from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin({ requireAal2: true });

    try {
      requireAdminServiceConfig();
    } catch (error) {
      if (error instanceof AdminServiceConfigurationError) {
        // Soft-fail: return degraded payload so UI can show 503 banner without blanking the panel
        const localStats = adminStats();
        return adminJson({
          ...localStats,
          totalProfiles: 0,
          proProfiles: 0,
          clientProfiles: 0,
          freelancerProfiles: 0,
          profiles: [],
          source: "degraded",
          warning: "Stats request failed (503)",
          events: loadEvents()
            .filter((event) => !event.eventType.startsWith("audit_"))
            .slice(0, 150),
        });
      }
      throw error;
    }

    const [cloudEvents, profileCount, profiles] = await Promise.all([
      fetchEventsFromSupabase(500),
      fetchProfileCount(),
      fetchProfilesFromSupabase(100),
    ]);

    if (cloudEvents.length > 0) {
      return adminJson(buildStats(cloudEvents, profileCount, profiles));
    }

    const localStats = adminStats();
    return adminJson({
      ...localStats,
      totalProfiles: profileCount || profiles.length,
      proProfiles: profiles.filter((profile) => profile.plan === "pro").length,
      clientProfiles: profiles.filter((profile) => profile.accountType === "client").length,
      freelancerProfiles: profiles.filter((profile) => profile.accountType !== "client").length,
      profiles,
      source: profiles.length > 0 ? "supabase" : "local",
      events: loadEvents()
        .filter((event) => !event.eventType.startsWith("audit_"))
        .slice(0, 150),
    });
  } catch (error) {
    return adminErrorResponse(error, "Could not load admin statistics");
  }
}
