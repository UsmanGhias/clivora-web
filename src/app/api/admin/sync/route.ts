import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * The legacy shared-key sync endpoint accepted caller-supplied identities.
 * It stays disabled until the Android client uses the authenticated database RPC.
 */
export async function POST() {
  try {
    await requireAdmin({ requireAal2: true });
    return adminJson(
      {
        error: "Legacy admin sync has been retired. Update the app to use authenticated sync.",
        code: "SYNC_ENDPOINT_RETIRED",
      },
      { status: 410 },
    );
  } catch (error) {
    return adminErrorResponse(error, "Admin sync is unavailable");
  }
}
