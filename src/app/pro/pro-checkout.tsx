"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown, CreditCard, HardDrive, Shield, Smartphone, Sparkles } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import {
  OFFICIAL_EMAIL,
  PRO_PLUS_PRICE_USD,
  PRO_PRICE_USD,
} from "@/lib/pricing";
import { getCompanyPaymentAccount, type CompanyPaymentAccount } from "@/lib/company-payments";
import { site } from "@/lib/site";
import { SubPageChrome } from "@/components/app/SubPageChrome";
import { Logo } from "@/components/ui/Logo";
import { SmartAppCta } from "@/components/app/SmartAppCta";
import { cn } from "@/lib/utils";

type Plan = "pro" | "pro_plus";
type AccountType = "freelancer" | "client";
type PaymentMethod = "safepay" | "jazzcash" | "easypaisa" | "bank" | "manual";

const PAYMENT_METHODS: Array<{
  value: PaymentMethod;
  label: string;
  detail: string;
  disabled?: boolean;
}> = [
  { value: "jazzcash", label: "JazzCash", detail: "Pay to 03067917467 — recommended" },
  { value: "easypaisa", label: "Easypaisa", detail: "Pay to 03126912440" },
  { value: "bank", label: "Bank transfer", detail: "MCB or Bank Islami — details below" },
  { value: "manual", label: "Manual", detail: "Share details for team review" },
  {
    value: "safepay",
    label: "SafePay (sandbox)",
    detail: "Card checkout via SafePay sandbox",
  },
];

const FEATURES = [
  {
    label: "File vault",
    free: `${site.freeLimits.fileVaultMb} MB`,
    pro: `${site.proLimits.fileVaultGb} GB`,
    plus: `${site.proPlusLimits.fileVaultGb} GB`,
  },
  { label: "CRM (clients, projects, invoices)", free: "Limited", pro: "Unlimited", plus: "Unlimited" },
  { label: "Ask AI assistant", free: "-", pro: "Included", plus: "Included" },
  { label: "CLIVORA Connect marketplace", free: "Browse only", pro: "-", plus: "Post & contact" },
  { label: "Two-factor auth (MFA)", free: "-", pro: "-", plus: "Included" },
  { label: "Everything in Pro", free: "-", pro: "-", plus: "Yes" },
] as const;

