import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import { loadPlatformSnapshot } from "@/lib/admin-platform";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin({ requireAal2: true });
    const snapshot = await loadPlatformSnapshot();
    // Always 200 — soft-fail 503 appears as warning banner in UI (mockup parity)
    return adminJson(snapshot);
  } catch (error) {
    return adminErrorResponse(error, "Could not load admin platform data");
  }
}
