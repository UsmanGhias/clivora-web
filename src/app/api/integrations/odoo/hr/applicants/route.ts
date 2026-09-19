import { NextResponse } from "next/server";
import { createOdooApplicant, listOdooJobPositions } from "@/lib/odoo-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/integrations/odoo/hr/applicants
 * Dispatches candidate application directly to Odoo Recruitment (hr.applicant)
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      partnerName?: string;
      email?: string;
      phone?: string;
      jobId?: number;
      jobTitle?: string;
      applicantNotes?: string;
      salaryExpected?: number;
      linkedinProfile?: string;
    };

    if (!body.partnerName || !body.email) {
      return NextResponse.json(
        { error: "partnerName and email are required" },
        { status: 400 },
      );
    }

    const result = await createOdooApplicant({
      partnerName: body.partnerName,
      email: body.email,
      phone: body.phone,
      jobId: body.jobId,
      jobTitle: body.jobTitle,
      applicantNotes: body.applicantNotes,
      salaryExpected: body.salaryExpected,
      linkedinProfile: body.linkedinProfile,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create applicant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/integrations/odoo/hr/applicants
 * Lists active job positions and candidate recruitment counts
 */
export async function GET() {
  try {
    const jobs = await listOdooJobPositions();
    return NextResponse.json({ jobs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list job positions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
