export const PUBLIC_CONNECT_JOB_COLUMNS =
  "id, title, company_name, company_domain, description, category, language, tags, salary_min, salary_max, currency, location, job_type, source, source_url, seo_slug, status, is_public, posted_by, claimed_by, created_at, updated_at" as const;

export const AUTHED_CONNECT_JOB_COLUMNS =
  "id, title, company_name, company_domain, company_email, description, category, language, tags, salary_min, salary_max, currency, location, job_type, source, source_url, seo_slug, status, is_public, posted_by, claimed_by, created_at, updated_at" as const;

export const SAFE_CONNECT_PROPOSAL_COLUMNS =
  "id, from_user_id, to_user_id, need_id, request_id, job_id, amount, currency, timeline_days, message, status, is_viewed, viewed_at, client_name, created_at, updated_at" as const;
