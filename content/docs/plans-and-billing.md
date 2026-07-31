# Plans and billing

CLIVORA has three tiers: **Free**, **Pro**, and **Pro Plus**.

---

## Free plan

Good for trying CLIVORA or very small workloads.

| Limit | Value |
|-------|-------|
| Clients | 3 |
| Projects | 5 |
| Invoices per month | 10 |
| Message templates | 3 |
| File vault | 100 MB |

**Includes:** Dashboard, basic reports, client portal basics, Connect **browse** (not contact/post), messages, notifications.

---

## Pro, $9/month

Unlimited CRM on web and app. Advanced tools mainly in **Android app**.

**Freelancer Pro highlights:**
- Unlimited clients, projects, invoices  
- Global search, calendar, automations  
- AI assistant (app), team invites, biometric lock  
- Data export, contract PDFs, 5 GB file vault  
- 500 emails/month  

**Client Pro highlights:**
- Unlimited contracts, PDF downloads  
- Advanced activity, priority notifications  
- Data export, biometric lock  

**Billing:**
- **Android:** Google Play subscription (`clivora_pro_freelancer_monthly` or `clivora_pro_client_monthly`)
- **Web:** Manual checkout at [/pro](/pro). JazzCash, Easypaisa, bank transfer

---

## Pro Plus, $19/month

Everything in Pro, plus **CLIVORA Connect** marketplace:

- Publish freelancer profile  
- Post client jobs  
- Send Connect requests and use Inbox  
- 50 GB vault, 3000 emails/month  
- White-label invoices, priority support+  

**Billing:**
- **Android:** `clivora_pro_plus_freelancer_monthly` / `clivora_pro_plus_client_monthly`  
- **Web:** [/pro?plan=pro_plus](/pro?plan=pro_plus)

---

## Important billing rules

1. **One email = one account type** (freelancer or client), chosen at signup.  
2. **If you already have Pro**, web checkout will not charge Pro again, only Pro Plus upgrade.  
3. **If you already have Pro Plus**, checkout shows “already unlocked.”  
4. Web payments are **manual approval**, submit reference ID; admin grants plan in Supabase.  
5. Android payments are **automatic** via Google Play.

---

## Referrals

The Android app includes a referral program, bonus subscription days when a referred user purchases Pro or Plus (see app Referrals screen).

---

## Cancel anytime

- Google Play: manage subscription in Play Store.  
- Web manual: contact [contact@clivora.io](mailto:contact@clivora.io).

---

## Plan stored in cloud

Your plan lives in Supabase `profiles.subscription_plan`. Web and app read the same value after sync.
