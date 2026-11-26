import { describe, expect, it } from "vitest";
import {
  PUBLIC_JOB_SELECT,
  sanitizeJobPatchBody,
  sanitizeJobStatus,
  sanitizeSlugOrUuidFilter,
  verifyJobBotApiKey,
} from "./jobs-helpers";

describe("api-v1/jobs-helpers", () => {
  it("excludes sensitive columns from public job selection", () => {
    const columns = PUBLIC_JOB_SELECT.split(",");
    expect(columns).not.toContain("claim_token");
    expect(columns).not.toContain("company_email");
    expect(columns).not.toContain("posted_by");
    expect(columns).not.toContain("claimed_by");
  });

  it("allowlists PATCH fields and strips immutable security columns", () => {
    const cleaned = sanitizeJobPatchBody({
      title: "Updated Role",
      claim_token: "forged-token",
      claimed_by: "attacker-uuid",
      id: "other-id",
      status: "published",
    });
    expect(cleaned).toEqual({
      title: "Updated Role",
      status: "published",
    });
  });

  it("validates job identifiers cleanly against filter injection", () => {
    expect(sanitizeSlugOrUuidFilter("senior-rust-engineer")).toEqual({
      valid: true,
      filter: "seo_slug=eq.senior-rust-engineer",
    });
    expect(sanitizeSlugOrUuidFilter("foo&select=claim_token")).toEqual({
      valid: false,
    });
    expect(sanitizeJobStatus("draft,or(id.not.is.null)")).toBe("published");
  });

  it("rejects bot API keys when server env is unset", () => {
    const prevBot = process.env.JOB_BOT_API_KEY;
    const prevClivora = process.env.CLIVORA_API_KEY;
    delete process.env.JOB_BOT_API_KEY;
    delete process.env.CLIVORA_API_KEY;
    try {
      const req = new Request("https://clivora.io/api/v1/jobs", {
        headers: { "x-api-key": "anything" },
      });
      expect(verifyJobBotApiKey(req)).toBe(false);
    } finally {
      if (prevBot !== undefined) process.env.JOB_BOT_API_KEY = prevBot;
      if (prevClivora !== undefined) process.env.CLIVORA_API_KEY = prevClivora;
    }
  });
});
