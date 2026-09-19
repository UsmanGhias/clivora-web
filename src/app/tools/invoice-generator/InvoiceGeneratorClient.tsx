"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Printer,
  Plus,
  Trash2,
  Receipt,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Download,
} from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export function InvoiceGeneratorClient() {
  const [currency, setCurrency] = useState<string>("USD");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );

  const [fromName, setFromName] = useState<string>("Alex Morgan");
  const [fromEmail, setFromEmail] = useState<string>("alex@morganengineering.com");
  const [fromAddress, setFromAddress] = useState<string>("Austin, TX, USA");

  const [clientName, setClientName] = useState<string>("Acme Technologies Inc.");
  const [clientEmail, setClientEmail] = useState<string>("billing@acmetechnologies.com");
  const [clientAddress, setClientAddress] = useState<string>("San Francisco, CA, USA");

  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "Full-Stack Web App Development (Sprint 1 Architecture & Auth)",
      quantity: 40,
      rate: 95,
    },
    {
      id: "2",
      description: "PostgreSQL Database Schema & Row-Level Security Optimization",
      quantity: 15,
      rate: 110,
    },
  ]);

  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [notes, setNotes] = useState<string>(
    "Payment is due within 14 days of invoice issue date. Wire transfer or ACH accepted. Thank you for your business!"
  );

  function addItem() {
    setItems([
      ...items,
      {
        id: Math.random().toString(),
        description: "",
        quantity: 1,
        rate: 0,
      },
    ]);
  }

  function removeItem(id: string) {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  }

  function updateItem(id: string, field: keyof LineItem, val: string | number) {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0
  );
  const taxAmount = (subtotal * (Number(taxPercent) || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  const router = useRouter();
  const [savedToWorkspace, setSavedToWorkspace] = useState(false);

  function saveToWorkspace() {
    if (typeof window === "undefined") return;
    const draft = {
      invoiceNumber,
      invoiceDate,
      dueDate,
      currency,
      fromName,
      fromEmail,
      fromAddress,
      clientName,
      clientEmail,
      clientAddress,
      items,
      taxPercent,
      notes,
      total: grandTotal,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("clivora_draft_invoice", JSON.stringify(draft));
      setSavedToWorkspace(true);
      setTimeout(() => {
        router.push("/app/invoices?import=draft");
      }, 500);
    } catch {
      // fallback
    }
  }

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  function resetForm() {
    setCurrency("USD");
    setInvoiceNumber("INV-2026-001");
    setFromName("");
    setFromEmail("");
    setFromAddress("");
    setClientName("");
    setClientEmail("");
    setClientAddress("");
    setItems([
      {
        id: "1",
        description: "Professional Consulting & Software Engineering Services",
        quantity: 1,
        rate: 1500,
      },
    ]);
    setTaxPercent(0);
  }

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "CA$",
    AUD: "AU$",
  };
  const sym = currencySymbols[currency] || "$";

  return (
    <div className="space-y-8">
      {/* Action Toolbar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 print:hidden shadow-xs">
        <div className="flex items-center gap-3">
          <label htmlFor="currency-select" className="text-xs font-semibold text-navy">Currency:</label>
          <select
            id="currency-select"
            aria-label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-navy focus:border-teal-600 focus:outline-none"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (CA$)</option>
            <option value="AUD">AUD (AU$)</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900 transition shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Print or Save PDF</span>
          </button>
          <button
            type="button"
            onClick={saveToWorkspace}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>{savedToWorkspace ? "Redirecting..." : "Save to Free Clivora Workspace"}</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-12 shadow-sm print:border-none print:p-0 print:shadow-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold tracking-tight text-navy">
                INVOICE
              </span>
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200">
                0% Fee Direct
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <input
                type="text"
                placeholder="Your Name / Studio Name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full text-base font-bold text-navy placeholder:text-slate-300 focus:outline-none"
              />
              <input
                type="text"
                placeholder="your.email@example.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full text-xs text-slate-600 placeholder:text-slate-300 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Your Street Address, City, Country"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className="w-full text-xs text-slate-500 placeholder:text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:text-right space-y-2">
            <div>
              <label htmlFor="invoice-number" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Invoice Number
              </label>
              <input
                id="invoice-number"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="font-mono text-sm font-bold text-navy sm:text-right focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="issue-date" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Issue Date
              </label>
              <input
                id="issue-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="text-xs text-slate-600 sm:text-right focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="due-date" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Due Date
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs text-slate-600 sm:text-right focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="my-8">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Bill To (Client)
          </span>
          <div className="mt-2 space-y-1">
            <input
              type="text"
              placeholder="Client Name or Company Inc."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full text-sm font-bold text-navy placeholder:text-slate-300 focus:outline-none"
            />
            <input
              type="text"
              placeholder="client.billing@example.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full text-xs text-slate-600 placeholder:text-slate-300 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Client Address, City, Country"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="w-full text-xs text-slate-500 placeholder:text-slate-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-navy">
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 w-20 text-center">Qty / Hrs</th>
                <th className="py-3 px-3 w-28 text-right">Rate ({sym})</th>
                <th className="py-3 px-3 w-28 text-right">Amount ({sym})</th>
                <th className="py-3 px-2 w-10 print:hidden text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const lineTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        placeholder="Service description..."
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className="w-full text-xs font-semibold text-navy placeholder:text-slate-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        className="w-full text-center text-xs font-semibold text-navy focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                        className="w-full text-right text-xs font-semibold text-navy focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-navy">
                      {sym}{lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-2 text-center print:hidden">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-red-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add Line Button (Hidden during print) */}
        <div className="mt-3 print:hidden">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-bold text-teal-800 hover:border-teal-500 hover:bg-teal-50 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Line Item</span>
          </button>
        </div>

        {/* Financial Summary */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-100 pt-6">
          <div className="w-full sm:w-1/2 space-y-2">
            <label htmlFor="invoice-notes" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Payment Instructions &amp; Notes
            </label>
            <textarea
              id="invoice-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-700 focus:border-teal-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-72 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-navy">
                {sym}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <label htmlFor="tax-percent" className="flex items-center gap-1">
                <span>Tax (%):</span>
                <input
                  id="tax-percent"
                  type="number"
                  min={0}
                  max={50}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                  className="w-12 rounded-md border border-slate-200 bg-slate-50 px-1 py-0.5 text-center text-xs font-bold text-navy focus:outline-none print:border-none print:bg-transparent"
                />
              </label>
              <span className="font-semibold text-navy">
                {sym}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3 text-sm">
              <span className="font-extrabold text-navy">Total Due:</span>
              <span className="font-display font-extrabold text-teal-800 text-base">
                {sym}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 border-t border-slate-100 pt-6 text-center text-[11px] text-slate-400">
          Generated via Clivora Freelancer OS · 0% Platform Commission · Keep 100% of your earnings
        </div>
      </div>

      {/* Cloud Workspace Banner */}
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8 print:hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800 border border-teal-200">
              Upgrade to Automated Invoicing
            </span>
            <h3 className="mt-2 font-display text-lg font-bold text-navy">
              Want automatic recurring invoices and client payment tracking?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Create a free Clivora account to sync invoices with client CRM records, track draft/sent/paid statuses,
              and sync timesheet hours straight to PDF invoices.
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-navy/90 transition shadow-sm"
          >
            Open Free Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
