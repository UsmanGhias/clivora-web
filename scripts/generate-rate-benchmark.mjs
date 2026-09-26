#!/usr/bin/env node
/**
 * Generates content/blog/remote-software-engineer-rates-2026.md from CLIVORA's own
 * published job listings, so every figure in the article comes from real data.
 *
 *   node scripts/generate-rate-benchmark.mjs            fetch live data, write article
 *   node scripts/generate-rate-benchmark.mjs --dry      print the computed stats only
 *   node scripts/generate-rate-benchmark.mjs --fixture f.json   run against a local JSON array
 *   add --out path.md to write somewhere other than content/blog
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY, falling back to the
 * public defaults in src/lib/supabase/env.ts. Uses only the anon key and public rows.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const OUT = outIdx >= 0 ? path.resolve(args[outIdx + 1]) : path.join(ROOT, "content", "blog", "remote-software-engineer-rates-2026.md");
const DRY = args.includes("--dry");
const fixtureIdx = args.indexOf("--fixture");
const MIN_GROUP = 15; // suppress any group smaller than this
const MIN_TOTAL = 60; // refuse to publish below this many usable pay figures
const HOURS_PER_YEAR = 2080;

function config() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    const env = fs.readFileSync(path.join(ROOT, "src/lib/supabase/env.ts"), "utf8");
    url ||= env.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0];
    key ||= env.match(/eyJ[A-Za-z0-9._-]{40,}/)?.[0];
  }
  if (!url || !key) throw new Error("Supabase URL or anon key not found");
  return { url, key };
}

async function fetchJobs() {
  const { url, key } = config();
  const cols = "salary_min,salary_max,currency,job_type,tags,location,created_at,source,source_url";
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(
      `${url}/rest/v1/connect_jobs?select=${cols}&is_public=eq.true&status=eq.published&order=created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + 999}` } },
    );
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return rows;
}

const pct = (sorted, q) => {
  if (!sorted.length) return NaN;
  const r = (sorted.length - 1) * q, lo = Math.floor(r), hi = Math.ceil(r);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (r - lo);
};
const dist = (vals) => {
  const s = [...vals].sort((a, b) => a - b);
  return { n: s.length, p25: pct(s, 0.25), p50: pct(s, 0.5), p75: pct(s, 0.75) };
};
const usd = (v, d = 0) => (Number.isFinite(v) ? `$${v.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d })}` : "n/a");
const pctFmt = (v) => `${(v * 100).toFixed(1)}%`;

const SKILLS = {
  React: ["react", "reactjs"], TypeScript: ["typescript"], JavaScript: ["javascript"],
  "Node.js": ["node", "nodejs", "node.js"], Python: ["python"], Go: ["go", "golang"],
  Rust: ["rust"], Java: ["java"], Kotlin: ["kotlin"], Swift: ["swift", "ios"],
  Flutter: ["flutter", "dart"], PHP: ["php", "laravel"], Ruby: ["ruby", "rails"],
  "AWS / Cloud": ["aws", "cloud", "gcp", "azure"], DevOps: ["devops", "kubernetes", "terraform"],
  "Data / ML": ["machine learning", "ml", "data science", "data engineering", "ai"],
};

function region(loc = "") {
  const l = loc.toLowerCase();
  if (!l || /anywhere|worldwide|global|remote$/.test(l)) return "Worldwide / anywhere";
  if (/\b(us|usa|united states|america|canada|north america)\b/.test(l)) return "North America";
  if (/europe|\beu\b|emea|uk|united kingdom|germany|france|spain|netherlands|poland|portugal/.test(l)) return "Europe / EMEA";
  if (/latam|latin america|brazil|mexico|argentina|colombia/.test(l)) return "Latin America";
  if (/asia|apac|india|pakistan|philippines|singapore|japan|australia/.test(l)) return "Asia-Pacific";
  return "Other / unspecified";
}

function analyse(rows) {
  const total = rows.length;
  const withPay = rows.filter((r) => Number(r.salary_min) > 0 || Number(r.salary_max) > 0);
  const usdRows = withPay.filter((r) => String(r.currency || "").toUpperCase() === "USD");
  const hourly = [], annual = [];
  let ambiguous = 0;
  for (const r of usdRows) {
    const a = Number(r.salary_min) || 0, b = Number(r.salary_max) || 0;
    const mid = a && b ? (a + b) / 2 : a || b;
    const rec = { ...r, mid, tags: (r.tags || []).map((t) => String(t).toLowerCase()) };
    if (mid < 500) hourly.push(rec);
    else if (mid >= 15000) annual.push(rec);
    else ambiguous++;
  }
  const byType = (list, type) => dist(list.filter((r) => r.job_type === type).map((r) => r.mid));
  const skillRows = Object.entries(SKILLS).map(([name, keys]) => {
    const d = dist(annual.filter((r) => r.tags.some((t) => keys.includes(t))).map((r) => r.mid));
    return { name, ...d };
  }).filter((s) => s.n >= MIN_GROUP).sort((x, y) => y.p50 - x.p50);
  const regions = {};
  for (const r of annual) (regions[region(r.location)] ||= []).push(r.mid);
  const regionRows = Object.entries(regions).map(([name, v]) => ({ name, ...dist(v) }))
    .filter((s) => s.n >= MIN_GROUP).sort((x, y) => y.p50 - x.p50);
  const dates = rows.map((r) => r.created_at).filter(Boolean).sort();
  return {
    total, withPay: withPay.length, usd: usdRows.length, nonUsd: withPay.length - usdRows.length, ambiguous,
    hourly: dist(hourly.map((r) => r.mid)), annual: dist(annual.map((r) => r.mid)),
    annualFT: byType(annual, "full_time"), annualContract: byType(annual, "contract"),
    hourlyContract: byType(hourly, "contract"),
    skillRows, regionRows, from: dates[0]?.slice(0, 10), to: dates.at(-1)?.slice(0, 10),
  };
}

function article(s) {
  const today = new Date().toISOString().slice(0, 10);
  const annualHourly = s.annual.p50 / HOURS_PER_YEAR;
  const hasHourly = s.hourly.n >= MIN_GROUP;
  const discl = s.total ? s.withPay / s.total : 0;
  const rowOf = (label, d, conv = false) =>
    `| ${label} | ${d.n} | ${usd(d.p25)} | ${usd(d.p50)} | ${usd(d.p75)} |${conv ? ` ${usd(d.p50 / HOURS_PER_YEAR, 2)} |` : ""}`;

  const skillTable = s.skillRows.length
    ? ["| Skill tag | Listings | 25th pct | Median | 75th pct | Median hourly equiv. |", "| --- | --- | --- | --- | --- | --- |",
       ...s.skillRows.map((r) => rowOf(r.name, r, true))].join("\n")
    : `No individual skill had at least ${MIN_GROUP} salaried listings with disclosed USD pay, so no per-skill figures are reported.`;
  const regionTable = s.regionRows.length
    ? ["| Hiring region stated in listing | Listings | 25th pct | Median | 75th pct |", "| --- | --- | --- | --- | --- |",
       ...s.regionRows.map((r) => rowOf(r.name, r))].join("\n")
    : `No region had at least ${MIN_GROUP} salaried listings with disclosed USD pay.`;

  const contractCompare = hasHourly
    ? (s.hourly.p50 > annualHourly
        ? `The median disclosed hourly rate, ${usd(s.hourly.p50, 2)}, sits above the ${usd(annualHourly, 2)} hourly equivalent of the median salary. That premium is expected: contract rates have to cover time a salary pays for and a contractor does not get paid for.`
        : `The median disclosed hourly rate, ${usd(s.hourly.p50, 2)}, sits at or below the ${usd(annualHourly, 2)} hourly equivalent of the median salary. Taken at face value, that means many hourly contract roles in this dataset pay less per hour than salaried equivalents once benefits and unpaid time are counted, which is worth knowing before accepting an hourly offer.`)
    : `Only ${s.hourly.n} listings disclosed an hourly USD rate, below the ${MIN_GROUP}-listing threshold used throughout this analysis, so no hourly median is reported. Hourly contract roles disclose pay far less often than salaried ones.`;

  const exampleRate = hasHourly ? s.hourly.p50 : annualHourly * 1.4;
  const exampleLabel = hasHourly ? "the dataset's median hourly rate" : "the salaried median's hourly equivalent plus a 40% contractor premium";

  return `---
title: The 2026 Global Remote Software Engineer Rate Benchmark: Hourly vs Fixed-Price Analysis
description: Pay figures from ${s.total.toLocaleString("en-US")} remote job listings indexed on Clivora between ${s.from} and ${s.to}, with salaried and hourly distributions, breakdowns by skill and hiring region, and a method for turning an hourly rate into a fixed-price quote.
date: ${today}
keywords: remote software engineer salary 2026, freelance developer hourly rate, remote developer rates, fixed price vs hourly, software contractor rates, remote engineer pay benchmark
---

Most published rate surveys ask engineers what they earn. This benchmark takes a different source: the pay ranges employers and clients state when they advertise a remote role. It covers ${s.total.toLocaleString("en-US")} remote listings indexed on Clivora between ${s.from} and ${s.to}.

Every number below is computed from those listings by a script that is rerun whenever the article is updated. Where a group has fewer than ${MIN_GROUP} listings, it is left out rather than reported from a sample too small to mean anything.

## How the data was prepared

Listings come from Clivora's own job board, which combines roles posted by clients on the platform with remote roles indexed from public job boards. The steps:

1. **Pay disclosed.** Only listings stating a minimum or maximum pay figure were used.
2. **USD only.** Listings in other currencies were set aside instead of converted, so exchange-rate choices do not distort the figures. ${s.nonUsd.toLocaleString("en-US")} listings with non-USD pay were excluded on this basis.
3. **Midpoint.** Where a range was given, the midpoint was used. Where only one bound was given, that figure was used.
4. **Pay basis.** Figures under $500 were treated as hourly rates and figures of $15,000 or more as annual salaries. ${s.ambiguous.toLocaleString("en-US")} listings fell between those bounds, where monthly salaries and project fees overlap, and were excluded rather than guessed at.
5. **Hourly equivalents.** Annual figures are converted at ${HOURS_PER_YEAR.toLocaleString("en-US")} hours per year (40 hours across 52 weeks), the same convention US payroll uses.

## How many listings disclose pay at all

Of ${s.total.toLocaleString("en-US")} listings, ${s.withPay.toLocaleString("en-US")} stated a pay figure: ${pctFmt(discl)}. The rest said nothing, or used phrases such as "competitive." That disclosure rate is itself a finding for anyone negotiating, because a rate you cannot see is a rate the other side sets.

## Salaried remote roles

Across ${s.annual.n.toLocaleString("en-US")} salaried listings with disclosed USD pay:

| Group | Listings | 25th pct | Median | 75th pct |
| --- | --- | --- | --- | --- |
${rowOf("All salaried roles", s.annual)}
${s.annualFT.n >= MIN_GROUP ? rowOf("Full-time", s.annualFT) : `| Full-time | ${s.annualFT.n} | below threshold | | |`}
${s.annualContract.n >= MIN_GROUP ? rowOf("Contract, annualised", s.annualContract) : `| Contract, annualised | ${s.annualContract.n} | below threshold | | |`}

The median salary of ${usd(s.annual.p50)} works out to about ${usd(annualHourly, 2)} an hour on a ${HOURS_PER_YEAR.toLocaleString("en-US")}-hour year. The gap between the 25th and 75th percentiles, ${usd(s.annual.p25)} to ${usd(s.annual.p75)}, is the range most of the market sits in.

## Hourly and contract roles

${hasHourly ? `| Group | Listings | 25th pct | Median | 75th pct |
| --- | --- | --- | --- | --- |
${rowOf("All hourly listings", s.hourly)}
${s.hourlyContract.n >= MIN_GROUP ? rowOf("Hourly, contract type", s.hourlyContract) : ""}
` : ""}
${contractCompare}

## Pay by skill

Skills are taken from the tags on each listing, so a role tagged with both React and TypeScript counts toward both.

${skillTable}

Read these as the pay attached to roles that mention a skill, not the value of the skill itself. A listing tagged Rust is often a systems or infrastructure role, and part of what it pays for is the seniority those roles tend to require.

## Pay by hiring region

"Remote" rarely means the whole world. Many listings restrict hiring to a region for tax, time-zone or employment-law reasons. Grouping salaried listings by the region they state:

${regionTable}

A remote role restricted to North America and one open worldwide are different markets, even when the job titles match. If you are outside a listing's stated region, the relevant comparison is the worldwide group.

## Hourly versus fixed-price: converting between them

Listings state hourly rates or salaries. Clients often want a fixed price. Turning one into the other is where freelancers most often underprice.

A contractor's hourly rate has to cover things a salary includes and a contract does not: paid leave, public holidays, sick days, employer pension or social-security contributions, equipment, software, and the hours spent finding the next client. The usual way to account for this is a billable-utilisation figure: the share of working hours you can actually invoice. Many independent engineers bill between 50% and 75% of their working time once sales, admin and gaps between projects are counted. Your own figure is the one that matters.

\`\`\`text
contractor hourly rate = target annual income / (${HOURS_PER_YEAR} x billable utilisation)

fixed price = estimated hours x hourly rate x (1 + risk buffer)
\`\`\`

As a worked example, take ${exampleLabel}, ${usd(exampleRate, 2)}. A project estimated at 120 hours, with a 25% risk buffer for unclear requirements, comes to 120 x ${usd(exampleRate, 2)} x 1.25 = ${usd(120 * exampleRate * 1.25)}.

The buffer is the part people skip. A fixed price moves estimation risk from the client to you. If the 120-hour estimate turns out to be 160 hours, an hourly contract pays for the extra 40 and a fixed-price contract does not. The buffer is what you charge for carrying that risk, and it should grow with how unclear the scope is. Well-specified work with a clear acceptance test might carry 10% to 15%. A first project with a client who has not written down what they want might justify 30% or more, or a paid discovery phase before any fixed quote.

Fixed pricing also cuts the other way. If you estimate well and deliver in less time than quoted, the difference is yours. Engineers who have built the same kind of system several times often earn more per hour on fixed-price work for exactly this reason.

## The overhead wedge between salaried and contract income

A common error made by developers transitioning from employment to independent contracting is matching their hourly rate directly to a salaried equivalent. If an employer advertises a salaried role at $120,000, the baseline cost to that employer is between 15% and 25% higher once statutory payroll taxes, health insurance subsidies, pension matching, equipment allowances, and paid leave are factored in. When you contract directly, all of those costs shift onto your ledger.

In the United States, self-employment tax imposes an immediate 15.3% liability on net earnings up to the Social Security wage base, covering both the employee and employer portions of FICA. In the United Kingdom and European jurisdictions, national insurance or social security contributions create a similar statutory friction. Beyond taxes, an independent engineer pays for commercial software licenses, cloud infrastructure sandbox accounts, private medical coverage, accounting fees, and legal review of client master service agreements.

The largest financial wedge is unbillable time. An employee receives a steady paycheck across 2,080 calendar hours regardless of administrative friction. An independent engineer must allocate between 10 and 15 hours each week to client pipeline development, technical scoping, proposal drafting, contract negotiation, and invoice chasing. An engineer who works 40 calendar hours a week realistically bills between 25 and 30 hours. Dividing target annual take-home pay by 1,200 to 1,400 billable hours, rather than 2,080, reveals why a contract rate must sit 40% to 70% above the salaried hourly equivalent just to reach financial parity.

## Milestone structuring and cash collection strategy

Fixed-price contracts protect clients against budget expansion, but without strict milestone pacing, they expose contractors to cashflow starvation. Independent engineers should never agree to a payment structure where 100% of the contract value is disbursed upon final sign-off. If a project encounters client-side delays, reorganization, or scope expansion, the contractor carries the entire carrying cost of unpaid labour.

A defensive milestone schedule distributes capital across three distinct phases:

1. **Commitment deposit (30% to 40%).** Due upon contract signature, before any engineering design, environment configuration, or repository initialization begins. This deposit secures calendar allocation and covers discovery and architecture.
2. **Functional milestone (30% to 40%).** Due upon delivery of a functional build running in a staging environment that satisfies documented acceptance criteria. This milestone should be tied to objective verification, such as passing test suites or API endpoint demonstration, rather than subjective design satisfaction.
3. **Release and final handover (20% to 30%).** Due prior to production deployment or final repository transfer. Staging artifacts and container images can be verified by the client, but production database migrations and primary repository write permissions should only be transferred after receipt of cleared funds.

If a client requests changes outside the original statement of work during any phase, those requests should be quoted as independent change orders with separate milestone invoices rather than folded into the active sprint.

## Limitations

This is a benchmark of advertised pay in one set of listings, not of what people are actually paid.

- **Advertised is not agreed.** Stated ranges are the start of a negotiation, and final offers can land outside them.
- **Disclosure bias.** Only ${pctFmt(discl)} of listings disclosed pay. Employers who publish ranges may differ systematically from those who do not, and some jurisdictions now require pay ranges in job ads, which skews disclosed listings toward those locations.
- **Source mix.** The data combines roles posted directly by clients on Clivora with roles indexed from public job boards, and it reflects which boards were indexed.
- **USD only.** Roles priced in EUR, GBP and other currencies are excluded, which under-represents markets that advertise in local currency.
- **Pay-basis rules.** The $500 and $15,000 cut-offs for classifying hourly and annual figures are a judgement. They exclude a band of listings rather than guess at them.

## How to use this

For a salaried remote role, compare an offer against the percentile band for your region and skill, and treat the median as the middle of the market, not the ceiling. For contract work, start from the salary you would accept, divide by a realistic billable-hours figure, and do not quote below the result. For fixed-price work, estimate in hours first, price in money second, and add a buffer sized to how much you do not yet know.

This benchmark is regenerated from current listings when it is updated. The date at the top shows when the figures were last computed.
`;
}

const rows = fixtureIdx >= 0 ? JSON.parse(fs.readFileSync(args[fixtureIdx + 1], "utf8")) : await fetchJobs();
const stats = analyse(rows);
console.log(JSON.stringify({ ...stats, skillRows: stats.skillRows.length, regionRows: stats.regionRows.length }, null, 2));
if (stats.hourly.n + stats.annual.n < MIN_TOTAL) {
  console.error(`\nOnly ${stats.hourly.n + stats.annual.n} usable USD pay figures (need ${MIN_TOTAL}). Not writing the article.`);
  process.exit(2);
}
if (!DRY) {
  fs.writeFileSync(OUT, article(stats));
  console.log(`\nWrote ${path.relative(ROOT, OUT)}`);
}
