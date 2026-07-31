import { randomBytes } from "node:crypto";
import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";
import { hashApiToken, type ApiScope } from "@/lib/api-v1/auth";

export const runtime = "nodejs";

const ALLOWED_SCOPES = ["contacts:read", "projects:read"] satisfies ApiScope[];

type ApiKeyListRow = {
  id: string;
  owner_uid: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

function normalizeScopes(value: unknown) {
  if (!Array.isArray(value)) return [] as ApiScope[];
  const scopes = value
    .map((scope) => String(scope).trim())
    .filter((scope): scope is ApiScope =>
      ALLOWED_SCOPES.includes(scope as (typeof ALLOWED_SCOPES)[number]),
    );
  return [...new Set(scopes)];
}

function mapKey(row: ApiKeyListRow) {
  return {
    id: row.id,
    ownerUid: row.owner_uid,
    name: row.name,
    keyPrefix: row.key_prefix,
    scopes: row.scopes ?? [],
    lastUsedAt: row.last_used_at,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
    createdAt: row.created_at,
  };
}

async function readError(res: Response) {
  return (await res.text().catch(() => "")) || `Supabase request failed (${res.status})`;
}

export async function GET() {
  let admin;
  try {
    admin = await requireAdmin({ requireAal2: false });
  } catch (error) {
    return adminErrorResponse(error);
  }

  try {
    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const endpoint = new URL(`${url}/rest/v1/api_keys`);
    endpoint.searchParams.set(
      "select",
      "id,owner_uid,name,key_prefix,scopes,last_used_at,expires_at,revoked_at,created_at",
    );
    endpoint.searchParams.set("owner_uid", `eq.${admin.id}`);
    endpoint.searchParams.set("order", "created_at.desc");
    endpoint.searchParams.set("limit", "100");

    const res = await fetch(endpoint, {
      headers: adminServiceHeaders(serviceRoleKey),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(await readError(res));
    }
    const rows = (await res.json()) as ApiKeyListRow[];
    return adminJson({ keys: rows.map(mapKey), allowedScopes: ALLOWED_SCOPES });
  } catch (error) {
    return adminErrorResponse(error, "Could not load API keys");
  }
}

export async function POST(request: Request) {
  let admin;
  try {
    admin = await requireAdmin({ requireAal2: true });
  } catch (error) {
    return adminErrorResponse(error);
  }

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    scopes?: unknown;
    expiresAt?: string | null;
  };
  const name = String(body.name ?? "").trim();
  const scopes = normalizeScopes(body.scopes);
  const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

  if (!name) {
    return adminJson({ error: "API key name is required" }, { status: 400 });
  }
  if (!scopes.length) {
    return adminJson({ error: "At least one API scope is required" }, { status: 400 });
  }
  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return adminJson({ error: "expiresAt must be a valid ISO date" }, { status: 400 });
  }

  try {
    const token = `clv_${randomBytes(32).toString("base64url")}`;
    const keyPrefix = token.slice(0, 12);
    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const res = await fetch(`${url}/rest/v1/api_keys`, {
      method: "POST",
      headers: adminServiceHeaders(serviceRoleKey, "return=representation"),
      body: JSON.stringify({
        owner_uid: admin.id,
        name,
        key_prefix: keyPrefix,
        key_hash: hashApiToken(token),
        scopes,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(await readError(res));
    }
    const rows = (await res.json()) as ApiKeyListRow[];
    return adminJson(
      {
        token,
        key: rows[0] ? mapKey(rows[0]) : null,
        warning: "Copy this token now. CLIVORA stores only its SHA-256 hash and cannot show it again.",
      },
      { status: 201 },
    );
  } catch (error) {
    return adminErrorResponse(error, "Could not create API key");
  }
}
