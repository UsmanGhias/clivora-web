# CLIVORA Production Current State & Architecture (2026)

**Last Verified**: September 2026  
**Lead Systems Architect**: Usman Ghias ([https://usmanghias.co.uk](https://usmanghias.co.uk))  
**Studio**: CODCrafters ([https://codcrafters.org](https://codcrafters.org))  
**Production Domain**: [https://clivora.io](https://clivora.io)  

---

## 1. Executive Overview & Core Differentiator

CLIVORA is a unified **Marketplace Discovery + post-hire Business Operating System (Freelancer OS)** with **$0 platform deal fees**.

Unlike traditional gig marketplaces (e.g. Upwork, Fiverr) that levy 10% to 20% commission taxes on every contract and silo communication inside monitored walled gardens, Clivora decouples talent discovery from post-hire execution:
1. **Connect Marketplace**: Transparent talent discovery with private contact protocols (contact info unlocked only upon mutual accept).
2. **Post-Hire Business OS**: Integrated CRM, client tracking, deliverables, timesheets, and direct PDF/online invoicing.
3. **Financial Autonomy**: $0 platform cut on client billings. Clients pay freelancers directly against invoices via standard rails (Stripe, Safepay, ACH, wire).

---

## 2. Platform Architecture & Tech Stack

### Web Client (`clivora-web`)
- **Framework**: Next.js 15 (App Router, Server Components, TypeScript).
- **Styling**: TailwindCSS 3.4 with custom typography and design system tokens.
- **State & Data Fetching**: Supabase SSR client (`@supabase/ssr`), React Server Components with fine-grained route caching.
- **Hosting & Runtime**: Node.js runtime on Hostinger VPS, automated Git deployments via `push-to-clivora-web.sh`.
- **Monetization**: Google AdSense (`pub-6149132910438736`), verified via `/ads.txt`.

### Mobile Client (`Clivora` Flutter)
- **Framework**: Flutter 3.x (Dart).
- **Package Identifier**: `org.codcrafters.clivora` (App Version 5.3.10).
- **Capabilities**: Offline-first client cache, native push notifications, deep links (`clivora://*`), biometric authentication.
- **Distribution**: Google Play Store.

### Database & Security Layer
- **Database**: PostgreSQL hosted on Supabase Cloud.
- **Security**: PostgreSQL Row-Level Security (RLS) policies enforcing multi-tenant isolation across all tables.
- **Storage**: AES-256 encrypted file vault with time-limited signed download URLs.
- **Authentication**: Supabase Auth (OAuth 2.0 PKCE with Google, email/password with salted hashes, TOTP MFA).

### AI & Automation Layer
- **Engine**: **Google Gemini API** via official `@google/genai` SDK (`src/lib/gemini.ts`).
- **Use Cases**: Smart Statement of Work (SOW) drafting, proposal generation, executive job summarization, Ask AI workspace assistant.
- **Strict Policy**: Zero OpenAI API dependencies. Strictly Gemini API.

---

## 3. Financial & Payment Architecture

| Capability | Clivora Implementation | Regulatory & Operational Reality |
| :--- | :--- | :--- |
| **Platform Take Rate** | $0 Deal Fee (100% of invoice retained by freelancer) | Sustained via optional SaaS subscriptions ($9–$19/mo) and team seats, not transaction taxes. |
| **Payment Settlement** | Direct client-to-freelancer settlement | Clivora is not a bank, licensed escrow agent, or money transmitter. Payments flow through merchant processors or bank rails. |
| **Milestone Tracking** | Milestone delivery records & digital approvals | Formal milestone scopes, timestamps, and deliverable sign-offs logged in PostgreSQL. |
| **Invoicing** | Built-in PDF/online invoice generation | Multi-currency invoices with status tracking (draft, sent, paid, overdue). |

---

## 4. Entitlements & Subscription Tiers

All platform quotas are enforced at the PostgreSQL database layer (`src/lib/plan-gates.ts`):

| Capability | Free ($0/forever) | Pro ($9/mo) | Pro Plus ($19/mo) |
| :--- | :--- | :--- | :--- |
| **Active CRM Clients** | 3 clients | Unlimited | Unlimited |
| **Active Projects** | 5 projects | Unlimited | Unlimited |
| **Invoices / Month** | 10 invoices/mo | Unlimited | Unlimited |
| **File Vault Lake** | 100 MB | 5 GB | 50 GB |
| **Platform Fee on Deals**| $0 Fee | $0 Fee | $0 Fee |
| **Connect Marketplace** | Browse listings | Apply & submit proposals | Priority directory + unlimited proposals |
| **Ask AI Assistant** | — | Included (Gemini) | Priority (Gemini) |
| **Contracts & Approvals**| Standard | Custom E-Signatures | Multi-party sign-offs |
| **Two-Factor Auth (MFA)**| — | — | Included (TOTP) |
| **1-Year Founder Launch**| Free forever | **Free for 1 Year** | **Free for 1 Year** |

*Note: Under the active 1-Year Founder Launch promotion (`FOUNDER_PROMO_ACTIVE = true`), all registered accounts automatically receive Pro Plus capabilities at $0 cost.*

---

## 5. Job Marketplace & Provenance Model

Jobs in the `connect_jobs` table fall into two clearly distinguished classes:

### Class A: CLIVORA Client Projects
- **Origin**: Posted by verified clients registered on Clivora Connect.
- **Badge**: `CLIVORA Client Project · $0 Fee`
- **Application Flow**: Proposal submitted directly inside Clivora, initiating a private Connect thread.
- **CTAs**: `Submit Proposal ($0 Fee)` and direct in-app messaging.

### Class B: Curated Remote Opportunities
- **Origin**: Hand-curated from official tech employer job boards (e.g. Hacker News, Remotive, Arbeitnow, company ATS).
- **Badge**: `Curated Remote Opportunity · {sourceDomain}`
- **Application Flow**: Explicit attribution of origin with direct links to the employer's official career portal.
- **CTAs**: `Apply on Official Company Portal` + secondary `Submit via Clivora Connect ($0 Fee)`.

---

## 6. Public Directory & SEO Footprint (130+ Routes)

The public surface of `clivora.io` is organized into high-utility clusters:
1. **Interactive Tools Suite (`/tools/*`)**:
   - `/tools`: Directory hub with AdSense placements.
   - `/tools/freelance-rate-calculator`: Interactive rate calculator factoring billable utilization, overhead, and tax obligations.
   - `/tools/upwork-fee-calculator`: Interactive fee comparison slider comparing legacy take rates vs Clivora $0 fee.
   - `/tools/invoice-generator`: Zero-signup browser PDF invoice generator with 1-click workspace import.
2. **Competitor Comparison Hub (`/compare/*`)**:
   - `/compare`: Overview comparison matrix.
   - `/compare/upwork`: Deep dive into take rates, bidding tokens, and client ownership.
   - `/compare/fiverr`: High-ticket retainers and milestone contracts vs 20% seller tax.
   - `/compare/contra`: Full Business OS + CRM + Android app vs portfolio network.
   - `/compare/bonsai`: Free core OS vs paywalled CRM.
3. **Trust & Architecture Center**:
   - `/trust`: Trust, safety, and direct settlement principles.
   - `/security`: PostgreSQL RLS, AES-256 file vault, and GDPR data sovereignty.
   - `/integrations`: Odoo ERP, Google Play billing, Stripe, Safepay, and GitHub sync.
4. **Programmatic Job Directory (`/jobs/*`)**:
   - 9 top-level categories and 116+ skill-specific programmatic landing pages.

---

## 7. Mandatory Developer Directives

1. **Zero Odoo Module Installations**:
   - Never call `button_immediate_install` or modify `ir.module.module` on any Odoo instance (`clivoraos.odoo.com`, etc.).
   - Strictly interact with existing native tables (`res.partner`).
2. **Founder Identity & Portfolio**:
   - Always reference **Usman Ghias** (Founder & Lead Systems Architect).
   - Official personal portfolio domain is strictly **https://usmanghias.co.uk**.
3. **AI Integration**:
   - Strictly **Google Gemini API** (`@google/genai`). Never add OpenAI SDK or API calls.
4. **Writing & Voice**:
   - Follow Humanizer standards: direct factual technical prose, zero em-dashes, no unearned marketing adjectives.
