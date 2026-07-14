/** Connect Credits costs and stable RPC error codes. */
export const CONNECT_CREDIT_COSTS = {
  proposal: 1,
  contact: 1,
  publish_need: 3,
  publish_profile: 3,
} as const;

export type ConnectCreditAction = keyof typeof CONNECT_CREDIT_COSTS;

export type ConnectCreditSummary = {
  plan: string;
  allowance: number;
  balance: number;
  period_start: string;
  period_end: string;
  legacy_unlimited: boolean;
  grandfather_until: string | null;
};

export type ConnectCreditErrorCode =
  | "INSUFFICIENT_CREDITS"
  | "PROFILE_INCOMPLETE"
  | "ACTION_NOT_ALLOWED"
  | "DUPLICATE_ACTION"
  | "AUTH_REQUIRED"
  | "PRO_PLUS_REQUIRED";

export function parseConnectCreditError(error: unknown): {
  code: ConnectCreditErrorCode | "UNKNOWN";
  message: string;
} {
  const raw =
    typeof error === "string"
      ? error
      : error && typeof error === "object" && "message" in error
        ? String((error as { message?: string }).message ?? "")
        : String(error ?? "");
  const upper = raw.toUpperCase();
  for (const code of [
    "INSUFFICIENT_CREDITS",
    "PROFILE_INCOMPLETE",
    "ACTION_NOT_ALLOWED",
    "DUPLICATE_ACTION",
    "AUTH_REQUIRED",
    "PRO_PLUS_REQUIRED",
  ] as const) {
    if (upper.includes(code)) {
      return { code, message: humanizeConnectCreditError(code) };
    }
  }
  return { code: "UNKNOWN", message: raw || "Connect action failed" };
}

export function humanizeConnectCreditError(code: ConnectCreditErrorCode): string {
  switch (code) {
    case "INSUFFICIENT_CREDITS":
      return "Not enough Connect credits this month. Upgrade your plan or wait for the next reset.";
    case "PROFILE_INCOMPLETE":
      return "Finish your profile (confirmed email + readiness) before spending Connect credits.";
    case "ACTION_NOT_ALLOWED":
      return "This Connect action is not allowed for your account.";
    case "DUPLICATE_ACTION":
      return "That Connect action was already processed.";
    case "AUTH_REQUIRED":
      return "Sign in to use Connect.";
    case "PRO_PLUS_REQUIRED":
      return "Connect writes require Pro Plus. Upgrade to publish jobs, apply, or contact talent.";
  }
}

export function formatConnectCredits(summary: ConnectCreditSummary | null | undefined): string {
  if (!summary) return "Credits unavailable";
  if (summary.legacy_unlimited) {
    const until = summary.grandfather_until
      ? new Date(summary.grandfather_until).toLocaleDateString()
      : "soon";
    return `Unlimited until ${until}`;
  }
  return `${summary.balance} / ${summary.allowance} credits`;
}
