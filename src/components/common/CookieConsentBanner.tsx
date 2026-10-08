"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "clivora_cookie_consent";

export function CookieConsentBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      const cookieExists = document.cookie
        .split("; ")
        .some((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`));

      if (saved || cookieExists) {
        setDismissed(true);
        if (saved === "essential" && typeof window !== "undefined" && typeof (window as any).gtag === "function") {
          (window as any).gtag("consent", "update", {
            analytics_storage: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
          });
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveConsent = (choice: "all" | "essential") => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      document.cookie = `${COOKIE_CONSENT_KEY}=${choice}; path=/; max-age=${maxAge}; SameSite=Lax`;

      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
        (window as any).gtag("consent", "update", {
          analytics_storage: choice === "all" ? "granted" : "denied",
          ad_storage: choice === "all" ? "granted" : "denied",
          ad_user_data: choice === "all" ? "granted" : "denied",
          ad_personalization: choice === "all" ? "granted" : "denied",
        });
      }
    } catch {
      // Ignore storage write errors
    }
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  return (
    <div
      id="clivora-cookie-consent"
      role="region"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl"
    >
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-2xl shadow-slate-900/15 backdrop-blur-md sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Cookie &amp; Privacy Preferences
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  <ShieldCheck className="h-3 w-3 text-teal-600" /> GDPR / ePrivacy Compliant
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                We use essential cookies to maintain secure sessions and performance, alongside analytics
                and advertising cookies to measure traffic and support platform operations. Learn more in our{" "}
                <Link
                  href="/cookies"
                  className="font-medium text-teal-700 underline hover:text-teal-800"
                >
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-teal-700 underline hover:text-teal-800"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap">
            <button
              type="button"
              onClick={() => saveConsent("essential")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 sm:w-auto"
            >
              Reject Non-Essential
            </button>
            <button
              type="button"
              onClick={() => saveConsent("all")}
              className="w-full rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 sm:w-auto"
            >
              Accept All Cookies
            </button>
            <button
              type="button"
              onClick={() => saveConsent("essential")}
              aria-label="Dismiss cookie notice"
              className="hidden p-1 text-slate-400 hover:text-slate-600 sm:inline-flex"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
