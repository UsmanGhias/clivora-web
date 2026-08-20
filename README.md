<div align="center">
  <img src="https://raw.githubusercontent.com/UsmanGhias/clivora/main/assets/images/clivora_logo.png" alt="CLIVORA logo" width="112" />
  <h1>CLIVORA Web</h1>
  <p><strong>Open-source web platform, marketplace, and business workspace for the CLIVORA Freelancer OS.</strong></p>

  [![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-0F766E.svg)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-15-000000.svg)](https://nextjs.org)
  [![Website](https://img.shields.io/badge/Live-clivora.io-0F172A.svg)](https://clivora.io)
  [![Google Play](https://img.shields.io/badge/Android-Google_Play-414141.svg)](https://play.google.com/store/apps/details?id=org.codcrafters.clivora)

  [Website](https://clivora.io) · [Web app](https://clivora.io/app) · [Google Play](https://play.google.com/store/apps/details?id=org.codcrafters.clivora) · [Documentation](https://clivora.io/docs) · [Community](https://community.clivora.io)
</div>

## The community-built Freelancer OS

CLIVORA combines opportunity discovery with the tools needed to deliver professional freelance work. It is being opened so freelancers, clients, developers, designers, and researchers can shape a fairer product together.

- CLIVORA Connect for jobs, proposals, profiles, and mutual connections
- Freelancer and client workspaces
- CRM, projects, tasks, time tracking, invoices, files, meetings, and analytics
- AI assistance and business insights with human control
- $0 platform fee on negotiated work
- Web and Android product surfaces
- Public contribution and governance rules

> CLIVORA is independent and is not affiliated with Upwork, Fiverr, Toptal, or Freelancer.com.

## Live product

| Resource | URL |
|---|---|
| Marketing website | [clivora.io](https://clivora.io) |
| Web application | [clivora.io/app](https://clivora.io/app) |
| Documentation | [clivora.io/docs](https://clivora.io/docs) |
| Community | [community.clivora.io](https://community.clivora.io) |
| Android application | [Google Play](https://play.google.com/store/apps/details?id=org.codcrafters.clivora) |
| Mobile and platform repository | [UsmanGhias/clivora](https://github.com/UsmanGhias/clivora) |

## Technology

- Next.js 15 and React 19
- TypeScript and Tailwind CSS
- Supabase for authenticated platform services
- Vitest, ESLint, and TypeScript checks
- Hostinger production deployment with a separate staging workflow

## Local development

### Requirements

- Node.js 20 or 22
- npm
- A separate development Supabase project for authenticated features

### Start

```bash
git clone https://github.com/UsmanGhias/clivora-web.git
cd clivora-web
cp .env.example .env.local
npm install
npm run dev
```

Run the project checks before opening a pull request:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Use only development credentials. Never commit production secrets, service-role keys, payment keys, Odoo keys, customer data, or private deployment material.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [GOVERNANCE.md](GOVERNANCE.md). Large changes should start with an issue or proposal. Pull requests must be focused, tested, documented, and signed off.

High-impact contribution areas include accessibility, performance, SEO, localization, security, test coverage, documentation, marketplace trust, client workflows, freelancer workflows, and responsible AI.

If you want this mission to grow, please **star both CLIVORA repositories**, use the product, report reproducible problems, and help review community work.

## Security

Please do not publish vulnerabilities. Follow [SECURITY.md](SECURITY.md) and email **contact@clivora.io** with subject `[SECURITY] CLIVORA Web`.

## Licence and official identity

Code in this repository is licensed under the **GNU Affero General Public License v3.0**. Network deployments of modified versions are subject to AGPLv3 source-offer requirements.

Commercial use is allowed by AGPLv3. Official identity is separate: the licence does not grant permission to impersonate CLIVORA, publish a fork as the official CLIVORA product, or use protected CLIVORA/CODCrafters branding contrary to [TRADEMARKS.md](TRADEMARKS.md).

Copyright © 2026 Muhammad Usman Khan, professionally known as **Usman Ghias**, trading as **CODCrafters**, and contributors.

## Collaborate or sponsor

- [usmanghias@clivora.io](mailto:usmanghias@clivora.io)
- [contact@clivora.io](mailto:contact@clivora.io)
- [clivora.io](https://clivora.io)
- [codcrafters.org](https://codcrafters.org)
