"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/lib/site";
import { authErrorMessage, isRateLimitError } from "@/lib/auth-errors";
import { ResendVerification } from "@/components/auth/ResendVerification";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function SignupForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/app";
  const roleParam = search.get("role");
  const initialRole =
    roleParam === "client" || roleParam === "freelancer" ? roleParam : "freelancer";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"freelancer" | "client">(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [awaitingVerify, setAwaitingVerify] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    setAwaitingVerify(false);
    const supabase = createClient();
    const trimmedEmail = email.trim().toLowerCase();
    const { data, error: err } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          name: name.trim(),
          account_type: accountType,
        },
        emailRedirectTo: `${site.url}/auth/callback`,
      },
    });
    if (err) {
      setLoading(false);
      setError(authErrorMessage(err.message));
      if (isRateLimitError(err.message)) {
        setAwaitingVerify(true);
      }
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: trimmedEmail,
        name: name.trim(),
        account_type: accountType,
        subscription_plan: "free",
        updated_at: new Date().toISOString(),
      });
    }

    setLoading(false);
    if (!data.session) {
      setAwaitingVerify(true);
      setInfo(
        "Account created. Check your inbox (and spam) to verify your email, then sign in. You can browse Connect meanwhile; creating work needs verification.",
      );
      return;
    }
    router.push(next.startsWith("/") ? next : "/app");
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-8">
      <h1 className="font-display text-2xl font-extrabold text-navy">Create account</h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Free to start. Same account works on web and Android.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-1">
          {(["freelancer", "client"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAccountType(t)}
              className={`rounded-lg py-2.5 text-sm font-bold capitalize transition ${
                accountType === t
                  ? t === "freelancer"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-navy text-white shadow-sm"
                  : "text-slate-500 hover:text-navy"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="block text-sm font-semibold text-navy">
          Full name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-3 text-sm text-navy outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block text-sm font-semibold text-navy">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-3 text-sm text-navy outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block text-sm font-semibold text-navy">
          Password
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-3 text-sm text-navy outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </label>
        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>
        )}
        {info && (
          <p className="rounded-xl bg-teal-50 px-3 py-2.5 text-sm text-primary-dark">{info}</p>
        )}
        {awaitingVerify && <ResendVerification email={email} />}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create free account"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs font-medium text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        OR
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleAuthButton mode="signup" accountType={accountType} next={next} />
      {awaitingVerify && (
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="rounded-xl bg-navy px-4 py-2.5 font-semibold text-white"
          >
            Go to sign in
          </Link>
          <Link
            href="/connect"
            className="rounded-xl border border-navy/20 px-4 py-2.5 font-semibold text-navy"
          >
            Browse Connect
          </Link>
        </div>
      )}
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
