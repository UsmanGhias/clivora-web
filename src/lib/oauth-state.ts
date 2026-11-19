import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const OAUTH_SIGNING_SECRET =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.GOOGLE_CLIENT_SECRET ||
  "clivora_oauth_state_signing_fallback_key";

export interface OAuthStatePayload {
  uid: string;
  action: string;
  ts: number;
}

export function createSignedOAuthState(userId: string, action: string): string {
  const payload: OAuthStatePayload = {
    uid: userId,
    action,
    ts: Date.now(),
  };

  const json = JSON.stringify(payload);
  const payloadB64 = Buffer.from(json, "utf8").toString("base64url");
  const signature = createHmac("sha256", OAUTH_SIGNING_SECRET)
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
  if (!rawState || typeof rawState !== "string") {
    return { valid: false, error: "missing_state" };
  }

  const parts = rawState.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "invalid_state_format" };
  }

  const [payloadB64, providedSig] = parts;

  const expectedSig = createHmac("sha256", OAUTH_SIGNING_SECRET)
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
