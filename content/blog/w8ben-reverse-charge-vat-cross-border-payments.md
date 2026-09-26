---
title: International Tax Compliance for Global Freelancers: Navigating W-8BEN, Reverse-Charge VAT, and Cross-Border Wire Transfers
description: A practical guide for freelancers billing clients in other countries, covering when and how to complete Form W-8BEN, how EU and UK reverse-charge VAT works on your invoices, and how to receive international wires without losing money in transit.
date: 2026-09-26
keywords: W-8BEN for freelancers, reverse charge VAT invoice, cross-border wire transfer fees, SWIFT OUR SHA BEN, freelancer tax compliance, export of services invoice
---

A freelance engineer in Lahore invoicing a client in Texas, a designer in Lisbon billing an agency in London, and a developer in Bangalore working for a startup in Berlin all hit the same three pieces of paperwork. A US client asks for a W-8BEN. A European client asks why the invoice does not show VAT, or why it does. And the payment arrives smaller than the invoice because a bank somewhere took a cut.

None of this is complicated once you know what each form and rule is for. This guide covers the three, with the specific fields and wording that cause most of the mistakes.

This is general information, not tax advice. Rules differ by country and change over time, and your own position depends on where you live, how your business is set up and who your clients are. Use this to understand what you are being asked for, then confirm the specifics for your situation with a local accountant.

## Part 1: Form W-8BEN

### What it is for

When a US business pays someone, it has to decide whether US tax must be withheld from that payment. For a payment to a foreign person, the default rules can require withholding. Form W-8BEN is how a non-US individual tells the US payer, in writing, that they are not a US person, so the payer can apply the correct treatment and keep a record of why.

The form is an IRS form, but you do not send it to the IRS. The IRS instructions are direct about this: give it to the person requesting it, which is generally whoever is paying you. The client keeps it in their records.

### Which form you need

- **W-8BEN**: you are an individual who is not a US citizen or US resident for tax purposes. This covers most solo freelancers outside the US.
- **W-8BEN-E**: you invoice through a company, such as a private limited company or an LLC formed outside the US. The "E" is for entity. A common mistake is a sole trader completing the W-8BEN-E because they think of themselves as a business; if there is no separate legal entity, use the W-8BEN.
- **W-9**: you are a US person. If a client sends you a W-9 and you are not a US person, reply with a W-8BEN instead.

### Why services performed abroad usually mean no withholding

For personal services, US tax law generally treats income as coming from the place where the work is performed. If you are a nonresident working from outside the United States, your fees for that work are generally foreign-source income, which is not subject to US withholding. The W-8BEN is what lets the client document that position.

This is also why you normally do not need to claim treaty benefits in Part II of the form for ordinary service fees performed abroad. Part II matters more for payments such as royalties, where a tax treaty between the US and your country can reduce a withholding rate. If you are unsure whether your income falls into a category where a treaty applies, that is a question for an adviser.

### Filling it in without mistakes

The fields that cause the most trouble:

| Field | What goes there | Common error |
| --- | --- | --- |
| Line 1, name | Your legal name as on your passport or tax records | Using a trading or brand name |
| Line 3, permanent residence | Your home address in your country of tax residence | Using a PO box, or the client's address |
| Line 5, US TIN | Leave blank if you have none | Entering a local tax number here |
| Line 6a, foreign TIN | Your tax identification number from your country of residence | Leaving it blank when you have one |
| Line 8, date of birth | Your date of birth in MM-DD-YYYY format | Writing it in DD-MM-YYYY |
| Part II | Usually left blank for services performed abroad | Claiming a treaty article that does not apply |

### It expires

A W-8BEN remains in effect from the date you sign it until the last day of the third calendar year after that. A form signed on 30 September 2026 is valid until 31 December 2029. A change in circumstances, such as moving to another country, makes it invalid sooner, and you must provide a new one.

Put the expiry date in your calendar. Many US clients have automated payment systems that stop paying a vendor whose form has lapsed, and you may not find out until an invoice goes unpaid.

## Part 2: Reverse-charge VAT in the EU and UK

### The problem reverse charge solves

VAT is charged in the country where a supply is considered to take place. For business-to-business services, the EU's general rule is that the supply takes place where the customer is established. So when you provide services to a business in Germany, German VAT applies, even if you are in Portugal or Pakistan.

Registering for VAT in every country where you have a client would be unworkable. The reverse-charge mechanism solves this by moving the obligation to account for VAT from the supplier to the business customer. You invoice without charging VAT. Your customer calculates the VAT themselves on their own VAT return, and in most cases deducts it in the same return, so for a fully taxable business the net cost is zero.

### What your invoice must show

Under the EU VAT Directive, when the customer is liable for the VAT, the invoice must carry the mention "Reverse charge" and must show the customer's VAT identification number. In practice, a compliant B2B invoice to an EU business customer includes:

