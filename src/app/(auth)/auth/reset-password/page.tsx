"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/lib/site";
import { useAuthAnim } from "@/components/auth/animated/AuthAnimContext";

export default function ResetPasswordPage() {
  const anim = useAuthAnim();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"request" | "update">("request");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function hydrateRecovery() {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (!cancelled && !exchangeErr) {
            setMode("update");
            setMessage("Choose a new password for your CLIVORA account.");
            return;
          }
          if (!cancelled && exchangeErr) {
            setError(exchangeErr.message);
          }
        }
        const hash = window.location.hash.toLowerCase();
        if (hash.includes("type=recovery") || hash.includes("access_token")) {
          setMode("update");
          setMessage("Choose a new password for your CLIVORA account.");
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("update");
        setMessage("Choose a new password for your CLIVORA account.");
      }
    });

    void hydrateRecovery();
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function onRequest(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const redirectTo = `${site.url}/auth/reset-password`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo },
    );
    setLoading(false);
    if (err) {
      setError(err.message);
      anim.triggerError();
      return;
    }
    setMessage(
      "If that email has a CLIVORA account, we sent a reset link from contact@clivora.io. Check inbox and spam.",
    );
  }

  async function onUpdate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      anim.triggerError();
      return;
    }
    setMessage("Password updated. You can sign in now.");
    window.setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
  }

  return (
    <>
      <header className="aa-panel-head">
        <h1>Reset password</h1>
        <p>We email a secure link so you can set a new password for your CLIVORA account.</p>
      </header>

      <div className="aa-role-grid" role="group" aria-label="Reset mode">
        <button
          type="button"
          onClick={() => setMode("request")}
          className={`aa-role-btn${mode === "request" ? " active-client" : ""}`}
        >
          Send link
        </button>
        <button
          type="button"
          onClick={() => setMode("update")}
          className={`aa-role-btn${mode === "update" ? " active-client" : ""}`}
        >
          Set new password
        </button>
      </div>

      {mode === "request" ? (
        <form onSubmit={onRequest} className="aa-form" style={{ marginTop: 18 }}>
          <label className="aa-field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => anim.setTyping(true)}
              onBlur={() => anim.setTyping(false)}
              placeholder="you@company.com"
            />
          </label>
          <button type="submit" disabled={loading} className="aa-btn-primary">
            {loading ? "Sending…" : "Send reset email"}
          </button>
        </form>
      ) : (
        <form onSubmit={onUpdate} className="aa-form" style={{ marginTop: 18 }}>
          <label className="aa-field">
            <span>New password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                anim.setPasswordLen(e.target.value.length);
              }}
              placeholder="••••••••"
            />
          </label>
          <button type="submit" disabled={loading} className="aa-btn-primary">
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}

      {error && (
        <div className="aa-error-box" style={{ marginTop: 16 }} role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="aa-error-box info" style={{ marginTop: 16 }} role="status">
          {message}
        </div>
      )}

      <p className="aa-signup">
        <Link href="/login" className="aa-link strong">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
