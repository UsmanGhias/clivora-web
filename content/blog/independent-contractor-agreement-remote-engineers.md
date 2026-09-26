---
title: Independent Contractor Agreements for Remote Engineers: Intellectual Property, Non-Disclosure, and Milestone Clauses
description: A clause-by-clause guide to the contractor agreement a remote software engineer should sign, covering IP assignment timing, pre-existing code, confidentiality, milestone acceptance, payment terms and termination, with sample wording.
date: 2026-09-26
keywords: independent contractor agreement, software developer contract, IP assignment clause, freelance NDA, milestone payment clause, contractor agreement template
---

Most disputes between a remote engineer and a client trace back to a contract that was either missing or copied from a template written for a different kind of work. A marketing retainer template says nothing useful about who owns a Git repository. An employment offer letter assumes the company owns everything by default, which is not how the law treats contractors.

This guide walks through the clauses that matter for software work, in the order you should read them, with sample wording you can adapt. It is written from the contractor's side of the table, but most of it protects the client too, because clear terms are what get invoices paid on time.

## Why the default position surprises clients

Many clients assume that paying for code means owning it. For independent contractors, that is usually wrong unless the contract says otherwise.

In the United States, copyright in a work belongs to its author unless it is a "work made for hire." Work by an employee within the scope of employment qualifies automatically. Work by an independent contractor only qualifies if it falls into one of nine statutory categories listed in 17 U.S.C. § 101 and both parties sign a written agreement saying so. General-purpose software is not one of those categories. The practical result is that a contractor who writes code without a written assignment keeps the copyright, and the client holds at most an implied licence to use it.

The United Kingdom reaches a similar place by a different route. Under section 11 of the Copyright, Designs and Patents Act 1988, the author is the first owner of copyright, and the employer exception applies to employees, not contractors. Most other jurisdictions follow the same principle.

This cuts both ways. A client who later raises investment or sells the company will face due diligence questions about who owns the codebase, and a missing assignment becomes their problem. A contractor who has not been paid holds real leverage if the assignment only takes effect on payment. Both are reasons to write it down properly.

## The clauses, in the order that matters

### 1. Relationship and scope

