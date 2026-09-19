import "server-only";

import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase-browser";

export type AdminPrincipal = {
  id: string;
  email: string;
  assuranceLevel: "aal1" | "aal2";
};

export class AdminAuthError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403 | 503,
    public readonly code:
      | "AUTH_REQUIRED"
      | "ADMIN_REQUIRED"
      | "MFA_REQUIRED"
      | "AUTH_UNAVAILABLE",
  ) {
    super(message);
    this.name = "AdminAuthError";
  }
}

/**
 * Align with `@/lib/supabase-browser` + `createClient()` so admin API routes do not
 * 503 when NEXT_PUBLIC_* is unset but the shared fallbacks / SUPABASE_* still work.
 */
function assertSupabaseAuthConfig() {
  if (!SUPABASE_URL?.trim() || !SUPABASE_ANON_KEY?.trim()) {
    throw new AdminAuthError(
      "Admin authentication is unavailable.",
      503,
      "AUTH_UNAVAILABLE",
    );
  }
}

type AuthClient = Awaited<ReturnType<typeof createClient>>;

async function authorizeAdminClient(
  supabase: AuthClient,
  options: { requireAal2?: boolean } = {},
): Promise<AdminPrincipal> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new AdminAuthError("Sign in required.", 401, "AUTH_REQUIRED");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, account_type, is_blocked, is_restricted")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("admin profile lookup failed", profileError.message);
    throw new AdminAuthError(
      "Admin authorization is temporarily unavailable.",
      503,
      "AUTH_UNAVAILABLE",
    );
  }

  if (
    !profile ||
    (profile.role !== "admin" && profile.account_type !== "admin") ||
    profile.is_blocked === true ||
    profile.is_restricted === true
  ) {
    throw new AdminAuthError("Admin role required.", 403, "ADMIN_REQUIRED");
  }

  // MFA AAL lookup can fail when the user has no factors enrolled. For read-only
  // admin gates (requireAal2=false) treat that as aal1 so the console still loads.
  const { data: aal, error: aalError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const levelRaw = aalError || !aal ? "aal1" : aal.currentLevel;
  const level: AdminPrincipal["assuranceLevel"] =
    levelRaw === "aal2" ? "aal2" : "aal1";

  if (options.requireAal2 && level !== "aal2") {
    throw new AdminAuthError(
      "Two-factor authentication is required for this action.",
      403,
      "MFA_REQUIRED",
    );
  }

  return {
    id: user.id,
    email: user.email ?? "",
    assuranceLevel: level,
  } satisfies AdminPrincipal;
}

/**
 * Authorize an admin from the verified Supabase cookie session.
 *
 * Email allowlists, request-body credentials, and user metadata are deliberately
 * ignored. The role must be present on the caller's own database profile row.
 */
export async function requireAdmin(options: { requireAal2?: boolean } = {}) {
  assertSupabaseAuthConfig();
  const supabase = await createClient();
  return authorizeAdminClient(supabase, options);
}

/**
 * Prefer cookie session; fall back to Authorization Bearer so client actions that
 * send the access token still work when SSR cookies were missing after login.
 */
export async function requireAdminRequest(
  request: Request,
  options: { requireAal2?: boolean } = { requireAal2: true },
) {
  assertSupabaseAuthConfig();
  try {
    return await requireAdmin(options);
  } catch (err) {
    if (!(err instanceof AdminAuthError) || err.code !== "AUTH_REQUIRED") {
      throw err;
    }
    const header = request.headers.get("Authorization") ?? "";
    if (!header.startsWith("Bearer ")) throw err;
    const token = header.slice("Bearer ".length).trim();
    if (!token) throw err;

    const supabase = createSupabaseJsClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    }) as unknown as AuthClient;

    return authorizeAdminClient(supabase, options);
  }
}

const PRIVATE_NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Vary: "Cookie, Authorization",
};

export function adminJson(body: unknown, init: ResponseInit = {}) {
  const response = NextResponse.json(body, init);
  for (const [key, value] of Object.entries(PRIVATE_NO_STORE_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export function adminErrorResponse(error: unknown, fallback = "Admin request failed") {
  if (error instanceof AdminAuthError) {
    return adminJson(
      { error: error.message, code: error.code },
      { status: error.status },
    );
  }

  // Do not return upstream database or service-role errors to the browser.
  console.error(fallback, error);
  return adminJson({ error: fallback }, { status: 500 });
}
