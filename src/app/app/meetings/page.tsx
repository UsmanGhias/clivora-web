import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { Suspense } from "react";
import { MeetingsClient } from "./MeetingsClient";

type MeetingLink = {
  id: string;
  owner_uid: string;
  room_url: string;
  title: string | null;
  created_at: string | null;
};

export default async function MeetingsPage() {
  const profile = await getProfile();
  const supabase = await createClient();
  const uid = profile?.id ?? "";
  let links: MeetingLink[] = [];

  try {
    const { data } = await supabase
      .from("meeting_links")
      .select("id, owner_uid, room_url, title, created_at")
      .eq("owner_uid", uid)
      .order("created_at", { ascending: false })
      .limit(20);
    links = (data ?? []) as MeetingLink[];
  } catch {
    links = [];
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">Meetings</h1>
        <p className="text-sm text-text-secondary">
          Create instant Jitsi video rooms and connect Google Calendar when available.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-text-secondary">Loading meetings…</p>}>
        <MeetingsClient initial={links} ownerUid={uid} />
      </Suspense>
    </div>
  );
}