```text
Supplier:            Your legal name, address, and your VAT number if registered
Customer:            Legal name, address, and customer VAT number (e.g. DE123456789)
Invoice number:      Sequential and unique
Invoice date:        Date of issue
Description:         Services supplied and the period or milestone
Net amount:          EUR 4,800.00
VAT:                 EUR 0.00
Note:                Reverse charge
```

Before issuing the first invoice to a new EU client, check their VAT number on the European Commission's VIES validation service and keep a record of the result. A valid VAT number is your evidence that you are supplying a business, which is what makes the reverse charge apply.

### Suppliers outside the EU

If you are based outside the EU, for example in Pakistan, India or the United States, and you provide services to an EU business, the same logic applies from the customer's side. You do not charge EU VAT, and the business customer accounts for it under reverse charge in their own country. Marking the invoice "Reverse charge" and showing the customer's VAT number still helps your client process it correctly.

### The United Kingdom

Since Brexit, the UK runs its own VAT system, but the treatment of business services from overseas works the same way: a UK business receiving services from a supplier outside the UK accounts for VAT under the reverse charge. As an overseas supplier, you do not add UK VAT to invoices for UK business customers.

If you are a freelancer based in the UK, two figures matter. The VAT registration threshold for UK businesses has been £90,000 of taxable turnover since April 2024; below that, registration is voluntary. Separately, if you are self-employed you report your profits through Self Assessment, with the online return due by 31 January following the end of the tax year.

### Selling to consumers is different

Everything above applies to business customers. Selling services to private individuals follows different rules, and for some digital services the supplier may need to charge VAT at the customer's local rate and register through a scheme such as the EU's One Stop Shop. If you sell templates, courses or software licences directly to the public, get specific advice, because the reverse charge does not cover you.

## Part 3: Receiving international wires without losing money

### Where the money goes

An international wire can pass through one or more intermediary banks between the sender's bank and yours. Each can deduct a fee. Your bank may charge a receiving fee. And unless you receive in the invoiced currency, someone converts it at a rate that includes a margin over the mid-market rate.

The result is the most common complaint in cross-border freelancing: a $5,000 invoice arrives as something less, and the client considers it paid in full.

### SWIFT charge codes

Every SWIFT transfer carries a charge instruction:

| Code | Who pays | Effect on your receipt |
| --- | --- | --- |
| OUR | Sender pays all charges | You should receive the full invoiced amount |
| SHA | Charges are shared | Sender pays their bank; intermediary and receiving fees come out of the transfer |
| BEN | Recipient pays all charges | All fees are deducted from the amount you receive |

Put "Please send with SWIFT charge code OUR; all transfer charges are the sender's responsibility" on every international invoice, and put the same obligation in your contract. It will not stop every deduction, but it gives you grounds to invoice the shortfall.

### Details your invoice needs

Payment instructions on an international invoice should include your account name exactly as your bank holds it, your IBAN (or account number and routing details for countries without IBAN), your bank's SWIFT or BIC code, and your bank's name and address. A mismatch between the account name on the invoice and the name on your bank account is one of the most common causes of wires being returned.

### Purpose codes and export documentation

In several countries, the reason attached to an incoming international payment affects how it is treated. In Pakistan and India, for example, banks classify inward remittances using purpose codes, and receiving payment for IT or professional services through the formal banking channel with the correct purpose is what allows the income to be recognised as a services export. That recognition can affect your tax treatment and eligibility for export-related schemes.

In India, exports of services are zero-rated under GST, which exporters commonly use by supplying under a Letter of Undertaking without paying IGST, and banks issue a Foreign Inward Remittance Certificate or Advice as evidence of the export receipt. In Pakistan, IT and IT-enabled service exporters commonly register with the Pakistan Software Export Board, and the treatment of export proceeds depends on their arriving through banking channels. The specific rates and registration requirements change with each budget, so check the current position with an accountant and your bank before your first large payment.

If your bank asks you to confirm the purpose of an incoming payment, answer promptly and accurately. An unconfirmed purpose code can delay the credit or put it into a less favourable category.

### Currency choice

If you can hold a balance in USD, EUR or GBP, invoice in the client's currency and receive it without conversion, then convert when the rate suits you. If you must convert on receipt, compare the rate your bank applies against the mid-market rate for the same day. The difference is a fee, even if nobody calls it one.

## Records to keep

For each client, keep a copy of the tax form you provided and its expiry date, the VIES check result for EU customers, every invoice with its sequential number, and the bank record of each payment received, including any deductions. Most tax authorities expect records to be kept for several years; five to seven years is a common requirement.

Clivora keeps invoices, client tax details and payment status against the same client record, so the invoice number, the VAT number you checked and the amount that actually arrived sit together rather than across a spreadsheet, an email folder and a banking app. When an accountant asks for a year of export receipts, that is a single filtered view.
