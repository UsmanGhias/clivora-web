import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { sanitizePostgrestToken } from "@/lib/security-utils";
import { fetchOdooInvoicePdf } from "@/lib/services/odoo-lifecycle";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PRIVATE_PDF_HEADERS = {
  "Content-Type": "application/pdf",
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function safeDownloadFilename(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^_+|_+$/g, "");
  const base = cleaned || "invoice";
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
}

function extractOdooId(row: { custom_fields?: unknown } | null): number | null {
  if (!row?.custom_fields || typeof row.custom_fields !== "object") return null;
  const raw = Number((row.custom_fields as Record<string, unknown>).odoo_invoice_id);
  return Number.isInteger(raw) && raw > 0 ? raw : null;
}

async function resolveOwnerInvoiceOdooId(
  db: SupabaseClient,
  ownerUid: string,
  localInvoiceId: number | null,
  invoiceNumber: string | null,
): Promise<number | null> {
  if (localInvoiceId && Number.isInteger(localInvoiceId) && localInvoiceId > 0) {
    const { data } = await db
      .from("crm_invoices")
      .select("custom_fields")
      .eq("owner_uid", ownerUid)
      .eq("local_id", localInvoiceId)
      .limit(1)
      .maybeSingle();
    const found = extractOdooId(data);
    if (found) return found;
  }
  if (invoiceNumber) {
    const { data } = await db
      .from("crm_invoices")
      .select("custom_fields")
      .eq("owner_uid", ownerUid)
      .eq("invoice_number", invoiceNumber)
      .limit(1)
      .maybeSingle();
    const found = extractOdooId(data);
    if (found) return found;
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolved = await params;
    const rawIdentifier = (resolved.id || "").trim();
    const invoiceIdentifier = sanitizePostgrestToken(rawIdentifier, /^[a-z0-9._-]{1,120}$/i);
    if (!invoiceIdentifier) {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const publicToken = (searchParams.get("token") || searchParams.get("share") || "").trim();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let adminDb: SupabaseClient | null = null;
    try {
      const cfg = requireAdminServiceConfig();
      adminDb = createAdminClient(cfg.url, cfg.serviceRoleKey, {
        auth: { persistSession: false },
      });
    } catch {
      adminDb = null;
    }

    let isAuthorized = false;
    let isAdmin = false;
    let odooId: number | null = null;
    let downloadFilename = safeDownloadFilename(`clivora-invoice-${invoiceIdentifier}`);

    // 1. Authorize via public share token (requires admin/service client to avoid cross-tenant leakage)
    if (publicToken && adminDb) {
      const { data: share } = await adminDb
        .from("invoice_shares")
        .select("share_id, freelancer_uid, invoice_number, local_invoice_id, expires_at")
        .eq("public_token", publicToken)
        .maybeSingle();

      if (share) {
        const notExpired = !share.expires_at || new Date(share.expires_at).getTime() > Date.now();
        const matchesIdentifier =
          share.invoice_number === invoiceIdentifier ||
          String(share.local_invoice_id) === invoiceIdentifier ||
          share.share_id === invoiceIdentifier;

        if (notExpired && matchesIdentifier && share.freelancer_uid) {
          isAuthorized = true;
          downloadFilename = safeDownloadFilename(
            `clivora-tax-invoice-${share.invoice_number || share.local_invoice_id}`,
          );
          odooId = await resolveOwnerInvoiceOdooId(
            adminDb,
            String(share.freelancer_uid),
            typeof share.local_invoice_id === "number" ? share.local_invoice_id : null,
            typeof share.invoice_number === "string" ? share.invoice_number : null,
          );
        }
      }
    }

    // 2. Authorize via authenticated user session
    if (!isAuthorized && user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, account_type, is_blocked, is_restricted")
        .eq("id", user.id)
        .maybeSingle();

      isAdmin =
        Boolean(profile) &&
        (profile?.role === "admin" || profile?.account_type === "admin") &&
        profile?.is_blocked !== true &&
        profile?.is_restricted !== true;

      if (isAdmin) {
        isAuthorized = true;
      } else {
        // Check owner's own crm_invoices via isolated eq() queries (no raw .or() injection)
        let inv: {
          id: string;
          owner_uid: string;
          invoice_number?: string | null;
          custom_fields?: unknown;
        } | null = null;

        if (UUID_REGEX.test(invoiceIdentifier)) {
          const { data } = await supabase
            .from("crm_invoices")
            .select("id, owner_uid, invoice_number, custom_fields")
            .eq("owner_uid", user.id)
            .eq("id", invoiceIdentifier)
            .maybeSingle();
          inv = data;
        }

        if (!inv) {
          const { data } = await supabase
            .from("crm_invoices")
            .select("id, owner_uid, invoice_number, custom_fields")
            .eq("owner_uid", user.id)
            .eq("invoice_number", invoiceIdentifier)
            .maybeSingle();
          inv = data;
        }

        if (!inv && /^\d+$/.test(invoiceIdentifier)) {
          const { data } = await supabase
            .from("crm_invoices")
            .select("id, owner_uid, invoice_number, custom_fields")
            .eq("owner_uid", user.id)
            .eq("local_id", Number(invoiceIdentifier))
            .maybeSingle();
          inv = data;
        }

        if (inv && inv.owner_uid === user.id) {
          isAuthorized = true;
          downloadFilename = safeDownloadFilename(`clivora-${inv.invoice_number || inv.id}`);
          odooId = extractOdooId(inv);
        }

        // Check authorized client invoice_shares without unescaped .or() string filters
        if (!isAuthorized && adminDb) {
          const userEmail = (user.email || "").toLowerCase().trim();
          const { data: byUidShares } = await adminDb
            .from("invoice_shares")
            .select("share_id, freelancer_uid, local_invoice_id, invoice_number, client_uid, client_email")
            .eq("client_uid", user.id)
            .limit(50);
          const { data: byEmailShares } = userEmail
            ? await adminDb
                .from("invoice_shares")
                .select("share_id, freelancer_uid, local_invoice_id, invoice_number, client_uid, client_email")
                .eq("client_email", userEmail)
                .limit(50)
            : { data: [] };

          const allShares = [...(byUidShares ?? []), ...(byEmailShares ?? [])];
          const matchedShare = allShares.find(
            (s) =>
              s.invoice_number === invoiceIdentifier ||
              String(s.local_invoice_id) === invoiceIdentifier ||
              s.share_id === invoiceIdentifier,
          );

          if (matchedShare && matchedShare.freelancer_uid) {
            isAuthorized = true;
            downloadFilename = safeDownloadFilename(
              `clivora-invoice-${matchedShare.invoice_number || invoiceIdentifier}`,
            );
            odooId = await resolveOwnerInvoiceOdooId(
              adminDb,
              String(matchedShare.freelancer_uid),
              typeof matchedShare.local_invoice_id === "number"
                ? matchedShare.local_invoice_id
                : null,
              typeof matchedShare.invoice_number === "string"
                ? matchedShare.invoice_number
                : null,
            );
          }
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: You do not have permission to view this invoice PDF." },
        { status: user ? 403 : 401 },
      );
    }

    // 3. Only admins may fall back to direct Odoo move ID lookup
    if (!odooId && isAdmin && /^\d+$/.test(invoiceIdentifier)) {
      const numericId = Number(invoiceIdentifier);
      if (Number.isInteger(numericId) && numericId > 0) {
        odooId = numericId;
      }
    }

    if (!odooId || odooId <= 0) {
      return NextResponse.json(
        {
          error: "Invoice PDF not available or not yet generated in Odoo accounting engine.",
          invoiceId: invoiceIdentifier,
        },
        { status: 404 },
      );
    }

    const pdfBuffer = await fetchOdooInvoicePdf(odooId);
    if (!pdfBuffer) {
      return NextResponse.json(
        {
          error: "Failed to render invoice PDF from accounting engine.",
          invoiceId: invoiceIdentifier,
        },
        { status: 404 },
      );
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        ...PRIVATE_PDF_HEADERS,
        "Content-Disposition": `inline; filename="${downloadFilename}"`,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
