import { createClient } from "@/lib/supabase/server";
import type { ConnectNeed, ConnectProfile, ConnectRequestRow } from "@/lib/connect-types";

export type { ConnectNeed, ConnectProfile, ConnectRequestRow } from "@/lib/connect-types";
export { skillsList } from "@/lib/connect-types";

export async function listPublicConnectProfiles(search?: string) {
  const supabase = await createClient();
  let q = supabase
    .from("connect_profiles")
    .select(
      "id, user_id, display_title, headline, bio, skills, rate_band, availability, location_label, is_listed, is_verified, moderation_status, account_type, created_at, updated_at, avg_rating, review_count, completion_rate, reputation_score, profile_completeness",
    )
    .eq("is_listed", true)
    .in("moderation_status", ["approved", "auto_approved", "pending"])
    .order("reputation_score", { ascending: false })
    .limit(60);
  if (search?.trim()) {
    const s = `%${search.trim()}%`;
    q = q.or(`display_title.ilike.${s},headline.ilike.${s},bio.ilike.${s},location_label.ilike.${s}`);
  }
  const { data } = await q;
  return (data ?? []) as ConnectProfile[];
}

export async function listPublicConnectNeeds(search?: string) {
  const supabase = await createClient();
  let q = supabase
    .from("connect_need_posts")
    .select(
      "id, client_user_id, title, summary, skills, budget_band, is_open, moderation_status, created_at",
    )
    .eq("is_open", true)
    .in("moderation_status", ["approved", "auto_approved", "pending"])
    .order("created_at", { ascending: false })
    .limit(60);
  if (search?.trim()) {
    const s = `%${search.trim()}%`;
    q = q.or(`title.ilike.${s},summary.ilike.${s}`);
  }
  const { data } = await q;
  return (data ?? []) as ConnectNeed[];
}

export async function listMyConnectRequests() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [] as ConnectRequestRow[];
  const { data } = await supabase
    .from("connect_request_details")
    .select("*")
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as ConnectRequestRow[];
}

export type ConnectReview = {
  id: string;
  request_id: string | null;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  body: string | null;
  created_at: string;
};

export type ConnectProposal = {
  id: string;
  need_id: string | null;
  from_user_id: string;
  to_user_id: string;
  amount: number | null;
  currency: string | null;
  timeline_days: number | null;
  message: string | null;
  status: string;
  created_at: string;
};

export type ConnectMilestone = {
  id: string;
  engagement_request_id: string;
  client_user_id: string;
  freelancer_user_id: string;
  title: string;
  amount: number | null;
  currency: string | null;
  status: string;
  funded_at?: string | null;
  released_at?: string | null;
  created_at: string;
};

export async function listReviewsForRequest(requestId: string): Promise<ConnectReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("connect_reviews")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });
  return (data ?? []) as ConnectReview[];
}

export async function listProposalsForNeed(needId: string): Promise<ConnectProposal[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("connect_proposals")
    .select("*")
    .eq("need_id", needId)
    .order("created_at", { ascending: false });
  return (data ?? []) as ConnectProposal[];
}

export async function listMilestonesForRequest(requestId: string): Promise<ConnectMilestone[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("connect_milestones")
    .select("*")
    .eq("engagement_request_id", requestId)
    .order("created_at", { ascending: true });
  return (data ?? []) as ConnectMilestone[];
}
