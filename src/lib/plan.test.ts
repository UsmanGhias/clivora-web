import { describe, expect, it } from "vitest";

import {
  FOUNDER_PROMO_ACTIVE,
  hasPaidPro,
  hasPaidProPlus,
  isClientAccount,
  isPro,
  isProPlus,
  paidPlanLabel,
  planLabel,
} from "./plan";
import type { Profile } from "./profile-types";

function profile(plan: string, accountType = "freelancer"): Profile {
  return {
    id: "user-1",
    email: "a@example.com",
    name: "Test",
    account_type: accountType,
    subscription_plan: plan,
  };
}

describe("paid plan rules", () => {
  it("treats Pro Plus as Pro for feature gates", () => {
    expect(hasPaidPro(profile("pro"))).toBe(true);
    expect(hasPaidPro(profile("pro_plus"))).toBe(true);
    expect(hasPaidPro(profile("free"))).toBe(false);
    expect(hasPaidPro(null)).toBe(false);
    expect(hasPaidProPlus(profile("plus"))).toBe(true);
    expect(hasPaidProPlus(profile("pro"))).toBe(false);
  });

  it("labels plans for the UI", () => {
    expect(paidPlanLabel(profile("pro_plus"))).toBe("Pro Plus");
    expect(paidPlanLabel(profile("pro"))).toBe("Pro");
    expect(paidPlanLabel(null)).toBe("Free");
  });
});

describe.runIf(FOUNDER_PROMO_ACTIVE)("founder promotion", () => {
  it("grants Pro and Pro Plus to free accounts", () => {
    expect(isPro(profile("free"))).toBe(true);
    expect(isProPlus(profile("free"))).toBe(true);
    expect(isProPlus(null)).toBe(true);
  });

  it("labels plans as founder tiers", () => {
    expect(planLabel(profile("pro_plus"))).toBe("Founder Pro Plus (1 Year Free)");
    expect(planLabel(null)).toBe("Founder Pro Plus (1 Year Free)");
    expect(planLabel(profile("free"))).toBe("Founder Pro (1 Year Free)");
  });
});

describe("plan helpers", () => {
  it("detects client accounts independently of plan", () => {
    expect(isClientAccount(profile("pro", "client"))).toBe(true);
    expect(isClientAccount(profile("free", "freelancer"))).toBe(false);
  });
});
