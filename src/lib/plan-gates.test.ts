import { describe, expect, it, vi } from "vitest";

// Exercise the Free caps as they apply once the founder promotion ends.
vi.mock("@/lib/plan", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/plan")>();
  return { ...actual, isPro: actual.hasPaidPro };
});

import {
  FREE_MAX_CLIENTS,
  FREE_MAX_INVOICES_PER_MONTH,
  FREE_MAX_PROJECTS,
  canCreateCustomer,
  canCreateInvoice,
  canCreateProject,
  invoicesCreatedThisMonth,
} from "./plan-gates";
import type { Profile } from "./profile-types";

function profile(plan: string): Profile {
  return {
    id: "user-1",
    email: "a@example.com",
    name: "Test",
    account_type: "freelancer",
    subscription_plan: plan,
  };
}

describe("Free plan create gates", () => {
  it("blocks a fourth client on Free and allows it on Pro", () => {
    const blocked = canCreateCustomer(profile("free"), FREE_MAX_CLIENTS);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.upgradeHref).toBe("/pro");

    expect(canCreateCustomer(profile("pro"), 99).ok).toBe(true);
  });

  it("enforces project and monthly invoice caps", () => {
    expect(canCreateProject(profile("free"), FREE_MAX_PROJECTS).ok).toBe(false);
    expect(canCreateInvoice(profile("free"), FREE_MAX_INVOICES_PER_MONTH).ok).toBe(
      false,
    );
    expect(canCreateProject(profile("pro_plus"), FREE_MAX_PROJECTS).ok).toBe(true);
  });

  it("counts invoices in the current UTC month only", () => {
    const now = new Date();
    const thisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 12)).toISOString();
    const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 12)).toISOString();
    expect(
      invoicesCreatedThisMonth([{ created_at: thisMonth }, { created_at: lastMonth }, {}]),
    ).toBe(1);
  });
});
