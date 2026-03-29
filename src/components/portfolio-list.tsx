"use client";

import Link from "next/link";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { deletePortfolio } from "@/app/(admin)/admin/portfolios/actions";

interface PortfolioListItem {
  id: string;
  title: string;
  year_accomplished: number;
  role_position: string;
  is_featured: boolean;
  sort_order: number;
  portfolio_images: { id: string; image_url: string; is_cover: boolean }[];
}

export function PortfolioList({
  portfolios,
}: {
  portfolios: PortfolioListItem[];
}) {
  if (portfolios.length === 0) {
    return (
      <div className="rounded-xl border border-foreground/10 p-12 text-center">
        <p className="text-foreground/60">No portfolios yet.</p>
        <Link
          href="/admin/portfolios/new"
          className="mt-2 inline-block text-sm underline hover:text-foreground"
        >
          Create your first portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-foreground/10 rounded-xl border border-foreground/10">
      {portfolios.map((p) => {
        const coverImage = p.portfolio_images?.find((img) => img.is_cover);
        const firstImage = coverImage ?? p.portfolio_images?.[0];

        return (
          <div
            key={p.id}
            className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-foreground/5"
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-foreground/30" />

            {/* Thumbnail */}
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
              {firstImage ? (
                <img
                  src={firstImage.image_url}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-foreground/30">
                  No img
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.title}</p>
              <p className="text-sm text-foreground/60">
                {p.year_accomplished} &middot; {p.role_position}
              </p>
            </div>

            {/* Badges */}
            <div className="hidden items-center gap-2 sm:flex">
              {p.is_featured && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                  Featured
                </span>
              )}
              <span className="text-xs text-foreground/40">
                #{p.sort_order}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link
                href={`/admin/portfolios/${p.id}/edit`}
                className="rounded-lg p-2 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  if (
                    confirm(
                      `Delete "${p.title}"? This will also delete all images.`
                    )
                  ) {
                    deletePortfolio(p.id);
                  }
                }}
                className="rounded-lg p-2 text-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
