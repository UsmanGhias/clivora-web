# CLIVORA Admin (clivora-web)

**Live site:** [https://clivora.io](https://clivora.io)  
**Admin panel:** [https://clivora.io/admin](https://clivora.io/admin)

## Vercel setup

1. Repo: https://github.com/UsmanGhias/clivora-web (linked to Vercel)
2. Custom domain: `clivora.io`
3. Environment variables (Project → Settings → Environment Variables):
   - `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose in browser or mobile builds)

## Admin login (web)

- URL: https://clivora.io/admin
- Emails: `contact@clivora.io` or `contact@clivora.io`
- Sign in with Supabase Auth and complete authenticator-app MFA.

## Dashboard (v2.7.1)

Tabs: **Overview** | **Users** | **Payments** | **Audit** | **Events**

- Overview: signups, Pro, profiles, MRR estimate, Grant Pro / Pro Plus
- Users: full Supabase `profiles` list (email, name, account type, plan, join date)
- Payments: website checkout requests from `/pro`
- Audit: full audit trail with expandable raw payload
- Events: signup/Pro and other platform events with amount and source

## Mobile app connection

The Flutter app points to:

- `kClivoraWebBaseUrl` = `https://clivora.io`
- The legacy shared-key sync endpoint is retired. Mobile analytics must use the authenticated product-event RPC.

In-app: Hub → **CodCrafters Admin** → **Sync to Web** or **Open Web Admin Panel**

## What syncs after Play Store

| Data | Synced? |
|------|---------|
| Clients, projects, invoices (CRM) | No. Stays on user's phone |
| Sign-up events | Yes |
| Pro activation events | Yes |
| Audit trail events (`audit_*`) | Yes (v2.4+) |

### Audit event types

- `audit_invoice_status`: invoice status changes
- `audit_admin_granted`: admin access granted
- `audit_payment_confirmed`: client payment confirmed
- `audit_contract_signed`: contract signed
- `audit_notification_sent`: notification sent

## API

- Admin APIs require the Supabase cookie session and AAL2 MFA.

Events are stored in Supabase `clivora_events` when configured, with a local JSON fallback on Vercel.
