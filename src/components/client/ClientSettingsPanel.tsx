"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  CreditCard,
  KeyRound,
  Trash2,
  HelpCircle,
  Headphones,
  User,
  Shield,
  Wallet,
  Users,
  SlidersHorizontal,
  AppWindow,
} from "lucide-react";
import {
  ClientCard,
  ClientPageHeader,
  ClientOutlineButton,
  ClientPrimaryButton,
  ClientStatCard,
  ClientStatusPill,
  money,
} from "@/components/client/ui";
import { ManageBillingButton } from "@/components/app/ManageBillingButton";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/profile-types";

const NAV = [
  { key: "account", label: "Account", icon: User },
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "payment", label: "Payment methods", icon: CreditCard },
  { key: "billing", label: "Billing & plans", icon: Wallet },
  { key: "team", label: "Team", icon: Users },
  { key: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { key: "apps", label: "Connected apps", icon: AppWindow },
] as const;

type Props = {
  profile: Profile;
  plan: string;
  plus: boolean;
  stats: {
    jobsPosted: number;
    activeProjects: number;
    invoices: number;
    totalSpent: number;
  };
};

export function ClientSettingsPanel({ profile, plan, plus, stats }: Props) {
  const [tab, setTab] = useState<(typeof NAV)[number]["key"]>("account");

  return (
    <div className="space-y-6 pb-10">
      <ClientPageHeader title="Settings" subtitle="Manage your account, billing, and preferences." />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-0.5 rounded-2xl border border-border bg-surface p-2 shadow-sm">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
                  active
                    ? "border-l-4 border-client-accent bg-client-surface text-navy"
                    : "text-text-secondary hover:bg-client-surface/60",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-4">
          {(tab === "account" || tab === "profile") && (
            <>
              <ClientCard
                title="Account information"
                action={<ClientOutlineButton href="/app/account">Edit profile</ClientOutlineButton>}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-xl font-bold text-white">
                      {(profile.name || profile.email || "?").charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold text-navy">
                        {profile.name || "Client"}
                      </p>
                      <p className="text-sm text-text-secondary">{profile.email}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <ClientStatusPill tone="green">
                          <span className="inline-flex items-center gap-1">
                            <BadgeCheck className="h-3 w-3" /> Verified
                          </span>
                        </ClientStatusPill>
                        <span className="text-xs text-text-muted">Lahore, Pakistan</span>
                      </div>
                      <p className="mt-2 text-xs text-text-muted">Member since Aug 1, 2024</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-client-surface/50 p-4">
                    <p className="text-xs font-semibold uppercase text-text-muted">Plan</p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="font-bold text-navy">{plan}</p>
                      {plus && <ClientStatusPill tone="green">Active</ClientStatusPill>}
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">Renews on Aug 1, 2026</p>
                    <div className="mt-3">
                      <ManageBillingButton />
                    </div>
                  </div>
                </div>
              </ClientCard>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ClientStatCard
                  label="Jobs posted"
                  value={stats.jobsPosted}
                  sub="View all jobs →"
                  href="/app/connect/manage"
                  icon={User}
                  iconTone="bg-violet-100 text-violet-700"
                />
                <ClientStatCard
                  label="Active projects"
                  value={stats.activeProjects}
                  sub="View all projects →"
                  href="/app/projects"
                  icon={Users}
                  iconTone="bg-emerald-100 text-emerald-700"
                />
                <ClientStatCard
                  label="Invoices"
                  value={stats.invoices}
                  sub="View all invoices →"
                  href="/app/invoices"
                  icon={CreditCard}
                  iconTone="bg-sky-100 text-sky-800"
                />
                <ClientStatCard
                  label="Total spent"
                  value={money(stats.totalSpent, 0)}
                  sub="View payments →"
                  href="/app/payments"
                  icon={Wallet}
                  iconTone="bg-amber-100 text-amber-800"
                />
              </div>

              <ClientCard title="Quick actions">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Change password", icon: KeyRound, href: "#", danger: false },
                    { label: "Payment methods", icon: CreditCard, href: "/app/payments/payment-methods", danger: false },
                    { label: "Notification settings", icon: Bell, href: "#", danger: false },
                    { label: "Delete account", icon: Trash2, href: "#", danger: true },
                  ].map((a) => {
                    const Icon = a.icon;
                    return (
                      <Link
                        key={a.label}
                        href={a.href}
                        onClick={(e) => {
                          if (a.href === "#") {
                            e.preventDefault();
                            if (a.label === "Change password") setTab("security");
                            if (a.label === "Notification settings") setTab("notifications");
                          }
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border border-border p-4 transition hover:bg-client-surface",
                          a.danger && "hover:border-error/40",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            a.danger ? "bg-red-50 text-error" : "bg-client-surface text-client-accent",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            a.danger ? "text-error" : "text-navy",
                          )}
                        >
                          {a.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </ClientCard>
            </>
          )}

          {tab === "notifications" && (
            <ClientCard title="Notification settings">
              <ul className="space-y-3">
                {[
                  "New proposals",
                  "Invoice updates",
                  "Project milestones",
                  "Messages from freelancers",
                  "Marketing emails",
                ].map((label) => (
                  <li
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-navy">{label}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-client-accent" />
                  </li>
                ))}
              </ul>
            </ClientCard>
          )}

          {tab === "security" && (
            <ClientCard title="Security">
              <p className="text-sm text-text-secondary">
                Protect your account with a strong password and optional two-factor authentication.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ClientPrimaryButton>Change password</ClientPrimaryButton>
                <ClientOutlineButton>Enable 2FA</ClientOutlineButton>
              </div>
            </ClientCard>
          )}

          {(tab === "payment" || tab === "billing") && (
            <ClientCard title={tab === "payment" ? "Payment methods" : "Billing & plans"}>
              <p className="text-sm text-text-secondary">
                {tab === "payment"
                  ? "Add or update cards used for hiring and invoices."
                  : `You are on ${plan}. Manage renewal and invoices via Stripe.`}
              </p>
              <div className="mt-4">
                <ManageBillingButton />
              </div>
            </ClientCard>
          )}

          {(tab === "team" || tab === "preferences" || tab === "apps") && (
            <ClientCard title={NAV.find((n) => n.key === tab)?.label}>
              <p className="text-sm text-text-secondary">
                Configure {NAV.find((n) => n.key === tab)?.label.toLowerCase()} for your client
                workspace. More controls are rolling out with Pro Plus.
              </p>
              <Link href="/pro?plan=pro_plus" className="mt-4 inline-block text-sm font-semibold text-client-accent">
                Learn more about Pro Plus →
              </Link>
            </ClientCard>
          )}

          <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-navy">Need help with your account?</p>
                <p className="text-sm text-text-secondary">
                  Our support team is here to help you get the most out of CLIVORA.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <ClientPrimaryButton href="/app/support">Visit Help Center</ClientPrimaryButton>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-client-accent text-white">
                <Headphones className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
