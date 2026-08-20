import { describe, expect, it } from "vitest";

import { isClientAccount, isPro, isProPlus, planLabel } from "./plan";
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

describe("plan helpers", () => {
  it("treats Pro Plus as Pro for feature gates", () => {
    expect(isPro(profile("pro"))).toBe(true);
    expect(isPro(profile("pro_plus"))).toBe(true);
    expect(isPro(profile("free"))).toBe(false);
    expect(isProPlus(profile("plus"))).toBe(true);
  });

  it("labels plans for the UI", () => {
    expect(planLabel(profile("pro_plus"))).toBe("Pro Plus");
    expect(planLabel(profile("pro"))).toBe("Pro");
    expect(planLabel(null)).toBe("Free");
  });

  it("detects client accounts independently of plan", () => {
    expect(isClientAccount(profile("pro", "client"))).toBe(true);
    expect(isClientAccount(profile("free", "freelancer"))).toBe(false);
  });
});
