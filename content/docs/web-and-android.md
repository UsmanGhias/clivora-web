# Web and Android, what works where

CLIVORA is **one account** on **two platforms**. This page helps you choose the right tool for each job.

---

## Use the web for

- Marketing site and documentation  
- Quick sign-in and cloud CRM edits (clients, projects, invoices)  
- **Connect marketplace**, browse, inbox, manage profile/jobs  
- Pro / Pro Plus checkout (manual payment)  
- Client portal when on desktop  
- Admin panel (authorized emails only)  

**URL:** [clivora.codcrafters.org](https://clivora.codcrafters.org)

---

## Use the Android app for

- **Offline CRM**, work without internet, sync later  
- Rich **PDF invoices** and branding  
- **Time tracking** and milestones  
- **File vault** and attachments  
- **AI assistant** and automations  
- **Biometric** app lock (Pro)  
- **Google Play** subscription billing  
- Push notifications  
- Full reports export  

**Install:** [Google Play](https://play.google.com/store/apps/details?id=org.codcrafters.clivora)

---

## Feature matrix

| Feature | Web | Android |
|---------|:---:|:-------:|
| Auth (email, Google) | ✓ | ✓ |
| Cloud CRM CRUD | ✓ | ✓ |
| Offline CRM |, | ✓ |
| Connect browse | ✓ | ✓ |
| Connect contact/post | Pro Plus | Pro Plus |
| Messages | ✓ | ✓ |
| Public invoice link | ✓ | ✓ |
| Recurring invoices |, | ✓ |
| Quotes → invoice |, | ✓ |
| Contracts PDF |, | ✓ |
| Expenses (cloud) | partial | ✓ |
| Team invites |, | ✓ |
| Referrals |, | ✓ |
| Play billing |, | ✓ |
| Web manual billing | ✓ |, |

---

## Sync model

- **Supabase** is the cloud source of truth for CRM (`crm_*` tables), Connect, messages, and profiles.  
- **Android SQLite** is the offline cache + outbox, changes queue and sync on sign-in.  
- **Web** reads/writes cloud tables directly (no offline mode).

---

## Smart app button on web

The header **Get app** button:

1. If CLIVORA is not installed → Play Store  
2. If installed → deep link `clivora://` to open the app  

Use this when a web page says “best in app.”

---

## Same login everywhere

Sign in once with your email. Plan, block status, and Connect data follow your profile in Supabase.
