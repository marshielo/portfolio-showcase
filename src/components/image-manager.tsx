"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, Star } from "lucide-react";
import {
  uploadImage,
  deleteImage,
  setCoverImage,
} from "@/app/(admin)/admin/portfolios/actions";
import type { PortfolioImage } from "@/types/database";
import { cn } from "@/lib/utils";

export function ImageManager({
  portfolioId,
  images,
}: {
  portfolioId: string;
  images: PortfolioImage[];
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        await uploadImage(portfolioId, formData);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">Project Images</h2>

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-foreground/20 p-8 text-center transition-colors hover:border-foreground/40"
      >
        <Upload className="mx-auto h-8 w-8 text-foreground/40" />
        <p className="mt-2 text-sm text-foreground/60">
          {uploading
            ? "Uploading..."
            : "Click to upload images (JPEG, PNG, WebP, max 5MB)"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border border-foreground/10"
            >
              <img
                src={image.image_url}
                alt={image.alt_text ?? "Portfolio image"}
                className="aspect-square w-full object-cover"
              />
              {image.is_cover && (
                <span className="absolute top-2 left-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-medium text-white">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => setCoverImage(portfolioId, image.id)}
                  className={cn(
                    "rounded-lg p-2 text-white transition-colors",
                    image.is_cover
                      ? "bg-yellow-500"
                      : "bg-white/20 hover:bg-white/40"
                  )}
                  title="Set as cover"
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this image?")) {
                      deleteImage(portfolioId, image.id);
                    }
                  }}
                  className="rounded-lg bg-red-500/80 p-2 text-white transition-colors hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
