"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/Logo";

type Enrollment = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export function AdminMfaGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refreshAssurance = useCallback(async () => {
    setChecking(true);
    setError("");
    const [aalResult, factorsResult] = await Promise.all([
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      supabase.auth.mfa.listFactors(),
    ]);

    if (aalResult.error || factorsResult.error) {
      setError("Could not verify two-factor authentication. Please sign in again.");
      setChecking(false);
      return;
    }

    if (aalResult.data.currentLevel === "aal2") {
      setVerified(true);
      setChecking(false);
      return;
    }

    const verifiedTotp = factorsResult.data.totp.find(
      (factor) => factor.status === "verified",
    );
    setFactorId(verifiedTotp?.id ?? null);
    setChecking(false);
  }, [supabase]);

  useEffect(() => {
    void refreshAssurance();
  }, [refreshAssurance]);

  async function startEnrollment() {
    setBusy(true);
    setError("");
    try {
      const listed = await supabase.auth.mfa.listFactors();
      if (listed.error) throw listed.error;
      for (const factor of listed.data.totp.filter(
        (candidate) => (candidate.status as string) === "unverified",
      )) {
        const removed = await supabase.auth.mfa.unenroll({ factorId: factor.id });
        if (removed.error) throw removed.error;
      }

      const result = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "CLIVORA Admin",
      });
      if (result.error) throw result.error;
      setEnrollment({
        factorId: result.data.id,
        qrCode: result.data.totp.qr_code,
        secret: result.data.totp.secret,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start MFA setup.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    const activeFactorId = enrollment?.factorId ?? factorId;
    if (!activeFactorId || !/^\d{6}$/.test(code.trim())) {
      setError("Enter the current 6-digit code from your authenticator app.");
      return;
    }

    setBusy(true);
    setError("");
    const result = await supabase.auth.mfa.challengeAndVerify({
      factorId: activeFactorId,
      code: code.trim(),
    });
    setBusy(false);

    if (result.error) {
      setError(result.error.message || "The verification code was not accepted.");
      return;
    }

    setVerified(true);
    setEnrollment(null);
    setCode("");
    router.refresh();
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.assign("/login?next=/admin");
  }

  if (verified) return children;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="mb-4 inline-flex rounded-2xl bg-navy px-3 py-2">
          <Logo size="sm" variant="onDark" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Secure admin verification</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Admin access uses your CLIVORA account and requires a fresh authenticator-app code.
        </p>

        {checking ? (
          <p className="mt-6 text-sm text-slate-600">Checking session security…</p>
        ) : enrollment ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-700">
              Scan this QR code in your authenticator app, then enter the 6-digit code.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={enrollment.qrCode}
              alt="QR code for CLIVORA admin two-factor authentication"
              className="mx-auto h-52 w-52 rounded-lg border border-slate-200 bg-white p-2"
            />
            <details className="text-xs text-slate-600">
              <summary className="cursor-pointer font-medium">Cannot scan the QR code?</summary>
              <code className="mt-2 block break-all rounded bg-slate-100 p-2">
                {enrollment.secret}
              </code>
            </details>
          </div>
        ) : factorId ? (
          <p className="mt-6 text-sm text-slate-700">
            Open your authenticator app and enter the current CLIVORA Admin code.
          </p>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={startEnrollment}
            className="mt-6 w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {busy ? "Preparing…" : "Set up authenticator app"}
          </button>
        )}

        {(enrollment || factorId) && (
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-semibold text-slate-800">
              6-digit code
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                onKeyDown={(event) => event.key === "Enter" && void verifyCode()}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </label>
            <button
              type="button"
              disabled={busy || code.length !== 6}
              onClick={verifyCode}
              className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {busy ? "Verifying…" : "Verify and open admin"}
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={signOut}
          className="mt-5 w-full text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
