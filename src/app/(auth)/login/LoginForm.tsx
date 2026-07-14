"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  authErrorMessage,
  isEmailNotConfirmedError,
} from "@/lib/auth-errors";
import { ResendVerification } from "@/components/auth/ResendVerification";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsVerify, setNeedsVerify] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedsVerify(false);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (err) {
      setError(authErrorMessage(err.message));
      setNeedsVerify(isEmailNotConfirmedError(err.message));
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-8">
      <h1 className="font-display text-2xl font-extrabold text-navy">Sign in</h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Use the same email as your CLIVORA mobile app.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-navy">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-3 text-sm text-navy outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block text-sm font-semibold text-navy">
          Password
          <input
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-3 text-sm text-navy outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </label>
        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>
        )}
        {needsVerify && <ResendVerification email={email} />}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs font-medium text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        OR
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleAuthButton mode="signin" next={next} />
      <div className="mt-5 flex items-center justify-between text-sm">
        <Link href="/auth/reset-password" className="font-medium text-slate-500 hover:text-primary">
          Forgot password?
        </Link>
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="font-semibold text-primary hover:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
