"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      professional_link:
        (formData.get("professional_link") as string) || null,
      student_status: formData.get("student_status") as string,
      current_semester:
        (formData.get("current_semester") as string) || null,
      submission_title: formData.get("submission_title") as string,
      submission_cohort: formData.get("submission_cohort") as string,
    })
    .eq("id", user.id);

  if (error) throw error;

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
