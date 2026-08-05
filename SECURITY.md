# Security Policy

Security and user trust are release requirements for CLIVORA.

## Report a vulnerability privately

Do not open a public issue, pull request, discussion, or social post for an unpatched vulnerability.

Email **contact@clivora.io** with subject:

`[SECURITY] CLIVORA - short description`

For urgent coordination, copy **usmanghias@clivora.io**.

Include:

- affected repository, version, route, or component;
- impact and realistic attack scenario;
- reproducible steps or a minimal proof of concept;
- required privileges and environment assumptions;
- suggested remediation, if known;
- whether the issue has been disclosed elsewhere.

Do not include real customer data. Use a test account and a development environment.

## Safe research rules

Researchers must not:

- access, modify, download, or delete data belonging to other users;
- degrade availability or run denial-of-service testing;
- use automated scanning that harms production;
- perform social engineering, phishing, spam, or credential attacks;
- access payment, email, Odoo, Supabase, hosting, or app-store accounts;
- retain secrets or personal data discovered accidentally.

Stop testing and report immediately if you encounter production data or credentials.

## Response targets

These are good-faith targets, not a legal service-level agreement:

- acknowledgement within 3 business days;
- initial triage within 7 business days;
- remediation plan based on severity and complexity;
- coordinated disclosure only after a fix or agreed timeline.

Please allow a reasonable remediation period before public disclosure.

## Supported code

Security fixes target the latest maintained release and the default branch. Old forks, modified deployments, unofficial binaries, and unsupported releases may need to apply upstream patches independently.

## Secrets

Never commit service-role keys, signing keys, passwords, private API keys, webhook secrets, customer exports, or production environment files. If a secret is committed, removing the file is not enough. Rotate or revoke it and clean repository history before publication.

## Recognition

Responsible reporters may be credited with permission. CLIVORA does not currently promise a paid bug bounty.
