export const EARLY_ACCESS_PRO_END_ISO = "2026-07-22T23:59:59.000Z";
export const BUG_REPORT_EMAIL = "contact@clivora.io";

export function isEarlyAccessProWindow(now = new Date()) {
  return now.getTime() <= new Date(EARLY_ACCESS_PRO_END_ISO).getTime();
}

export function earlyAccessPlanForSignup(now = new Date()) {
  return isEarlyAccessProWindow(now) ? "pro" : "free";
}
