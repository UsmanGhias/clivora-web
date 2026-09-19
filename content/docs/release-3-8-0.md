# CLIVORA 3.8.0 — Release Notes & Roadmap

**Build:** Android `3.8.0+80` · Web mirrored to clivora-web → https://clivora.codcrafters.org  
**Date:** 2026-07-14

## What we shipped in this build

### Website (production UX)
1. **Logged-in marketing nav** — When signed in, header shows Dashboard / Open portal / Sign out instead of Login + Get Started Free.
2. **Sticky portal sidebars** — Freelancer and Client `AppShell` sidebars are fixed like Admin (`sticky top-0 h-screen`); only the nav list scrolls.
3. **Freelancer dashboard** — Layout closer to the target mockup: KPI row, earnings + activity + week overview, projects/clients/proposals, AI banner, Connect opportunities, and **Post a need** quick action.
4. **Post a need vs Post a job** — Freelancers post a **need**; clients post a **job**. Sidebar CTA, command palette, Connect board, and Manage page all use role-correct labels.
5. **Connect Manage inside portal** — `/app/connect/manage` uses the same AppShell chrome (legacy `/connect/manage` redirects).
6. **Full proposal / contact page** — `/app/connect/apply` with cover letter, approach, milestones, amount, timeline, portfolio links, and a **URL safety notice** (links may be analyzed; abusive profiles can be removed).
7. **Hire flow** — Client posts job → freelancers browse Connect → Contact or Submit proposal → proposals inbox. Pro Plus gating preserved.
8. **Messages** — Unified inbox/thread layout with denser conversation list and full-height workspace.

### Android (3.8.0)
1. Freelancer command-center order (agenda / queue first).
2. Connect trust strip + pending Inbox count.
3. Client unread message badge.
4. Role-aware **Post need** / **Post job** labels on Connect screens.

### Plan gates (aligned Free / Pro / Pro Plus)
| Area | Free | Pro | Pro Plus |
|------|------|-----|----------|
| CRM clients / projects / invoices | Caps (3 / 5 / 10/mo) | Unlimited | Unlimited |
| Connect marketplace | Locked | Locked | Open + credits |
| Publish job/need / proposals / contact | — | — | Credits (1–3) |
| AI Hub / advanced analytics | Limited | Unlocked | Unlocked |

Web uses the same product rules via `plan.ts`, `plan-gates.ts`, and Connect Pro Plus checks.

## Download artifacts
- APK: see GitHub release / `/opt/cursor/artifacts/clivora-3.8.0.apk`
- AAB: `/opt/cursor/artifacts/clivora-3.8.0.aab`
- Live web: https://clivora.codcrafters.org

## Recommended next improvements (research-aligned)
1. Stripe web billing portal (keep `/pro` until live).
2. Meilisearch Connect discovery + saved search alerts.
3. Formal proposal → contract → milestone workroom end-to-end on mobile UI.
4. Admin write actions: impersonation, bulk moderation, feature flags UI.
5. Real chart history from DB (replace demo-scaled sparklines).
6. Time-entry cloud sync to `crm_time_entries`.
7. Branded client portal approvals + sticky payment CTA.

## Governance
Keep escrow release rules, ranking weights, fraud heuristics, RLS details, and internal prompts private. Public docs should describe user-visible flows only.
