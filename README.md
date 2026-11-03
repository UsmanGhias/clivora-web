# CLIVORA Web

The official web platform and marketing application for CLIVORA, the open-source Freelancer OS.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-0F766E.svg)](LICENSE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22843765.svg)](https://doi.org/10.5281/zenodo.22843765)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com)
[![Live Site](https://img.shields.io/badge/Live-clivora.io-0F172A.svg)](https://clivora.io)

Live application: https://clivora.io  
Documentation: https://clivora.io/docs  
Mobile application (Flutter): https://github.com/UsmanGhias/clivora

## Architecture and stack

Built with modern web technologies:
- Next.js (App Router, Server Actions, Server Components)
- TypeScript for type safety across all database and API schemas
- Tailwind CSS with responsive layout tokens
- Supabase for PostgreSQL database, authentication, and real-time events
- SafePay and Stripe for secure payments

## Quickstart

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/UsmanGhias/clivora-web.git
cd clivora-web
npm install
```

2. Configure environment variables:
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the application.

## Security

Please report vulnerabilities directly to security@clivora.io per our [Security Policy](SECURITY.md). Never open public GitHub issues for security disclosures.

## License

Released under the GNU Affero General Public License v3 (AGPL-3.0). See [LICENSE](LICENSE) for details.  
Curated and architected by [Usman Ghias](https://usmanghias.co.uk).
