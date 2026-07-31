import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import { loadPlatformSnapshot } from "@/lib/admin-platform";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Read snapshot at AAL1 so the console works before MFA; mutations stay AAL2.
    await requireAdmin({ requireAal2: false });
    const snapshot = await loadPlatformSnapshot();
    return adminJson(snapshot);
  } catch (error) {
    return adminErrorResponse(error, "Could not load admin platform data");
  }
}