export default function ProCheckout() {
  const params = useSearchParams();
  const initialPlan = (params.get("plan") === "pro" ? "pro" : "pro_plus") as Plan;
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [fullName, setFullName] = useState(params.get("name") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [accountType, setAccountType] = useState<AccountType>(
    params.get("type") === "client" ? "client" : "freelancer",
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [country, setCountry] = useState("PK");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("jazzcash");
  const [paymentReference, setPaymentReference] = useState("");
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState(params.get("promo") ?? params.get("ref") ?? "");
  const [promoNote, setPromoNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [safepayStatus, setSafepayStatus] = useState<"success" | "cancel" | null>(null);
  const [error, setError] = useState("");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const amount = plan === "pro_plus" ? PRO_PLUS_PRICE_USD : PRO_PRICE_USD;
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const isClient = accountType === "client";

  useEffect(() => {
    const sp = params.get("safepay");
    if (sp === "success" || sp === "cancel") setSafepayStatus(sp);
    if (sp !== "success") return;
    const tracker = params.get("tracker");
    const order = params.get("order");
    if (!tracker && !order) return;
    void (async () => {
      try {
        const res = await fetch("/api/safepay/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tracker, orderId: order }),
        });
        const json = (await res.json()) as { paid?: boolean };
        if (json.paid) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const { data } = await supabase
              .from("profiles")
              .select("subscription_plan")
              .eq("id", user.id)
              .maybeSingle();
            if (data?.subscription_plan) {
              setCurrentPlan(String(data.subscription_plan).toLowerCase());
            }
          }
        }
      } catch {
        /* webhook may still settle */
      }
    })();
  }, [params, supabase]);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setLoadingPlan(false);
          return;
        }
        setLoggedIn(true);
        const { data } = await supabase
          .from("profiles")
          .select("email, name, account_type, subscription_plan, is_blocked")
          .eq("id", user.id)
          .maybeSingle();
        if (data?.is_blocked) {
          window.location.href = "/blocked";
          return;
        }
        if (data?.email) setEmail(data.email);
        if (data?.name) setFullName(data.name);
        if (data?.account_type) {
          setAccountType(data.account_type === "client" ? "client" : "freelancer");
        }
        setCurrentPlan((data?.subscription_plan ?? "free").toLowerCase());
      } finally {
        setLoadingPlan(false);
      }
    })();
  }, [supabase]);

  const alreadyProPlus =
    currentPlan === "pro_plus" || currentPlan === "plus" || currentPlan === "proplus";
  const alreadyPro = currentPlan === "pro" || alreadyProPlus;
  const wantsSameOrLower = alreadyProPlus || (alreadyPro && plan === "pro");
  const selectedPaymentAccount = getCompanyPaymentAccount(paymentMethod);

  async function validatePromo(codeRaw: string): Promise<{
    code: string;
    discountType: string;
    discountValue: number;
    note: string;
    finalAmountUsd: number;
  } | null> {
    const code = codeRaw.trim().toUpperCase();
    if (!code) return null;
    const res = await fetch("/api/promo/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, plan, amountUsd: amount }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      promo?: {
        code: string;
        discountType: string;
        discountValue: number;
        note: string;
        finalAmountUsd: number;
      } | null;
      error?: string;
    };
    if (!res.ok) throw new Error(json.error || "Promo validation failed");
    return json.promo ?? null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (wantsSameOrLower) {
      setError("You already have this plan (or higher). No payment needed.");
      return;
    }
    setBusy(true);
    setError("");
    setPromoNote(null);
    try {
      let promoMeta: Awaited<ReturnType<typeof validatePromo>> = null;
      if (promoCode.trim()) {
        promoMeta = await validatePromo(promoCode);
        if (promoMeta) setPromoNote(promoMeta.note);
      }
      const amountDue = promoMeta?.finalAmountUsd ?? amount;

      if (paymentMethod === "safepay") {
        const res = await fetch("/api/safepay/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            accountType,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            promoCode: promoMeta?.code ?? (promoCode.trim() || undefined),
            amountUsd: amount,
          }),
        });
        const json = (await res.json()) as { checkoutUrl?: string; error?: string };
        if (!res.ok || !json.checkoutUrl) {
          throw new Error(json.error || "Could not start SafePay checkout");
        }
        window.location.href = json.checkoutUrl;
        return;
      }

      const noteParts = [notes.trim()];
      if (promoMeta) noteParts.push(`Promo: ${promoMeta.code} (${promoMeta.note})`);
      const res = await fetch("/api/pro/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          plan,
          accountType,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          country,
          paymentMethod,
          paymentReference: paymentReference.trim(),
          notes: noteParts.filter(Boolean).join("\n"),
          promoCode: promoMeta?.code ?? (promoCode.trim() || undefined),
          amountUsd: amountDue,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(json.error || "Could not submit payment request");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit payment request");
    } finally {
      setBusy(false);
    }
  }

  const showForm =
    !loadingPlan &&
    !alreadyProPlus &&
    !(alreadyPro && plan === "pro") &&
    !done;

  return (
    <SubPageChrome
      isClient={isClient}
      backHref="/app"
      backLabel="Back to app"
      crumbs={[
        { label: "App", href: "/app" },
        { label: "Upgrade" },
      ]}
      title="CLIVORA Pro"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {loadingPlan && <p className="text-sm text-text-secondary">Checking your plan…</p>}

        {!loadingPlan && alreadyProPlus && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <Logo size="sm" variant="onLight" />
            <h2 className="mt-4 text-2xl font-extrabold text-navy">You&apos;re on Pro Plus - enjoy</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Connect posting, MFA, and Plus perks are already unlocked. No extra payment required -
              get back to winning work.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/connect" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
                Open Connect
              </Link>
              <Link href="/app" className="rounded-xl border border-navy/20 px-4 py-2 text-sm font-semibold text-navy">
                Back to app
              </Link>
            </div>
          </div>
        )}

        {!loadingPlan && alreadyPro && plan === "pro" && !alreadyProPlus && (
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
            <Logo size="sm" variant="onLight" />
            <h2 className="mt-4 text-2xl font-extrabold text-navy">You&apos;re already on Pro</h2>
            <p className="mt-2 text-sm text-text-secondary">
              No need to pay for Pro again. Choose Pro Plus for Connect marketplace, MFA, and 50GB vault - it includes everything in Pro.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPlan("pro_plus")}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                See Pro Plus · ${PRO_PLUS_PRICE_USD}/mo
              </button>
              <Link href="/app" className="rounded-xl border border-navy/20 px-4 py-2 text-sm font-semibold text-navy">
                Back to app
              </Link>
            </div>
          </div>
        )}

        {safepayStatus === "success" && !done && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-lg font-extrabold text-navy">SafePay payment received</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Thanks — we&apos;re confirming your payment now. Refresh in a minute or open the app;
              Pro unlocks automatically after the webhook settles.
            </p>
            <Link href="/app" className="mt-3 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
              Back to app
            </Link>
          </div>
        )}

        {safepayStatus === "cancel" && !done && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-extrabold text-navy">Checkout cancelled</h2>
            <p className="mt-1 text-sm text-text-secondary">
              No charge was completed. Use JazzCash, Easypaisa, or bank transfer below.
            </p>
          </div>
        )}

        {done && (
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <Logo size="sm" variant="onLight" />
            <h2 className="mt-4 text-2xl font-extrabold text-navy">Request received</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Thanks {fullName || "there"}. We received your{" "}
              <strong>{plan === "pro_plus" ? "Pro Plus" : "Pro"}</strong> request for{" "}
              <strong>${amount}</strong>.
            </p>
            <Link href="/app" className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
              Back to app
            </Link>
          </div>
        )}

        {!loadingPlan && !alreadyProPlus && !done && (
          <section className="overflow-hidden rounded-3xl border border-navy/10 bg-surface shadow-sm">
            <button
              type="button"
              aria-expanded={comparisonOpen}
              aria-controls="pro-plan-comparison"
              onClick={() => setComparisonOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-teal-50 to-white px-5 py-4 text-left transition hover:from-primary/15 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span>
                <span className="flex flex-wrap items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="font-display text-lg font-bold text-navy">Compare plans</span>
                </span>
                <span className="mt-1 block text-sm text-text-secondary">
                  Pro Plus includes all Pro features, plus Connect posting and MFA.
                </span>
              </span>
              <ChevronDown
                className={cn("h-5 w-5 shrink-0 text-navy transition", comparisonOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            <div id="pro-plan-comparison" className={comparisonOpen ? "block" : "hidden"}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] text-left text-sm">
                  <caption className="sr-only">CLIVORA Free, Pro, and Pro Plus feature comparison</caption>
                  <thead>
                    <tr className="border-b border-border bg-background/80">
                      <th scope="col" className="px-4 py-3 font-semibold text-text-muted">
                        Feature
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-navy">
                        Free
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-primary">
                        Pro
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-teal-800">
                        Pro Plus
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEATURES.map((row) => (
                      <tr key={row.label} className="border-b border-border/70">
                        <th scope="row" className="px-4 py-2.5 font-medium text-navy">
                          {row.label}
                        </th>
                        <td className="px-4 py-2.5 text-text-secondary">{row.free}</td>
                        <td className="px-4 py-2.5 text-text-secondary">{row.pro}</td>
                        <td className="px-4 py-2.5 font-semibold text-teal-900">{row.plus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-2 border-t border-border bg-primary/5 px-4 py-3 text-xs text-text-secondary sm:grid-cols-3">
                <span className="inline-flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Vault scales with plan
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> MFA on Pro Plus only
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Pro Plus = Pro + Connect
                </span>
              </div>
            </div>
          </section>
        )}

        {showForm && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <form
              onSubmit={onSubmit}
              className="space-y-5 rounded-3xl border border-navy/10 bg-surface p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Logo size="sm" variant="onLight" />
                  <h2 className="mt-4 font-display text-2xl font-extrabold text-navy">
                    Choose your CLIVORA upgrade
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                    Submit your payment details for manual approval. Android users can also subscribe
                    through Google Play Billing inside the app.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-900">
                  <Smartphone className="h-3.5 w-3.5" aria-hidden="true" /> Google Play ready
                </span>
              </div>
              {alreadyPro && (
                <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary-dark">
                  You already have <strong>Pro</strong>. Pro Plus upgrades Connect + MFA and includes
                  every Pro feature.
                </p>
              )}

              <fieldset>
                <legend className="text-sm font-semibold text-navy">Plan</legend>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <PlanOption
                    active={plan === "pro"}
                    title="Pro"
                    price={`$${PRO_PRICE_USD}/mo`}
                    blurb={`${site.proLimits.fileVaultGb}GB vault · CRM unlimited`}
                    disabled={alreadyPro}
                    onClick={() => !alreadyPro && setPlan("pro")}
                  />
                  <PlanOption
                    active={plan === "pro_plus"}
                    title="Pro Plus"
                    price={`$${PRO_PLUS_PRICE_USD}/mo`}
                    blurb={`All Pro + Connect + MFA · ${site.proPlusLimits.fileVaultGb}GB`}
                    badge="Best value"
                    onClick={() => setPlan("pro_plus")}
                  />
                </div>
              </fieldset>

              <label htmlFor="promo-code" className="block text-sm font-semibold text-navy">
                Promo / referral code (optional)
                <input
                  id="promo-code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-mono uppercase focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="CLIVORA15 or CLV..."
                />
              </label>
              {promoNote && (
                <p className="text-xs font-semibold text-primary-dark">{promoNote}</p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label htmlFor="full-name" className="block text-sm font-semibold text-navy">
                  Full name
                  <input
                    id="full-name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label htmlFor="email" className="block text-sm font-semibold text-navy">
                  Email
                  <input
                    id="email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={loggedIn}
                    className={cn(
                      "mt-1 w-full rounded-xl border border-border px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                      loggedIn && "bg-background text-text-secondary",
                    )}
                  />
                </label>
              </div>
              <fieldset>
                <legend className="text-sm font-semibold text-navy">Account type</legend>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-background p-1">
                  {(["freelancer", "client"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={accountType === type}
                      onClick={() => setAccountType(type)}
                      className={cn(
                        "rounded-xl px-3 py-2.5 text-sm font-bold capitalize transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        accountType === type
                          ? "bg-navy text-white shadow-sm"
                          : "text-text-secondary hover:bg-white hover:text-navy",
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {loggedIn && (
                  <p className="mt-2 text-xs text-text-muted">
                    Preselected from your profile; change it here if this request is for another workspace type.
                  </p>
                )}
              </fieldset>
              <label htmlFor="country" className="block text-sm font-semibold text-navy">
                Country
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="PK">Pakistan</option>
                  <option value="US">United States</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>
              <fieldset>
                <legend className="text-sm font-semibold text-navy">Payment method</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      aria-pressed={paymentMethod === method.value}
                      disabled={method.disabled}
                      onClick={() => {
                        if (!method.disabled) setPaymentMethod(method.value);
                      }}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        paymentMethod === method.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-white hover:border-primary/40",
                        method.disabled && "cursor-not-allowed opacity-55 hover:border-border",
                      )}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-bold text-navy">{method.label}</span>
                        {paymentMethod === method.value && (
                          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                        )}
                      </span>
                      <span className="mt-1 block text-xs text-text-secondary">{method.detail}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              {selectedPaymentAccount && <PayToDetails account={selectedPaymentAccount} />}
              {paymentMethod !== "safepay" && (
                <label htmlFor="payment-reference" className="block text-sm font-semibold text-navy">
                  Payment reference
                  <input
                    id="payment-reference"
                    required
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Txn ID, receipt number, or manual reference"
                  />
                </label>
              )}
              {paymentMethod === "safepay" ? (
                <div className="rounded-2xl border border-teal-100 bg-teal-50 px-3 py-3 text-xs text-text-secondary">
                  You&apos;ll be redirected to <strong className="text-navy">SafePay</strong> to pay{" "}
                  <strong className="text-navy">${amount} USD</strong> securely. Plan unlocks after
                  payment confirmation.
                </div>
              ) : (
                <label htmlFor="payment-notes" className="block text-sm font-semibold text-navy">
                  Notes
                  <textarea
                    id="payment-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    rows={3}
                    placeholder="Add sender account, payment time, or approval notes."
                  />
                </label>
              )}
              {paymentMethod !== "safepay" && (
                <div className="rounded-2xl border border-teal-100 bg-teal-50 px-3 py-3 text-xs text-text-secondary">
                  Amount due: <strong className="text-navy">${amount} USD</strong>
                  {plan === "pro_plus" && " · Pro Plus includes all Pro features"}. Email {OFFICIAL_EMAIL}{" "}
                  if approval is delayed.
                </div>
              )}
              {error && <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
              <button
                type="submit"
                disabled={busy || wantsSameOrLower}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60"
              >
                {busy
                  ? paymentMethod === "safepay"
                    ? "Opening SafePay..."
                    : "Submitting..."
                  : paymentMethod === "safepay"
                    ? `Pay $${amount} with SafePay`
                    : `Submit ${plan === "pro_plus" ? "Pro Plus" : "Pro"} request`}
              </button>
            </form>
            <OrderSummary
              accountType={accountType}
              amount={amount}
              paymentMethod={paymentMethod}
              plan={plan}
              promoCode={promoCode}
              paymentAccount={selectedPaymentAccount}
            />
          </div>
        )}

        {!alreadyProPlus && (
          <SmartAppCta
            tone={isClient ? "client" : "freelancer"}
            title="Already on Android?"
            body="Subscribe with Google Play Billing inside the CLIVORA app, same unlock as web grants."
            deepPath="open/upgrade"
          />
        )}
      </div>
    </SubPageChrome>
  );
}

function PayToDetails({ account }: { account: CompanyPaymentAccount }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
      <p className="font-extrabold text-navy">Pay to {account.label}</p>
      <div className="mt-3 space-y-3">
        {account.groups.map((group) => (
          <div key={group.label} className="rounded-xl border border-white/70 bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{group.label}</p>
            <dl className="mt-2 space-y-1.5">
              {group.fields.map((field) => (
                <div key={`${group.label}-${field.label}`} className="grid gap-1 sm:grid-cols-[140px,1fr]">
                  <dt className="text-xs font-semibold text-text-secondary">{field.label}</dt>
                  <dd className="font-mono text-sm font-bold text-navy">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-text-secondary">
        Send the transfer, then enter your transaction ID or receipt number below.
      </p>
    </div>
  );
}

function PlanOption({
  active,
  title,
  price,
  blurb,
  badge,
  disabled,
  onClick,
}: {
  active: boolean;
  title: string;
  price: string;
  blurb?: string;
  badge?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "rounded-2xl border-2 p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-white",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <strong className="text-navy">{title}</strong>
        {badge && (
          <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-900">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-1 font-extrabold text-primary">{price}</p>
      {blurb && <p className="mt-1 text-[11px] leading-snug text-text-secondary">{blurb}</p>}
    </button>
  );
}

function OrderSummary({
  accountType,
  amount,
  paymentMethod,
  plan,
  promoCode,
  paymentAccount,
}: {
  accountType: AccountType;
  amount: number;
  paymentMethod: PaymentMethod;
  plan: Plan;
  promoCode: string;
  paymentAccount: CompanyPaymentAccount | null;
}) {
  const method = PAYMENT_METHODS.find((item) => item.value === paymentMethod);
  const planName = plan === "pro_plus" ? "Pro Plus" : "Pro";

  return (
    <aside className="lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-3xl border border-navy/10 bg-navy text-white shadow-xl">
        <div className="bg-gradient-to-br from-primary/30 via-transparent to-teal-900/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-wide text-teal-100">Order summary</p>
            <CreditCard className="h-5 w-5 text-teal-100" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-display text-3xl font-extrabold">{planName}</h3>
          <p className="mt-1 text-sm text-white/70">
            For {accountType === "client" ? "client" : "freelancer"} accounts
          </p>
          <div className="mt-5 flex items-end gap-1">
            <span className="text-5xl font-extrabold">${amount}</span>
            <span className="pb-2 text-sm font-semibold text-white/60">USD / month</span>
          </div>
        </div>
        <div className="space-y-4 bg-white p-5 text-navy">
          <SummaryRow label="Payment" value={method?.label ?? "Manual"} />
          <SummaryRow label="Promo" value={promoCode.trim() ? promoCode.trim().toUpperCase() : "Optional"} />
          {paymentAccount && (
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm">
              <p className="font-bold text-navy">Pay-to details</p>
              <div className="mt-3 space-y-3">
                {paymentAccount.groups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{group.label}</p>
                    <dl className="mt-1 space-y-1">
                      {group.fields.map((field) => (
                        <div key={`${group.label}-${field.label}`} className="text-xs">
                          <dt className="font-semibold text-text-secondary">{field.label}</dt>
                          <dd className="font-mono font-bold text-navy">{field.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-2xl bg-teal-50 p-4 text-sm text-text-secondary">
            <p className="font-bold text-navy">What happens next</p>
            <ul className="mt-3 space-y-2">
              {paymentMethod === "safepay" ? (
                <>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    Pay securely on SafePay hosted checkout.
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    Webhook confirms payment and unlocks your plan automatically.
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    Android users should subscribe in-app with Google Play Billing.
                  </li>
                </>
              ) : (
                <>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    Submit this request to the CLIVORA team.
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    We verify the payment reference and apply your plan.
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    Android users may subscribe in-app with Google Play instead.
                  </li>
                </>
              )}
            </ul>
          </div>
          <p className="text-xs leading-relaxed text-text-muted">
            {paymentMethod === "safepay"
              ? `Questions about card checkout? Email ${OFFICIAL_EMAIL}.`
              : `Keep your transfer proof available in case support asks for it at ${OFFICIAL_EMAIL}.`}
          </p>
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-bold text-navy">{value}</span>
    </div>
  );
}
