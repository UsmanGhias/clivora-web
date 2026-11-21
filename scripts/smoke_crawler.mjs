/**
 * Automated Route Smoke Crawler for Clivora
 * Crawls all public routes, verifies HTTP 200, checks for error boundaries/crashes,
 * and validates portfolio domain compliance (usmanghias.co.uk).
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:3000 node scripts/smoke_crawler.mjs
 */

const BASE_URL = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/agency",
  "/blog",
  "/blog/authors/usman-ghias",
  "/compare",
  "/compare/bonsai",
  "/compare/contra",
  "/compare/fiverr",
  "/compare/upwork",
  "/connect",
  "/contact",
  "/cookies",
  "/data-safety",
  "/delete-account",
  "/disclaimer",
  "/docs",
  "/docs/resources",
  "/download",
  "/features",
  "/for-clients",
  "/for-freelancers",
  "/integrations",
  "/jobs",
  "/open-source",
  "/pricing",
  "/privacy",
  "/pro",
  "/promo/11-11",
  "/security",
  "/sitemap",
  "/start-a-project",
  "/support",
  "/terms",
  "/tools",
  "/tools/freelance-rate-calculator",
  "/tools/invoice-generator",
  "/tools/upwork-fee-calculator",
  "/tools/fiverr-fee-calculator",
  "/tools/client-savings-calculator",
  "/tools/contract-generator",
  "/tools/badge-generator",
  "/trust",
  "/login",
  "/signup",
  "/auth/reset-password",
];

const REDIRECT_ROUTES = [
  { path: "/comapre", expectedTarget: "/compare" },
  { path: "/app", expectedTarget: "/login" },
  { path: "/admin/stats", expectedTarget: "/admin" },
];

const FORBIDDEN_STRINGS = [
  "Application error: a client-side exception has occurred",
  "Unhandled Runtime Error",
  "Something unexpected happened",
  "ChunkLoadError",
  "usman.codcrafters.org",
  "usmanghias.vercel.app",
];

async function checkRoute(path) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const status = res.status;

    if (status !== 200) {
      return { path, ok: false, error: `Expected 200 OK, got ${status}` };
    }

    const html = await res.text();
    for (const forbidden of FORBIDDEN_STRINGS) {
      if (html.includes(forbidden)) {
        return { path, ok: false, error: `Encountered forbidden string: "${forbidden}"` };
      }
    }

    return { path, ok: true, status };
  } catch (err) {
    return { path, ok: false, error: err.message || "Network error" };
  }
}

async function checkRedirect(path, expectedTarget) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const status = res.status;
    const location = res.headers.get("location") || "";

    const isRedirect = [301, 302, 307, 308].includes(status);
    if (!isRedirect) {
      return { path, ok: false, error: `Expected redirect status (301/302/307/308), got ${status}` };
    }

    if (!location.includes(expectedTarget)) {
      return { path, ok: false, error: `Expected redirect to include "${expectedTarget}", got "${location}"` };
    }

    return { path, ok: true, status, location };
  } catch (err) {
    return { path, ok: false, error: err.message || "Network error" };
  }
}

async function main() {
  console.log(`=== CLIVORA AUTOMATED ROUTE SMOKE CRAWLER ===`);
  console.log(`Target Base URL: ${BASE_URL}\n`);

  let passed = 0;
  let failed = 0;
  const failures = [];

  console.log(`[1/2] Verifying ${PUBLIC_ROUTES.length} public marketing & tool pages...`);
  for (const path of PUBLIC_ROUTES) {
    const result = await checkRoute(path);
    if (result.ok) {
      passed++;
      process.stdout.write(`  ✓ ${path}\n`);
    } else {
      failed++;
      failures.push(result);
      process.stdout.write(`  ✗ ${path} - ${result.error}\n`);
    }
  }

  console.log(`\n[2/2] Verifying ${REDIRECT_ROUTES.length} redirect rules...`);
  for (const { path, expectedTarget } of REDIRECT_ROUTES) {
    const result = await checkRedirect(path, expectedTarget);
    if (result.ok) {
      passed++;
      process.stdout.write(`  ✓ ${path} -> ${result.location}\n`);
    } else {
      failed++;
      failures.push(result);
      process.stdout.write(`  ✗ ${path} - ${result.error}\n`);
    }
  }

  console.log(`\n============================================`);
  console.log(`Summary: ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    console.error(`\nFailed routes detail:`);
    for (const f of failures) {
      console.error(`  - ${f.path}: ${f.error}`);
    }
    process.exit(1);
  }

  console.log(`All routes verified clean! 100% operational.`);
}

main().catch((err) => {
  console.error("Fatal error during smoke test:", err);
  process.exit(1);
});
