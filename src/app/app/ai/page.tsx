import { redirect } from "next/navigation";
import { getProfile } from "@/lib/profile";
import { ClivoraAiWorkspace } from "@/components/ai/ClivoraAiWorkspace";

export const metadata = {
  title: "CLIVORA AI Assistant",
  description: "AI-powered proposal drafting, smart invoice line item builder, and live business health advisory with WhatsApp sharing.",
};

export default async function AiAssistantPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="space-y-6">
      <ClivoraAiWorkspace />
    </div>
  );
}