State plainly that you are an independent contractor, you control how and when the work is done, you supply your own equipment, and nothing in the agreement creates employment. Misclassification rules differ by country (the UK's IR35 rules and the US common-law control test are the two most commonly encountered), so the clause does not settle the question on its own. It does record the intent of both parties.

Scope should describe deliverables, not activity. "Build a REST API with endpoints for orders, customers and invoices, documented in OpenAPI 3.1, deployed to the client's AWS account" can be accepted or rejected. "Provide backend development services" cannot.

```text
Contractor will deliver the items listed in Schedule A (the "Deliverables").
Work not listed in Schedule A is outside the scope of this Agreement and
will be quoted separately as a written change request.
```

The change request line is the most valuable sentence in the whole agreement for fixed-price work. Without it, every "small addition" becomes an argument.

### 2. Milestones and acceptance

Break the project into milestones that each produce something testable. For each one, define the deliverable, the acceptance criteria and the payment attached to it. Then define what acceptance means in time.

```text
Client will review each Deliverable within five (5) business days of
delivery and either accept it or provide a written list of specific
defects measured against the acceptance criteria in Schedule A.
If Client does not respond within that period, the Deliverable is
deemed accepted.
```

Deemed acceptance is what stops a milestone from sitting in review for a month. The defect list requirement stops a rejection from being a vague "not quite what we wanted," which is really a scope change.

### 3. Payment terms

Payment clauses fail on details. Cover all of them:

| Term | What to specify | Common choice |
| --- | --- | --- |
| Currency | The invoicing currency and who carries exchange risk | Invoice in USD, EUR or GBP; client pays in that currency |
| Due date | Days from invoice date | Net 14 for contractors, Net 30 for larger clients |
| Deposit | Upfront amount before work starts | 25% to 50% of the first milestone |
| Late payment | Interest or fee on overdue amounts | A monthly percentage, capped by local law |
| Transfer fees | Who pays bank and intermediary charges | Client pays sending fees (SWIFT code OUR) |
| Stop-work right | What happens when an invoice is overdue | Contractor may pause work after 10 days overdue |

The transfer fee line matters more than it looks. On an international wire sent with the SHA charge option, intermediary banks can deduct their fees in transit, so a $5,000 invoice arrives as $4,960 and the client considers it paid in full. Specifying OUR, meaning the sender covers all charges, puts that cost where it belongs.

### 4. Intellectual property assignment, tied to payment

This is the clause to spend the most time on. The assignment should be broad and explicit, and it should take effect on payment rather than on creation.

```text
Upon receipt of full payment for a Deliverable, Contractor assigns to
Client all right, title and interest, including all copyright, in that
Deliverable. Until full payment is received, Client has a non-exclusive,
revocable licence to use the Deliverable for evaluation only.
```

Assignment on payment is fair to both sides. The client gets full ownership of everything it has paid for. The contractor keeps ownership, and the ability to revoke use, of work that has not been paid for. Clients who push back on this are usually asking to own work before paying for it, which is worth noticing.

### 5. Pre-existing IP and the licence-back

Experienced engineers reuse their own code: authentication modules, deployment scripts, internal libraries built up over years. An unqualified assignment of "all work produced" can accidentally transfer those to the first client who receives them.

```text
Contractor retains ownership of all tools, libraries and code created
before or independently of this Agreement ("Background IP"). To the
extent Background IP is incorporated into a Deliverable, Contractor
grants Client a perpetual, worldwide, royalty-free, non-exclusive licence
to use, modify and distribute it as part of that Deliverable.
```

The client gets everything it needs to run and maintain the product. You keep the right to use your own toolkit on the next project.

### 6. Open-source components

State that deliverables may include open-source software under its own licence, that you will list those components on request, and that you will not include anything under a licence the client has excluded in writing. Many companies prohibit strong copyleft licences such as the GPL or AGPL in proprietary products because of their distribution conditions. Asking the question at the start costs one email; discovering an AGPL dependency during an acquisition audit costs far more.

### 7. Confidentiality

Keep it mutual. You will see the client's code, credentials and business plans; the client will see your rates, methods and sometimes your other clients' names.

A workable confidentiality clause defines confidential information, lists the standard exclusions (already public, already known, independently developed, received from a third party without restriction), permits disclosure when legally compelled with notice where allowed, and sets a duration. Two to five years after the engagement ends is common for general business information, with trade secrets protected for as long as they remain secret.

Add one practical line about credentials: that you will store them in a password manager, not share them, and return or destroy them at the end of the engagement. Clients notice when a contractor raises this unprompted.

### 8. Non-solicitation versus non-compete

A non-solicitation clause, where neither party poaches the other's staff for a period, is reasonable and widely accepted. A non-compete clause that stops you working for anyone in the client's industry is a different matter.

Enforceability varies sharply. California voids most non-compete agreements under Business and Professions Code section 16600. In 2024 the US Federal Trade Commission adopted a rule that would have banned most non-competes nationwide, but a federal court set it aside before it took effect, so the position remains a matter of state law. For an independent contractor whose business depends on serving multiple clients, a broad non-compete is often commercially unacceptable regardless of whether it would hold up. Narrow it to named direct competitors and a short period, or decline it.

### 9. Warranties and limitation of liability

Offer a defined warranty: for example, you will fix defects that cause a deliverable to fail its acceptance criteria if reported within 30 days of acceptance, at no charge. That is concrete and bounded.

Then cap your liability. The usual cap is the total fees paid under the agreement, with an exclusion for indirect and consequential losses such as lost profits. Without a cap, a bug in a checkout flow could expose you to a claim larger than every invoice you have ever sent. Clients with procurement teams will often accept a cap at fees paid in the preceding twelve months.

### 10. Termination

Either party should be able to end the agreement on written notice, commonly 14 or 30 days. The important part is what happens next:

```text
On termination for any reason, Client will pay for all work performed up
to the termination date, including any milestone in progress on a
pro-rata basis, and Contractor will deliver all work in progress upon
receipt of that payment.
```

This protects the contractor from a client who terminates the day before a large milestone is due. It protects the client by guaranteeing handover of whatever it has paid for.

### 11. Governing law and disputes

Pick a governing law and a forum. For cross-border work, clients often insist on their own jurisdiction, which is reasonable. What matters is that one is named. For modest contract values, consider requiring written negotiation for 30 days followed by mediation before litigation, because court proceedings across borders are rarely proportionate to a disputed invoice.

## A pre-signature checklist

Before you sign, confirm each of these in the document itself:

- The deliverables are specific enough that a third party could say whether they were delivered.
- Each milestone has acceptance criteria, a review window and deemed acceptance.
- Payment terms name the currency, due date, deposit and who pays transfer fees.
- IP assignment takes effect on payment, and your background IP is carved out with a licence-back.
- The confidentiality clause is mutual and has a defined duration.
- There is no broad non-compete, or it has been narrowed to something you can live with.
- Liability is capped and consequential losses are excluded.
- Termination requires payment for work done, including a pro-rata share of the current milestone.

## Where contracts meet the rest of the workflow

A signed agreement only helps if the day-to-day records match it. Milestone acceptance needs a dated record of what was delivered and when the review window started. A late-payment clause needs an invoice with a clear due date. A dispute over scope is settled by the change requests you logged at the time, not by memory.

That is the reason Clivora keeps proposals, milestones, invoices and client messages against the same project record. When a client asks why an invoice is due, the answer is the accepted milestone, the date it was accepted, and the clause that attached payment to it, all in one place.
