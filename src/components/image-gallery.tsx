"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { PortfolioImage } from "@/types/database";

export function ImageGallery({ images }: { images: PortfolioImage[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image.image_url)}
            className="overflow-hidden rounded-lg bg-foreground/5 transition-transform hover:scale-[1.02]"
          >
            <img
              src={image.image_url}
              alt={image.alt_text ?? "Portfolio image"}
              className="aspect-square w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={selectedImage}
            alt="Full resolution"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
