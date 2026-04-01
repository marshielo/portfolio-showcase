"use client";

import { useActionState } from "react";
import {
  createPortfolio,
  updatePortfolio,
} from "@/app/(admin)/admin/portfolios/actions";
import type { PortfolioWithImages } from "@/types/database";

export function PortfolioForm({
  portfolio,
}: {
  portfolio?: PortfolioWithImages;
}) {
  const isEditing = !!portfolio;

  const action = async (_prevState: unknown, formData: FormData) => {
    try {
      if (isEditing) {
        await updatePortfolio(portfolio.id, formData);
        return { success: "Portfolio updated successfully" };
      } else {
        await createPortfolio(formData);
        return { success: "Portfolio created successfully" };
      }
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
          {state.success}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Project Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={portfolio?.title}
          className="w-full rounded-xl border border-foreground/20 bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
          placeholder="e.g. iOS Health Tracking App"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Project Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={portfolio?.description}
          className="w-full rounded-xl border border-foreground/20 bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
          placeholder="Write down your concept description that demonstrates comprehensive reasoning..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="year_accomplished"
            className="block text-sm font-medium"
          >
            Year Accomplished *
          </label>
          <input
            id="year_accomplished"
            name="year_accomplished"
            type="number"
            required
            min={2000}
            max={2099}
            defaultValue={portfolio?.year_accomplished ?? new Date().getFullYear()}
            className="w-full rounded-xl border border-foreground/20 bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="role_position"
            className="block text-sm font-medium"
          >
            Role / Position *
          </label>
          <input
            id="role_position"
            name="role_position"
            type="text"
            required
            defaultValue={portfolio?.role_position}
            className="w-full rounded-xl border border-foreground/20 bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
            placeholder="e.g. iOS Developer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="publication_link"
          className="block text-sm font-medium"
        >
          Publication Link
        </label>
        <input
          id="publication_link"
          name="publication_link"
          type="url"
          defaultValue={portfolio?.publication_link ?? ""}
          className="w-full rounded-xl border border-foreground/20 bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
          placeholder="https://..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="sort_order" className="block text-sm font-medium">
            Sort Order
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            min={0}
            defaultValue={portfolio?.sort_order ?? 0}
            className="w-full rounded-xl border border-foreground/20 bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        <div className="flex items-end space-x-2 pb-1">
          <input
            id="is_featured"
            name="is_featured"
            type="checkbox"
            defaultChecked={portfolio?.is_featured ?? true}
            className="h-4 w-4 rounded border-foreground/20"
          />
          <label htmlFor="is_featured" className="text-sm font-medium">
            Featured (show on public page)
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-foreground/10">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : isEditing
              ? "Update Portfolio"
              : "Create Portfolio"}
        </button>
      </div>
    </form>
  );
}
