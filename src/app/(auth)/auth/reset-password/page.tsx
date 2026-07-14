"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/lib/site";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"request" | "update">("request");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onRequest(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${site.url}/auth/reset-password` }
    );
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage("Check your inbox for the reset link.");
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
      return;
    }
    setMessage("Password updated. You can sign in now.");
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h1 className="text-2xl font-extrabold text-text-primary">Reset password</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Used by the mobile app and web. Same Supabase Auth project.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-background p-1">
        <button
          type="button"
          onClick={() => setMode("request")}
          className={`rounded-lg py-2 text-sm font-semibold ${
            mode === "request" ? "bg-navy text-white" : "text-text-secondary"
          }`}
        >
          Send link
        </button>
        <button
          type="button"
          onClick={() => setMode("update")}
          className={`rounded-lg py-2 text-sm font-semibold ${
            mode === "update" ? "bg-navy text-white" : "text-text-secondary"
          }`}
        >
          Set new password
        </button>
      </div>
      {mode === "request" ? (
        <form onSubmit={onRequest} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-text-primary">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 outline-none ring-primary focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset email"}
          </button>
        </form>
      ) : (
        <form onSubmit={onUpdate} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-text-primary">
            New password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 outline-none ring-primary focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
      {error && <p className="mt-4 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
      {message && (
        <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary-dark">{message}</p>
      )}
      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
