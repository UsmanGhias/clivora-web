import "server-only";

import { createHash } from "node:crypto";
import {
  AdminServiceConfigurationError,
  adminServiceHeaders,
  requireAdminServiceConfig,
} from "@/lib/admin-service";

export type ApiScope = "contacts:read" | "projects:read";

export type ApiKeyPrincipal = {
  keyId: string;
  ownerUid: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
};

export class ApiAuthError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403 | 503,
    public readonly code:
      | "AUTH_REQUIRED"
      | "INVALID_TOKEN"
      | "TOKEN_EXPIRED"
      | "TOKEN_REVOKED"
      | "INSUFFICIENT_SCOPE"
      | "AUTH_UNAVAILABLE",
  ) {
    super(message);
    this.name = "ApiAuthError";
  }
}

type ApiKeyRow = {
  id: string;
  owner_uid: string;
  name: string;
  key_prefix: string;
  scopes: string[] | null;
  expires_at: string | null;
  revoked_at: string | null;
};

export function parseBearerToken(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token, extra] = header.trim().split(/\s+/);
  if (scheme?.toLowerCase() !== "bearer" || !token || extra) {
    throw new ApiAuthError("Bearer token required.", 401, "AUTH_REQUIRED");
  }
  return token;
}

export function hashApiToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function serviceConfig() {
  try {
    return requireAdminServiceConfig();
  } catch (error) {
    if (error instanceof AdminServiceConfigurationError) {
      throw new ApiAuthError("API authentication is unavailable.", 503, "AUTH_UNAVAILABLE");
    }
    throw error;
  }
}

async function markLastUsed(keyId: string) {
  const { url, serviceRoleKey } = serviceConfig();
  const res = await fetch(`${url}/rest/v1/api_keys?id=eq.${encodeURIComponent(keyId)}`, {
    method: "PATCH",
    headers: adminServiceHeaders(serviceRoleKey, "return=minimal"),
    body: JSON.stringify({ last_used_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.warn("api key last_used_at update failed", res.status);
  }
}

export async function requireApiKey(request: Request, requiredScopes: ApiScope[]) {
  const token = parseBearerToken(request);
  const tokenHash = hashApiToken(token);
  const { url, serviceRoleKey } = serviceConfig();
  const lookupUrl = `${url}/rest/v1/api_keys?select=id,owner_uid,name,key_prefix,scopes,expires_at,revoked_at&key_hash=eq.${encodeURIComponent(tokenHash)}&limit=1`;
  const res = await fetch(lookupUrl, {
    headers: adminServiceHeaders(serviceRoleKey),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new ApiAuthError("API authentication is unavailable.", 503, "AUTH_UNAVAILABLE");
  }

  const rows = (await res.json()) as ApiKeyRow[];
  const row = rows[0];
  if (!row) {
    throw new ApiAuthError("Invalid API token.", 401, "INVALID_TOKEN");
  }
  if (row.revoked_at) {
    throw new ApiAuthError("API token has been revoked.", 403, "TOKEN_REVOKED");
  }
  if (row.expires_at && Date.parse(row.expires_at) <= Date.now()) {
    throw new ApiAuthError("API token has expired.", 403, "TOKEN_EXPIRED");
  }

  const scopes = row.scopes ?? [];
  const missing = requiredScopes.filter((scope) => !scopes.includes(scope));
  if (missing.length) {
    throw new ApiAuthError("API token is missing required scope.", 403, "INSUFFICIENT_SCOPE");
  }

  await markLastUsed(row.id);
  return {
    keyId: row.id,
    ownerUid: row.owner_uid,
    name: row.name,
    keyPrefix: row.key_prefix,
    scopes,
  } satisfies ApiKeyPrincipal;
}
