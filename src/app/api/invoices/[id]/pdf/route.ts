import { NextRequest, NextResponse } from "next/server";
import { fetchOdooInvoicePdf } from "@/lib/services/odoo-lifecycle";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

const PRIVATE_PDF_HEADERS = {
  "Content-Type": "application/pdf",
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolved = await params;
    const invoiceIdentifier = (resolved.id || "").trim();

    if (!invoiceIdentifier) {
      return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const publicToken = (searchParams.get("token") || searchParams.get("share") || "").trim();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const serviceKey = getServiceRoleKey();
    const adminDb = serviceKey ? createAdminClient(SUPABASE_URL, serviceKey) : supabase;

    let isAuthorized = false;
    let odooId: number | null = null;
    let downloadFilename = `clivora-invoice-${invoiceIdentifier}.pdf`;

    // 1. Authorize via public share token if provided
    if (publicToken) {
      const { data: share } = await adminDb
        .from("invoice_shares")
        .select("id, invoice_number, local_invoice_id, expires_at")
        .eq("public_token", publicToken)
        .maybeSingle();

      if (share) {
        const notExpired = !share.expires_at || new Date(share.expires_at).getTime() > Date.now();
        const matchesIdentifier =
          share.invoice_number === invoiceIdentifier ||
          String(share.local_invoice_id) === invoiceIdentifier;

        if (notExpired && matchesIdentifier) {
          isAuthorized = true;
          downloadFilename = `clivora-tax-invoice-${share.invoice_number || share.local_invoice_id}.pdf`;
          if (share.local_invoice_id && !Number.isNaN(Number(share.local_invoice_id))) {
            odooId = Number(share.local_invoice_id);
          }
        }
      }
    }

    // 2. Authorize via authenticated user session
    if (!isAuthorized && user) {
      // Check if user is an admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, account_type")
        .eq("id", user.id)
        .maybeSingle();

      const isAdmin =
        profile?.role === "admin" || profile?.account_type === "admin";

      if (isAdmin) {
        isAuthorized = true;
      } else {
        // Query crm_invoices owned by caller
        const numericId = Number(invoiceIdentifier);
        const isNumeric = !Number.isNaN(numericId) && numericId > 0;

        let query = supabase.from("crm_invoices").select("*");
        if (isNumeric) {
          query = query.or(
            `id.eq.${invoiceIdentifier},invoice_number.eq.${invoiceIdentifier},custom_fields->>odoo_invoice_id.eq.${numericId}`
          );
        } else {
          query = query.or(`id.eq.${invoiceIdentifier},invoice_number.eq.${invoiceIdentifier}`);
        }

        const { data: inv } = await query.maybeSingle();
        if (inv && inv.owner_uid === user.id) {
          isAuthorized = true;
          downloadFilename = `clivora-${inv.invoice_number || inv.id}.pdf`;
          if (inv.custom_fields && typeof inv.custom_fields === "object") {
            const rawOdoo = Number((inv.custom_fields as Record<string, any>).odoo_invoice_id);
            if (rawOdoo > 0) odooId = rawOdoo;
          }
        }

        // Also check if user is the authorized client in invoice_shares
        if (!isAuthorized) {
          const userEmail = (user.email || "").toLowerCase().trim();
          const { data: sharedToUser } = await adminDb
            .from("invoice_shares")
            .select("local_invoice_id, invoice_number")
            .or(`client_uid.eq.${user.id},client_email.ilike.${userEmail}`)
            .or(`invoice_number.eq.${invoiceIdentifier},local_invoice_id.eq.${invoiceIdentifier}`)
            .maybeSingle();

          if (sharedToUser) {
            isAuthorized = true;
            downloadFilename = `clivora-invoice-${sharedToUser.invoice_number || invoiceIdentifier}.pdf`;
            if (sharedToUser.local_invoice_id) {
              odooId = Number(sharedToUser.local_invoice_id);
            }
          }
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: You do not have permission to view this invoice PDF." },
        { status: user ? 403 : 401 }
      );
    }

    // 3. Resolve Odoo ID if not already resolved and caller is admin with direct numeric ID
    if (!odooId) {
      const numericId = Number(invoiceIdentifier);
      if (!Number.isNaN(numericId) && numericId > 0) {
        odooId = numericId;
      }
    }

    if (!odooId || odooId <= 0) {
      return NextResponse.json(
        {
          error: "Invoice PDF not available or not yet generated in Odoo accounting engine.",
          invoiceId: invoiceIdentifier,
        },
        { status: 404 }
      );
    }

    const pdfBuffer = await fetchOdooInvoicePdf(odooId);
    if (!pdfBuffer) {
      return NextResponse.json(
        {
          error: "Failed to render invoice PDF from accounting engine.",
          invoiceId: invoiceIdentifier,
        },
        { status: 404 }
      );
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        ...PRIVATE_PDF_HEADERS,
        "Content-Disposition": `inline; filename="${downloadFilename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
