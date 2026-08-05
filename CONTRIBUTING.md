# Contributing to CLIVORA

Thank you for helping build a fair, useful Freelancer OS.

## Before you start

- Search existing issues and pull requests.
- Open an issue before a large feature, dependency change, migration, redesign, or architecture change.
- Do not include secrets, customer data, private communications, proprietary third-party material, or production credentials.
- Security vulnerabilities must follow [SECURITY.md](SECURITY.md), not public issues.
- Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Contribution workflow

1. Fork the repository.
2. Create a focused branch such as `feat/invoice-accessibility` or `fix/offline-sync-conflict`.
3. Make the smallest complete change that solves the agreed problem.
4. Add or update tests and documentation.
5. Run the repository checks.
6. Sign off every commit using `git commit -s`.
7. Open a pull request using the template.

Do not push directly to `main`. A pull request requires review by a code owner. Approval never grants access to production systems, customer data, signing keys, payment systems, or private infrastructure.

## Commit style

Use clear, conventional prefixes where practical:

- `feat:` new user-facing behavior
- `fix:` defect correction
- `docs:` documentation only
- `test:` test coverage
- `refactor:` behavior-preserving code improvement
- `security:` security hardening
- `chore:` maintenance

## Developer Certificate of Origin

By adding `Signed-off-by: Your Name <your@email>` to a commit, you certify that you have the right to submit the contribution under this repository's licence. Use:

```bash
git commit -s -m "feat: concise description"
```

Contributors retain copyright in their original contributions and license them under AGPLv3 as part of this project.

## AI-assisted contributions

AI tools may assist, but the human contributor remains responsible. A pull request must:

- disclose material AI assistance;
- identify the tool when relevant;
- be fully reviewed and understood by the contributor;
- include appropriate tests;
- contain no secrets, personal data, copied proprietary code, or unverifiable claims;
- comply with licences of all dependencies and source material.

Low-quality bulk submissions, generated issue spam, fake activity, or code the submitter cannot explain may be closed.

## Pull request quality

A good pull request:

- solves one clear problem;
- explains user impact and tradeoffs;
- avoids unrelated formatting or rewrites;
- preserves role separation, privacy, offline behavior, and web/Android contracts;
- includes screenshots for visible UI changes;
- includes migrations and rollback notes when data changes;
- passes relevant tests and static checks;
- updates documentation and changelog material when needed.

Maintainers may request changes, split an oversized pull request, or decline work that conflicts with product safety, legal obligations, security, or the published roadmap.

## Design principles

CLIVORA contributions should protect:

1. freelancer and client dignity;
2. transparent product behavior;
3. user privacy and data ownership;
4. accessibility and international usability;
5. secure defaults and least privilege;
6. useful AI with human control;
7. web and Android consistency;
8. maintainable code over vanity complexity.

## Getting help

Use a public discussion or issue for normal contribution questions.

- Collaboration: usmanghias@clivora.io
- General contact: contact@clivora.io
