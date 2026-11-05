import { NextRequest, NextResponse } from "next/server";
import { fetchOdooInvoicePdf } from "@/lib/services/odoo-lifecycle";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolved = await params;
    const invoiceIdentifier = resolved.id;

    if (!invoiceIdentifier) {
      return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
    }

    // 1. If numerical ID provided, attempt direct Odoo PDF retrieval
    const numericId = Number(invoiceIdentifier);
    if (!Number.isNaN(numericId) && numericId > 0) {
      const pdfBuffer = await fetchOdooInvoicePdf(numericId);
      if (pdfBuffer) {
        return new NextResponse(new Uint8Array(pdfBuffer), {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="clivora-tax-invoice-${numericId}.pdf"`,
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      }
    }

    // 2. Query Supabase crm_invoices to check for an associated odoo_invoice_id
    try {
      const supabase = await createClient();
      const { data: inv } = await supabase
        .from("crm_invoices")
        .select("*")
        .or(`id.eq.${invoiceIdentifier},invoice_number.eq.${invoiceIdentifier}`)
        .single();

      if (inv && inv.custom_fields && typeof inv.custom_fields === "object") {
        const odooId = Number((inv.custom_fields as Record<string, any>).odoo_invoice_id);
        if (odooId > 0) {
          const pdfBuffer = await fetchOdooInvoicePdf(odooId);
          if (pdfBuffer) {
            return new NextResponse(new Uint8Array(pdfBuffer), {
              status: 200,
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="clivora-${inv.invoice_number || inv.id}.pdf"`,
                "Cache-Control": "public, max-age=3600, s-maxage=3600",
              },
            });
          }
        }
      }
    } catch {
      // Pass through to 404
    }

    return NextResponse.json(
      {
        error: "Invoice PDF not available or not yet generated in Odoo accounting engine.",
        invoiceId: invoiceIdentifier,
      },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
