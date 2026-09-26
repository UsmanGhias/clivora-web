---
title: The 2026 Global Remote Software Engineer Rate Benchmark: Hourly vs Fixed-Price Analysis
description: Pay figures from 6,673 remote job listings indexed on Clivora between 2026-08-28 and 2026-09-25, with salaried and hourly distributions, breakdowns by skill and hiring region, and a method for turning an hourly rate into a fixed-price quote.
date: 2026-09-26
keywords: remote software engineer salary 2026, freelance developer hourly rate, remote developer rates, fixed price vs hourly, software contractor rates, remote engineer pay benchmark
---

Most published rate surveys ask engineers what they earn. This benchmark takes a different source: the pay ranges employers and clients state when they advertise a remote role. It covers 6,673 remote listings indexed on Clivora between 2026-08-28 and 2026-09-25.

Every number below is computed from those listings by a script that is rerun whenever the article is updated. Where a group has fewer than 15 listings, it is left out rather than reported from a sample too small to mean anything.

## How the data was prepared

Listings come from Clivora's own job board, which combines roles posted by clients on the platform with remote roles indexed from public job boards. The steps:

1. **Pay disclosed.** Only listings stating a minimum or maximum pay figure were used.
2. **USD only.** Listings in other currencies were set aside instead of converted, so exchange-rate choices do not distort the figures. 0 listings with non-USD pay were excluded on this basis.
3. **Midpoint.** Where a range was given, the midpoint was used. Where only one bound was given, that figure was used.
4. **Pay basis.** Figures under $500 were treated as hourly rates and figures of $15,000 or more as annual salaries. 0 listings fell between those bounds, where monthly salaries and project fees overlap, and were excluded rather than guessed at.
5. **Hourly equivalents.** Annual figures are converted at 2,080 hours per year (40 hours across 52 weeks), the same convention US payroll uses.

## How many listings disclose pay at all

Of 6,673 listings, 6,673 stated a pay figure: 100.0%. The rest said nothing, or used phrases such as "competitive." That disclosure rate is itself a finding for anyone negotiating, because a rate you cannot see is a rate the other side sets.

## Salaried remote roles

Across 6,673 salaried listings with disclosed USD pay:

| Group | Listings | 25th pct | Median | 75th pct |
| --- | --- | --- | --- | --- |
| All salaried roles | 6673 | $100,000 | $120,000 | $145,000 |
| Full-time | 6665 | $100,000 | $120,000 | $145,000 |
| Contract, annualised | 3 | below threshold | | |

The median salary of $120,000 works out to about $57.69 an hour on a 2,080-hour year. The gap between the 25th and 75th percentiles, $100,000 to $145,000, is the range most of the market sits in.

## Hourly and contract roles


Only 0 listings disclosed an hourly USD rate, below the 15-listing threshold used throughout this analysis, so no hourly median is reported. Hourly contract roles disclose pay far less often than salaried ones.

## Pay by skill

Skills are taken from the tags on each listing, so a role tagged with both React and TypeScript counts toward both.

| Skill tag | Listings | 25th pct | Median | 75th pct | Median hourly equiv. |
| --- | --- | --- | --- | --- | --- |
| React | 19 | $120,000 | $145,000 | $145,000 | $69.71 |
| TypeScript | 16 | $145,000 | $145,000 | $145,000 | $69.71 |
| JavaScript | 16 | $120,000 | $145,000 | $145,000 | $69.71 |
| Node.js | 16 | $120,000 | $145,000 | $145,000 | $69.71 |
| AWS / Cloud | 31 | $120,000 | $145,000 | $145,000 | $69.71 |
| Python | 34 | $120,000 | $120,000 | $145,000 | $57.69 |
| Data / ML | 110 | $120,000 | $120,000 | $145,000 | $57.69 |

Read these as the pay attached to roles that mention a skill, not the value of the skill itself. A listing tagged Rust is often a systems or infrastructure role, and part of what it pays for is the seniority those roles tend to require.

## Pay by hiring region

"Remote" rarely means the whole world. Many listings restrict hiring to a region for tax, time-zone or employment-law reasons. Grouping salaried listings by the region they state:

| Hiring region stated in listing | Listings | 25th pct | Median | 75th pct |
| --- | --- | --- | --- | --- |
| Worldwide / anywhere | 585 | $120,000 | $145,000 | $162,500 |
| Asia-Pacific | 24 | $120,000 | $145,000 | $145,000 |
| North America | 17 | $120,000 | $127,500 | $145,000 |
| Europe / EMEA | 1209 | $100,000 | $120,000 | $145,000 |
| Other / unspecified | 4838 | $92,500 | $120,000 | $145,000 |

A remote role restricted to North America and one open worldwide are different markets, even when the job titles match. If you are outside a listing's stated region, the relevant comparison is the worldwide group.

## Hourly versus fixed-price: converting between them

Listings state hourly rates or salaries. Clients often want a fixed price. Turning one into the other is where freelancers most often underprice.

A contractor's hourly rate has to cover things a salary includes and a contract does not: paid leave, public holidays, sick days, employer pension or social-security contributions, equipment, software, and the hours spent finding the next client. The usual way to account for this is a billable-utilisation figure: the share of working hours you can actually invoice. Many independent engineers bill between 50% and 75% of their working time once sales, admin and gaps between projects are counted. Your own figure is the one that matters.

```text
contractor hourly rate = target annual income / (2080 x billable utilisation)

fixed price = estimated hours x hourly rate x (1 + risk buffer)
```

As a worked example, take the salaried median's hourly equivalent plus a 40% contractor premium, $80.77. A project estimated at 120 hours, with a 25% risk buffer for unclear requirements, comes to 120 x $80.77 x 1.25 = $12,115.

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
- **Disclosure bias.** Only 100.0% of listings disclosed pay. Employers who publish ranges may differ systematically from those who do not, and some jurisdictions now require pay ranges in job ads, which skews disclosed listings toward those locations.
- **Source mix.** The data combines roles posted directly by clients on Clivora with roles indexed from public job boards, and it reflects which boards were indexed.
- **USD only.** Roles priced in EUR, GBP and other currencies are excluded, which under-represents markets that advertise in local currency.
- **Pay-basis rules.** The $500 and $15,000 cut-offs for classifying hourly and annual figures are a judgement. They exclude a band of listings rather than guess at them.

## How to use this

For a salaried remote role, compare an offer against the percentile band for your region and skill, and treat the median as the middle of the market, not the ceiling. For contract work, start from the salary you would accept, divide by a realistic billable-hours figure, and do not quote below the result. For fixed-price work, estimate in hours first, price in money second, and add a buffer sized to how much you do not yet know.

This benchmark is regenerated from current listings when it is updated. The date at the top shows when the figures were last computed.
