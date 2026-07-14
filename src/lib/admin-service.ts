import "server-only";

import { SUPABASE_URL as BROWSER_SUPABASE_URL } from "@/lib/supabase-browser";

export class AdminServiceConfigurationError extends Error {
  constructor() {
    super("Admin service configuration is unavailable.");
    this.name = "AdminServiceConfigurationError";
  }
}

export function requireAdminServiceConfig() {
  const url =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    BROWSER_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new AdminServiceConfigurationError();
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new AdminServiceConfigurationError();
  }
  if (parsed.protocol !== "https:") {
    throw new AdminServiceConfigurationError();
  }

  return { url: parsed.origin, serviceRoleKey };
}

export function adminServiceHeaders(serviceRoleKey: string, prefer?: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}
