import { createClient } from "@/lib/supabase/server";
import { ProfileSettingsForm } from "@/components/profile-settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Update your personal information for the portfolio
        </p>
      </div>
      <ProfileSettingsForm profile={profile} />
    </div>
  );
}
