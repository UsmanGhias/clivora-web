import "server-only";

import { callOdoo, checkOdooModelExists } from "@/lib/odoo";
import { createClient as createServerClient } from "@/lib/supabase/server";

export interface MilestoneItem {
  id?: string;
  title: string;
  amount: number;
  description?: string;
  dueDate?: string;
  productId?: number;
}

export interface ClientPartnerData {
  name: string;
  email: string;
  companyName?: string;
  countryCode?: string;
  vat?: string;
  phone?: string;
  street?: string;
  city?: string;
}

export interface ContractAgreementPayload {
  contractTitle: string;
  client: ClientPartnerData;
  freelancerUid: string;
  freelancerEmail: string;
  milestones: MilestoneItem[];
  currency?: string;
}

export interface OdooLifecycleResult {
  partnerId: number;
  saleOrderId?: number;
  invoiceId?: number;
  invoiceNumber?: string;
  status: "success" | "partial" | "error";
  message: string;
}

/**
 * Step 2: Contact Synchronization in Odoo (res.partner)
 * Finds or creates a partner in Odoo by email.
 */
export async function syncPartnerInOdoo(client: ClientPartnerData): Promise<number> {
  const email = client.email.trim().toLowerCase();

  // 1. Search existing partner by email
  const existing = await callOdoo<{ id: number; name: string }[]>(
    "res.partner",
    "search_read",
    [[["email", "=ilike", email]]],
    { fields: ["id", "name"], limit: 1 }
  );

  if (Array.isArray(existing) && existing.length > 0) {
    const partnerId = existing[0].id;

    // Optionally update missing VAT or phone
    const updateValues: Record<string, any> = {};
    if (client.vat) updateValues.vat = client.vat;
    if (client.phone) updateValues.phone = client.phone;

    if (Object.keys(updateValues).length > 0) {
      await callOdoo("res.partner", "write", [[partnerId], updateValues]);
    }

    return partnerId;
  }

  // 2. Resolve country_id if countryCode provided
  let countryId: number | false = false;
  if (client.countryCode) {
    const countries = await callOdoo<{ id: number }[]>(
      "res.country",
      "search_read",
      [[["code", "=ilike", client.countryCode.trim()]]],
      { fields: ["id"], limit: 1 }
    );
    if (countries && countries.length > 0) {
      countryId = countries[0].id;
    }
  }

  // 3. Create new partner
  const partnerValues: Record<string, any> = {
    name: client.companyName?.trim() || client.name.trim(),
    email: email,
    is_company: Boolean(client.companyName),
    type: "contact",
    customer_rank: 1,
    comment: "Created via Clivora Freelancer & Client Operating System (0% Commission)",
  };

  if (countryId) partnerValues.country_id = countryId;
  if (client.vat) partnerValues.vat = client.vat.trim();
  if (client.phone) partnerValues.phone = client.phone.trim();
  if (client.street) partnerValues.street = client.street.trim();
  if (client.city) partnerValues.city = client.city.trim();

  const newPartnerId = await callOdoo<number>("res.partner", "create", [partnerValues]);
  return newPartnerId;
}

/**
 * Step 3: Sales Order & Milestone Generation (sale.order & sale.order.line)
 * Creates a commercial Sales Order in Odoo representing the agreed milestone deliverables.
 */
export async function createSalesOrderWithMilestones(
  partnerId: number,
  contractTitle: string,
  milestones: MilestoneItem[],
  currencyCode: string = "USD"
): Promise<number | null> {
  const hasSaleOrder = await checkOdooModelExists("sale.order");
  if (!hasSaleOrder) {
    // Graceful fallback: log to chatter on partner if sale.order is not present
    await callOdoo("mail.message", "create", [
      {
        model: "res.partner",
        res_id: partnerId,
        message_type: "comment",
        body: `<p><strong>Clivora Contract Created:</strong> ${contractTitle}</p>
               <ul>${milestones.map((m) => `<li>${m.title}: ${currencyCode} ${m.amount}</li>`).join("")}</ul>`,
      },
    ]);
    return null;
  }

  // Fallback default service product (ID 31 = 'Web App Development')
  const defaultProductId = 31;

  const orderLines = milestones.map((m) => [
    0,
    0,
    {
      product_id: m.productId || defaultProductId,
      name: `[Milestone] ${m.title}${m.description ? ` - ${m.description}` : ""}`,
      product_uom_qty: 1,
      price_unit: m.amount,
    },
  ]);

  const orderId = await callOdoo<number>("sale.order", "create", [
    {
      partner_id: partnerId,
      note: `Clivora Zero-Commission Contract: ${contractTitle}`,
      order_line: orderLines,
    },
  ]);

  // Confirm the sales order to lock in the agreed contract state
  try {
    await callOdoo("sale.order", "action_confirm", [[orderId]]);
  } catch {
    // If confirmation requires additional fields in workflow, keep in draft/sent
  }

  return orderId;
}

/**
 * Step 4: Escrow Funding Registration
 * Records client payment funding into milestone escrow.
 */
export async function registerEscrowDeposit(
  partnerId: number,
  milestoneTitle: string,
  amount: number,
  currency: string = "USD",
  paymentReference?: string
): Promise<void> {
  // Post an auditable escrow hold record into Odoo chatter
  await callOdoo("mail.message", "create", [
    {
      model: "res.partner",
      res_id: partnerId,
      message_type: "notification",
      body: `<p>💳 <strong>Clivora Escrow Deposit Confirmed:</strong> ${currency} ${amount.toFixed(
        2
      )} held in escrow for milestone <em>"${milestoneTitle}"</em>.<br/>Ref: ${paymentReference || "Direct Stripe / Safepay settlement"}</p>`,
    },
  ]);
}

