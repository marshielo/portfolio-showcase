import { createClient } from "./client";

const BUCKET_NAME = "portfolio-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "File must be JPEG, PNG, or WebP";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File must be less than 5MB";
  }
  return null;
}

export async function uploadPortfolioImage(
  file: File,
  userId: string,
  portfolioId: string
): Promise<{ publicUrl: string; storagePath: string }> {
  const error = validateImage(file);
  if (error) throw new Error(error);

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${userId}/${portfolioId}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

  return { publicUrl, storagePath };
}

export async function deletePortfolioImage(
  storagePath: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) throw error;
}

export function getPublicUrl(storagePath: string): string {
  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  return publicUrl;
}
