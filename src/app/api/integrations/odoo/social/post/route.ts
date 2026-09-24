import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import { publishToOdooSocial, publishJobToSocial } from "@/lib/odoo-sync";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/integrations/odoo/social/post
 * Dispatches a social media post across all channels connected in clivoraos.odoo.com
 */
export async function POST(request: Request) {
  try {
    await requireAdmin({ requireAal2: false });
    const body = (await request.json().catch(() => ({}))) as {
      message?: string;
      twitterMessage?: string;
      imageBase64?: string;
      imageName?: string;
      jobId?: string;
      accountIds?: number[];
      firstComment?: string;
      facebookFirstComment?: string;
      linkedinFirstComment?: string;
      autoPublish?: boolean;
    };

    if (body.jobId) {
      const supabase = await createClient();
      const { data: job, error: jobErr } = await supabase
        .from("connect_jobs")
        .select("title, company_name, category, salary_min, salary_max, currency, location, seo_slug")
        .eq("id", body.jobId)
        .maybeSingle();

      if (jobErr || !job) {
        return adminErrorResponse(new Error(jobErr?.message || "Job listing not found"), "Job not found");
      }

      const result = await publishJobToSocial({
        title: job.title,
        company_name: job.company_name,
        category: job.category,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        currency: job.currency,
        location: job.location,
        seo_slug: job.seo_slug,
        accountIds: body.accountIds,
        imageBase64: body.imageBase64,
        imageName: body.imageName,
      });

      if (!result.ok) {
        return adminErrorResponse(new Error(result.error || "Social publish failed"), "Odoo Social Error");
      }

      return adminJson({
        success: true,
        message: "Job successfully published to Odoo Social Media channels",
        ...result,
      });
    }

    if (!body.message || !body.message.trim()) {
      return adminErrorResponse(new Error("Missing 'message' or 'jobId' in request body"), "Invalid request");
    }

    const result = await publishToOdooSocial({
      message: body.message,
      twitterMessage: body.twitterMessage,
      imageBase64: body.imageBase64,
      imageName: body.imageName,
      accountIds: body.accountIds,
      firstComment: body.firstComment,
      facebookFirstComment: body.facebookFirstComment,
      linkedinFirstComment: body.linkedinFirstComment,
      autoPublish: body.autoPublish !== false,
    });

    if (!result.ok) {
      return adminErrorResponse(new Error(result.error || "Social publish failed"), "Odoo Social Error");
    }

    return adminJson({
      success: true,
      message: "Post successfully dispatched to Odoo Social Media channels",
      ...result,
    });
  } catch (error) {
    return adminErrorResponse(error, "Failed to publish post to Odoo social channels");
  }
}
