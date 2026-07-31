/**
 * Public marketing smoke (fetch-based).
 * Usage: BASE_URL=https://clivora.codcrafters.org node scripts/public-smoke.mjs
 * Or against local: BASE_URL=http://127.0.0.1:3000 node scripts/public-smoke.mjs
 */
const base = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

async function check(path, { expectStatus = 200, expectRedirectTo = null, mustInclude = [], mustNotInclude = [] } = {}) {
  const url = `${base}${path}`;
  const res = await fetch(url, { redirect: expectRedirectTo ? "manual" : "follow" });
  const status = res.status;
  const location = res.headers.get("location") || "";
  let body = "";
  if (!expectRedirectTo) {
    body = await res.text();
  }

  const failures = [];
  if (expectRedirectTo) {
    if (![301, 308, 302, 307].includes(status)) {
      failures.push(`${path}: expected redirect status, got ${status}`);
    }
    const norm = location.replace(base, "");
    if (!norm.includes(expectRedirectTo) && !location.includes(expectRedirectTo)) {
      failures.push(`${path}: expected Location containing ${expectRedirectTo}, got ${location}`);
    }
  } else if (status !== expectStatus) {
    failures.push(`${path}: expected ${expectStatus}, got ${status}`);
  }

  for (const s of mustInclude) {
    if (!body.includes(s)) failures.push(`${path}: missing "${s}"`);
  }
  for (const s of mustNotInclude) {
    if (body.includes(s)) failures.push(`${path}: must not include "${s}"`);
  }

  return { path, ok: failures.length === 0, failures, status, location };
}

async function main() {
  const results = [];
  results.push(
    await check("/", {
      mustInclude: ["CLIVORA", "Freelancer OS"],
      mustNotInclude: ["1.2k+", "hold escrow", "JazzCash", "Lahore"],
    }),
  );
  results.push(
    await check("/compare", {
      mustInclude: ["Upwork", "Fiverr"],
      mustNotInclude: ["Mostly freelancers"],
    }),
  );
  results.push(await check("/comapre", { expectRedirectTo: "/compare" }));
  results.push(await check("/login", { mustInclude: ["Login", "password"] }));
  results.push(await check("/signup", { mustInclude: ["Sign"] }));
  results.push(
    await check("/docs", {
      mustInclude: ["CLIVORA Documentation", "payment-status"],
      mustNotInclude: ["payments in one platform"],
    }),
  );

  const failed = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? "PASS" : "FAIL"} ${r.path} (${r.status}${r.location ? " -> " + r.location : ""})`);
    for (const f of r.failures) console.log(`  - ${f}`);
  }
  if (failed.length) {
    console.error(`\n${failed.length} smoke check(s) failed against ${base}`);
    process.exit(1);
  }
  console.log(`\nAll public smoke checks passed against ${base}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
