import { describe, expect, it } from "vitest";
import {
  buildClientShareFilter,
  consumeIpRateLimit,
  escapeHtml,
  extractAuthToken,
  getClientIp,
  isSafepayPaidState,
  sanitizePostgrestSearch,
  sanitizePostgrestToken,
  serializeJsonLd,
  timingSafeStringEqual,
} from "./security-utils";

describe("security-utils", () => {
  it("classifies SafePay unpaid states safely without substring traps", () => {
    expect(isSafepayPaidState("UNPAID")).toBe(false);
    expect(isSafepayPaidState("unpaid")).toBe(false);
    expect(isSafepayPaidState("NOT_PAID")).toBe(false);
    expect(isSafepayPaidState("FAILED")).toBe(false);
    expect(isSafepayPaidState("CANCELLED")).toBe(false);
    expect(isSafepayPaidState("PENDING")).toBe(false);
    expect(isSafepayPaidState("")).toBe(false);
    expect(isSafepayPaidState(null)).toBe(false);

    expect(isSafepayPaidState("PAID")).toBe(true);
    expect(isSafepayPaidState("ENDED")).toBe(true);
    expect(isSafepayPaidState("COMPLETED")).toBe(true);
    expect(isSafepayPaidState("SETTLED")).toBe(true);
  });

  it("compares secrets in constant time", () => {
    expect(timingSafeStringEqual("secret-123", "secret-123")).toBe(true);
    expect(timingSafeStringEqual("secret-123", "secret-124")).toBe(false);
    expect(timingSafeStringEqual("short", "much-longer-secret")).toBe(false);
    expect(timingSafeStringEqual("", "")).toBe(false);
    expect(timingSafeStringEqual(null, "abc")).toBe(false);
  });

  it("extracts bearer and custom header tokens", () => {
    const reqBearer = new Request("https://clivora.io/api/cron/autonomous-engine", {
      headers: { Authorization: "Bearer my-cron-token" },
    });
    expect(extractAuthToken(reqBearer, ["x-cron-secret"])).toBe("my-cron-token");

    const reqHeader = new Request("https://clivora.io/api/cron/autonomous-engine", {
      headers: { "x-cron-secret": "header-token" },
    });
    expect(extractAuthToken(reqHeader, ["x-cron-secret"])).toBe("header-token");
  });

  it("strips PostgREST operator injection syntax from search strings", () => {
    expect(sanitizePostgrestSearch("react),claim_token.ilike.*")).toBe(
      "react claim_token ilike",
    );
    expect(sanitizePostgrestToken("valid_slug-123")).toBe("valid_slug-123");
    expect(sanitizePostgrestToken("evil,eq.1")).toBeNull();
  });

  it("escapes HTML metacharacters cleanly", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(`<script>alert("x'&")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&#39;&amp;&quot;)&lt;/script&gt;",
    );
  });

  it("escapes script-closing sequences and line separators in JSON-LD", () => {
    const serialized = serializeJsonLd({
      title: "</script><img onerror=alert(1)> & \u2028 \u2029",
    });
    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<");
    expect(serialized).not.toContain(">");
    expect(serialized).not.toContain("&");
    expect(serialized).not.toContain("\u2028");
    expect(serialized).not.toContain("\u2029");
    expect(JSON.parse(serialized)).toEqual({
      title: "</script><img onerror=alert(1)> & \u2028 \u2029",
    });
  });

  it("builds safe PostgREST client share filters without operator injection", () => {
    expect(
      buildClientShareFilter("11111111-2222-3333-4444-555555555555", "Client@Example.COM"),
    ).toBe(
      'client_uid.eq.11111111-2222-3333-4444-555555555555,client_email.eq."client@example.com"',
    );
    // Rejects comma/paren injection in uid or email
    expect(buildClientShareFilter("bad,uid", "evil),or(client_uid.neq.0@x.com")).toBe(
      "client_uid.is.null",
    );
  });

  it("enforces sliding-window per-IP rate limits", () => {
    const ns = `test-ns-${Math.random().toString(36).slice(2)}`;
    const req = new Request("https://clivora.io/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" },
    });
    const ip = getClientIp(req);
    expect(ip).toBe("203.0.113.9");

    const first = consumeIpRateLimit(ns, ip, 2, 60_000);
    const second = consumeIpRateLimit(ns, ip, 2, 60_000);
    const third = consumeIpRateLimit(ns, ip, 2, 60_000);

    expect(first).toEqual({ allowed: true, retryAfterSeconds: 0, remaining: 1 });
    expect(second).toEqual({ allowed: true, retryAfterSeconds: 0, remaining: 0 });
    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    expect(third.remaining).toBe(0);
  });
});
