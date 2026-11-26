import { describe, expect, it } from "vitest";
import {
  AUTHED_CONNECT_JOB_COLUMNS,
  PUBLIC_CONNECT_JOB_COLUMNS,
  SAFE_CONNECT_PROPOSAL_COLUMNS,
} from "./connect-columns";

function parseCols(selectExpr: string): string[] {
  return selectExpr
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

describe("connect-columns allowlists", () => {
  it("never exposes wildcard or private contact fields on public connect job queries", () => {
    const publicCols = parseCols(PUBLIC_CONNECT_JOB_COLUMNS);
    expect(publicCols).not.toContain("*");
    expect(publicCols).not.toContain("company_email");
    expect(publicCols).not.toContain("claim_token");
    expect(publicCols).not.toContain("applicant_emails");
    expect(publicCols).not.toContain("contact_phone");

    const authedCols = parseCols(AUTHED_CONNECT_JOB_COLUMNS);
    expect(authedCols).toContain("company_email");
    expect(authedCols).not.toContain("*");
    expect(authedCols).not.toContain("claim_token");
  });

  it("never exposes wildcard or secret tokens on connect proposals", () => {
    const proposalCols = parseCols(SAFE_CONNECT_PROPOSAL_COLUMNS);
    expect(proposalCols).not.toContain("*");
    expect(proposalCols).not.toContain("secret_token");
    expect(proposalCols).not.toContain("claim_token");
    expect(proposalCols).toContain("from_user_id");
    expect(proposalCols).toContain("to_user_id");
  });
});
