import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

function getOAuthSigningSecret(): string | null {
  const secret =
    process.env.OAUTH_STATE_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.GOOGLE_CLIENT_SECRET?.trim() ||
    "";
  return secret || null;
}

export interface OAuthStatePayload {
  uid: string;
  action: string;
  ts: number;
}

export function createSignedOAuthState(userId: string, action: string): string {
  const secret = getOAuthSigningSecret();
  if (!secret) {
    throw new Error("OAUTH_STATE_SECRET (or service/client signing key) is not configured.");
  }

  const payload: OAuthStatePayload = {
    uid: userId,
    action,
    ts: Date.now(),
  };

  const json = JSON.stringify(payload);
  const payloadB64 = Buffer.from(json, "utf8").toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifySignedOAuthState(
  rawState: string | null | undefined,
  expectedUserId: string,
  expectedAction: string,
  maxAgeMs = 15 * 60 * 1000 // 15 minutes
): { valid: boolean; error?: string } {
  const secret = getOAuthSigningSecret();
  if (!secret) {
    return { valid: false, error: "missing_signing_secret" };
  }

  if (!rawState || typeof rawState !== "string") {
    return { valid: false, error: "missing_state" };
  }

  const parts = rawState.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "invalid_state_format" };
  }

  const [payloadB64, providedSig] = parts;

  const expectedSig = createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  const expectedBuffer = Buffer.from(expectedSig);
  const providedBuffer = Buffer.from(providedSig);

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return { valid: false, error: "invalid_state_signature" };
  }

  try {
    const json = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(json) as OAuthStatePayload;

    if (!payload || typeof payload !== "object") {
      return { valid: false, error: "invalid_state_payload" };
    }

    if (payload.uid !== expectedUserId) {
      return { valid: false, error: "state_user_mismatch" };
    }

    if (payload.action !== expectedAction) {
      return { valid: false, error: "state_action_mismatch" };
    }

    const age = Date.now() - payload.ts;
    if (age < 0 || age > maxAgeMs) {
      return { valid: false, error: "state_expired" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "malformed_state" };
  }
}
