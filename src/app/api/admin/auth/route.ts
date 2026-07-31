import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Session introspection only. Supabase Auth owns login, logout, and passwords. */
export async function GET() {
  try {
    const principal = await requireAdmin();
    return adminJson({
      ok: true,
      email: principal.email,
      assuranceLevel: principal.assuranceLevel,
    });
  } catch (error) {
    return adminErrorResponse(error, "Could not verify the admin session");
  }
}

export async function POST() {
  return adminJson(
    {
      error: "Password-based admin authentication has been removed. Use CLIVORA sign-in.",
      code: "AUTH_METHOD_REMOVED",
    },
    { status: 405, headers: { Allow: "GET" } },
  );
}
