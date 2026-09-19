# Clivora & CODCrafters Outreach Engine

An automated, high-deliverability B2B email marketing and cold outreach engine built for **Clivora**, **CODCrafters**, and **Usman Ghias** (Founder & Principal Architect).

Powered directly by **Hostinger TLS SMTP (`smtp.hostinger.com:465`)** with built-in anti-spam algorithms, humanized pacing delays, and daily quota caps.

---

## 1. Engine Highlights & Compliance

- **Daily Quota Cap:** Strictly enforced at **95 emails/day** (safely below Hostinger's 100/day mailbox limit to maintain 100% IP/domain reputation).
- **Anti-Spam Human Pacing:** Random delays of **15 to 35 seconds** between individual sends to prevent burst-pattern spam flags.
- **Spam-Proof Email Architecture:**
  - SPF, DKIM, and DMARC aligned headers via `clivora.io`.
  - RFC 5322 compliant Message-ID and `List-Unsubscribe` headers.
  - Multipart MIME (clean UTF-8 plain-text fallback + responsive inline HTML).
  - Professional, value-first B2B copy with zero trigger words.
- **Zero Duplicate Guarantee:** Persistent ledger tracking in `data/outreach_tracker.json`.

---

## 2. Multi-Segment Campaign Architecture

| Segment | Target Audience | Primary Value Proposition | Key Call to Action |
| :--- | :--- | :--- | :--- |
| **Segment A: Clients & CTOs** | Tech Founders, Agency Leaders, Engineering Directors | 0% platform fee developer hiring on Clivora + CODCrafters enterprise engineering (Odoo ERP, AI, Web/Mobile) | [Start a Project](https://community.clivora.io/start-a-project) & [Client Workspace](https://clivora.io/for-clients) |
| **Segment B: Sponsors & Partners** | VCs, Accelerators, Tech Tools, API Providers | Clivora Virtual Summit 2026 sponsorship, API directory spotlight, 15% recurring referral network | [Partner Tiers](https://community.clivora.io/partners) |
| **Segment C: Freelancers & Builders** | Senior Developers, Designers, Consultants | Zero-commission Freelancer OS, 700+ remote jobs feed, and milestone contract escrow | [Open Free Workspace](https://clivora.io/signup) & [Browse Jobs](https://clivora.io/jobs) |

---

## 3. Quick Start & CLI Usage

### Check Engine Status
```bash
node src/engine.js --mode status
```

### Dry Run (Preview Rendered Copy)
```bash
node src/engine.js --mode dry-run
```

### Send Test Pack to Your Inbox
```bash
export SMTP_PASS="your_hostinger_mailbox_password"
node src/engine.js --mode test --to your.name@domain.com
```

### Execute Daily Outreach Batch (Day 1)
```bash
export SMTP_PASS="your_hostinger_mailbox_password"
node src/engine.js --mode run --day 1 --limit 95
```

---

## 4. Adding Custom Leads

To add your own lead lists, create `data/leads.json`:
```json
[
  {
    "email": "cto@company.com",
    "name": "Jane Doe",
    "company": "Acme Tech",
    "role": "CTO",
    "segment": "CLIENT"
  },
  {
    "email": "partners@accelerator.io",
    "name": "John Smith",
    "company": "Seed Labs",
    "segment": "SPONSOR"
  },
  {
    "email": "engineer@freelance.dev",
    "name": "Alex Vance",
    "skill": "Full-Stack React & Python",
    "segment": "FREELANCER"
  }
]
```

---

## 5. Automated Daily Cron Setup

To run a batch automatically every day at 9:00 AM:
```bash
0 9 * * * cd /home/usmanghias/Projects/clivora/scripts/outreach-engine && SMTP_PASS="your_hostinger_mailbox_password" node src/engine.js --mode run >> data/cron_outreach.log 2>&1
```