/**
 * Step 5: Deliverable Submission & Client Approval
 * Generates an official customer invoice (account.move) in Odoo, posts it via action_post(),
 * and calculates the zero-fee freelancer wallet payout.
 */
export async function releaseMilestoneInvoice(
  partnerId: number,
  saleOrderId: number | null,
  milestone: MilestoneItem,
  deliverableUrl: string,
  currency: string = "USD"
): Promise<{ invoiceId: number | null; invoiceNumber: string | null; payoutAmount: number }> {
  const hasAccountMove = await checkOdooModelExists("account.move");

  // Zero-commission calculation: 100% of milestone funds go to the freelancer
  const platformFee = 0.0;
  const payoutAmount = milestone.amount - platformFee;

  if (!hasAccountMove) {
    // Fallback if accounting module is absent
    await callOdoo("mail.message", "create", [
      {
        model: "res.partner",
        res_id: partnerId,
        message_type: "comment",
        body: `<p>✅ <strong>Milestone Approved & Released:</strong> ${milestone.title}</p>
               <p>Deliverable: <a href="${deliverableUrl}" target="_blank">${deliverableUrl}</a><br/>
               Amount Released: ${currency} ${milestone.amount.toFixed(2)} (Platform Fee: $0.00)</p>`,
      },
    ]);
    return { invoiceId: null, invoiceNumber: null, payoutAmount };
  }

  let invoiceId: number | null = null;
  let invoiceNumber: string | null = null;

  // Case A: Create invoice directly from confirmed Sale Order lines
  if (saleOrderId) {
    try {
      const invoiceIds = await callOdoo<number[]>(
        "sale.order",
        "_create_invoices",
        [[saleOrderId]],
        { final: true }
      );
      if (Array.isArray(invoiceIds) && invoiceIds.length > 0) {
        invoiceId = invoiceIds[0];
      }
    } catch {
      // If sale.order wizard is required, fall through to direct account.move creation
    }
  }

  // Case B: Create standalone Customer Invoice in account.move
  if (!invoiceId) {
    const invoiceLines = [
      [
        0,
        0,
        {
          name: `[Milestone Delivered] ${milestone.title} - Approval URL: ${deliverableUrl}`,
          quantity: 1,
          price_unit: milestone.amount,
        },
      ],
    ];

    invoiceId = await callOdoo<number>("account.move", "create", [
      {
        move_type: "out_invoice",
        partner_id: partnerId,
        narration: `Clivora Deliverable Release: ${deliverableUrl}\nPlatform take rate: 0% ($0 fee).`,
        invoice_line_ids: invoiceLines,
      },
    ]);
  }

  // Post the invoice to sequential official tax status (action_post)
  if (invoiceId) {
    try {
      await callOdoo("account.move", "action_post", [[invoiceId]]);
    } catch {
      // In draft if validation requires tax configuration
    }

    // Retrieve official sequential invoice number
    const readMove = await callOdoo<{ id: number; name: string }[]>(
      "account.move",
      "search_read",
      [[["id", "=", invoiceId]]],
      { fields: ["id", "name"], limit: 1 }
    );
    if (readMove && readMove.length > 0 && readMove[0].name !== "/") {
      invoiceNumber = readMove[0].name;
    }
  }

  return { invoiceId, invoiceNumber, payoutAmount };
}

/**
 * Step 6: Render and Stream Official Invoice PDF binary
 * Calls Odoo's QWeb report engine to retrieve the compiled PDF buffer.
 */
export async function fetchOdooInvoicePdf(invoiceId: number): Promise<Buffer | null> {
  try {
    // Odoo ir.actions.report._render_qweb_pdf returns [binaryBase64String, "pdf"]
    const result = await callOdoo<[string, string]>(
      "ir.actions.report",
      "_render_qweb_pdf",
      ["account.report_invoice_with_payments", [invoiceId]]
    );

    if (Array.isArray(result) && result[0]) {
      return Buffer.from(result[0], "base64");
    }
    return null;
  } catch (error) {
    console.error(`Failed to render Odoo invoice PDF for invoice ${invoiceId}:`, error);
    return null;
  }
}

/**
 * Orchestrates the full lifecycle agreement workflow from Next.js server actions.
 */
export async function executeContractLifecycleAgreement(
  payload: ContractAgreementPayload
): Promise<OdooLifecycleResult> {
  try {
    // 1. Sync or retrieve Odoo partner
    const partnerId = await syncPartnerInOdoo(payload.client);

    // 2. Generate sales order and milestone lines
    const saleOrderId = await createSalesOrderWithMilestones(
      partnerId,
      payload.contractTitle,
      payload.milestones,
      payload.currency || "USD"
    );

    // 3. Persist contract and milestones in Supabase
    try {
      const supabase = await createServerClient();
      await supabase.from("crm_projects").insert({
        title: payload.contractTitle,
        contact_email: payload.client.email,
        custom_fields: {
          odoo_partner_id: partnerId,
          odoo_sale_order_id: saleOrderId,
          freelancer_uid: payload.freelancerUid,
          freelancer_email: payload.freelancerEmail,
          currency: payload.currency || "USD",
          milestones: payload.milestones,
        },
      });
    } catch {
      // Supabase audit logging
    }

    return {
      partnerId,
      saleOrderId: saleOrderId || undefined,
      status: "success",
      message: `Contract established in Odoo. Partner ID: ${partnerId}${
        saleOrderId ? `, Sales Order: ${saleOrderId}` : ""
      }`,
    };
  } catch (err: any) {
    return {
      partnerId: 0,
      status: "error",
      message: err.message || "Failed to execute contract lifecycle",
    };
  }
}
