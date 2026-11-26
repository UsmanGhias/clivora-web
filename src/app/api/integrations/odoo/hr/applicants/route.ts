import { NextResponse } from "next/server";
import { createOdooApplicant, listOdooJobPositions } from "@/lib/odoo-sync";
import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import { consumeIpRateLimit, getClientIp } from "@/lib/security-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/integrations/odoo/hr/applicants
 * Dispatches candidate application directly to Odoo Recruitment (hr.applicant)
 */
export async function POST(request: Request) {
  try {
    const rate = consumeIpRateLimit("odoo_hr_applicant", getClientIp(request), 8, 10 * 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many applications submitted. Please wait before trying again." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
    }
    const body = (await request.json().catch(() => ({}))) as {
      partnerName?: string;
      email?: string;
      phone?: string;
      jobId?: number;
      jobTitle?: string;
      applicantNotes?: string;
      salaryExpected?: number;
      linkedinProfile?: string;
      website_url_hp?: string;
      bot_trap?: string;
    };

    // Honeypot check: reject bot submissions
    if (body.website_url_hp || body.bot_trap) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    const partnerName = String(body.partnerName || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
    const phone = body.phone ? String(body.phone).trim().slice(0, 40) : undefined;
    const jobTitle = body.jobTitle ? String(body.jobTitle).trim().slice(0, 150) : undefined;
    const applicantNotes = body.applicantNotes
      ? String(body.applicantNotes).trim().slice(0, 2000)
      : undefined;
    const linkedinProfile = body.linkedinProfile
      ? String(body.linkedinProfile).trim().slice(0, 255)
      : undefined;

    if (!partnerName || !email) {
      return NextResponse.json(
        { error: "partnerName and email are required" },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email address required" },
        { status: 400 },
      );
    }

    const result = await createOdooApplicant({
      partnerName,
      email,
      phone,
      jobId: typeof body.jobId === "number" ? body.jobId : undefined,
      jobTitle,
      applicantNotes,
      salaryExpected: typeof body.salaryExpected === "number" ? body.salaryExpected : undefined,
      linkedinProfile,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create applicant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/integrations/odoo/hr/applicants
 * Lists active job positions and candidate recruitment counts.
 * Requires admin authentication.
 */
export async function GET() {
  try {
    await requireAdmin({ requireAal2: false });
    const jobs = await listOdooJobPositions();
    return adminJson({ jobs });
  } catch (error) {
    return adminErrorResponse(error, "Failed to list job positions");
  }
}
