"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPortfolio(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      user_id: user.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      year_accomplished: parseInt(formData.get("year_accomplished") as string),
      role_position: formData.get("role_position") as string,
      publication_link: (formData.get("publication_link") as string) || null,
      sort_order: parseInt((formData.get("sort_order") as string) || "0"),
      is_featured: formData.get("is_featured") === "on",
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/portfolios");
  redirect(`/admin/portfolios/${data.id}/edit`);
}

export async function updatePortfolio(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("portfolios")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      year_accomplished: parseInt(formData.get("year_accomplished") as string),
      role_position: formData.get("role_position") as string,
      publication_link: (formData.get("publication_link") as string) || null,
      sort_order: parseInt((formData.get("sort_order") as string) || "0"),
      is_featured: formData.get("is_featured") === "on",
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/admin/portfolios");
  revalidatePath(`/admin/portfolios/${id}/edit`);
}

export async function deletePortfolio(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get all images to delete from storage
  const { data: images } = await supabase
    .from("portfolio_images")
    .select("storage_path")
    .eq("portfolio_id", id);

  if (images && images.length > 0) {
    const paths = images.map((img) => img.storage_path);
    await supabase.storage.from("portfolio-images").remove(paths);
  }

  const { error } = await supabase
    .from("portfolios")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/admin/portfolios");
  redirect("/admin/portfolios");
}

export async function reorderPortfolios(
  items: { id: string; sort_order: number }[]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  for (const item of items) {
    await supabase
      .from("portfolios")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id)
      .eq("user_id", user.id);
  }

  revalidatePath("/admin/portfolios");
}

export async function uploadImage(portfolioId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${user.id}/${portfolioId}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-images")
    .upload(storagePath, file);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("portfolio-images").getPublicUrl(storagePath);

  const { error: dbError } = await supabase.from("portfolio_images").insert({
    portfolio_id: portfolioId,
    image_url: publicUrl,
    storage_path: storagePath,
    alt_text: file.name,
    is_cover: false,
    sort_order: 0,
  });

  if (dbError) throw dbError;

  revalidatePath(`/admin/portfolios/${portfolioId}/edit`);
}

export async function deleteImage(portfolioId: string, imageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: image } = await supabase
    .from("portfolio_images")
    .select("storage_path")
    .eq("id", imageId)
    .single();

  if (image) {
    await supabase.storage
      .from("portfolio-images")
      .remove([image.storage_path]);
  }

  await supabase.from("portfolio_images").delete().eq("id", imageId);

  revalidatePath(`/admin/portfolios/${portfolioId}/edit`);
}

export async function setCoverImage(portfolioId: string, imageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Unset all covers for this portfolio
  await supabase
    .from("portfolio_images")
    .update({ is_cover: false })
    .eq("portfolio_id", portfolioId);

  // Set the new cover
  await supabase
    .from("portfolio_images")
    .update({ is_cover: true })
    .eq("id", imageId);

  revalidatePath(`/admin/portfolios/${portfolioId}/edit`);
}
