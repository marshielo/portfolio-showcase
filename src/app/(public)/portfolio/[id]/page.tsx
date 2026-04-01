import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, User, Hash } from "lucide-react";
import type { Metadata } from "next";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { ImageGallery } from "@/components/image-gallery";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolios")
    .select("title, description")
    .eq("id", id)
    .single();

  if (!data) return { title: "Not Found" };

  return {
    title: `${data.title} | Portfolio`,
    description: data.description.slice(0, 160),
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*, portfolio_images(*)")
    .eq("id", id)
    .eq("is_featured", true)
    .single();

  if (!portfolio) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  // Get all featured portfolios for navigation
  const { data: allPortfolios } = await supabase
    .from("portfolios")
    .select("id, title, sort_order")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });

  const currentIndex =
    allPortfolios?.findIndex((p) => p.id === id) ?? -1;
  const prevPortfolio =
    currentIndex > 0 ? allPortfolios![currentIndex - 1] : null;
  const nextPortfolio =
    allPortfolios && currentIndex < allPortfolios.length - 1
      ? allPortfolios[currentIndex + 1]
      : null;
  const totalProjects = allPortfolios?.length ?? 0;
  const projectNumber = currentIndex + 1;

  const coverImage = portfolio.portfolio_images?.find(
    (img: { is_cover: boolean }) => img.is_cover
  );
  const mainImage = coverImage ?? portfolio.portfolio_images?.[0];
  const otherImages =
    portfolio.portfolio_images?.filter(
      (img: { id: string }) => img.id !== mainImage?.id
    ) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>
          <span className="text-sm text-foreground/40">
            Project {projectNumber} of {totalProjects}
          </span>
        </div>
      </header>

      {/* Full-width Hero Image */}
      {mainImage && (
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
          <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
            <div className="overflow-hidden rounded-2xl bg-foreground/5 shadow-xl ring-1 ring-foreground/5">
              <img
                src={mainImage.image_url}
                alt={mainImage.alt_text ?? portfolio.title}
                className="w-full object-contain"
              />
            </div>
          </div>
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Left — Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl tracking-tight">
                {portfolio.title}
              </h1>
              {portfolio.publication_link && (
                <a
                  href={portfolio.publication_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-purple-400/30 dark:border-purple-400/20 bg-purple-50 dark:bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 transition-all hover:scale-105"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Live Project
                </a>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3">
                Description
              </p>
              <div className="whitespace-pre-wrap text-foreground/70 leading-relaxed text-sm sm:text-base first-letter:text-2xl first-letter:font-bold first-letter:text-foreground">
                {portfolio.description}
              </div>
            </div>

            {/* Gallery */}
            {otherImages.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-4">
                  Gallery
                </p>
                <ImageGallery images={otherImages} />
              </div>
            )}
          </div>

          {/* Right — Metadata Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50/80 dark:bg-white/[0.03] p-6 backdrop-blur-sm space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <Hash className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/40">
                    Project
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
                    {portfolio.title}
                  </p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Calendar className="h-4 w-4 text-cyan-500" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/40">
                    Year
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
                    {portfolio.year_accomplished}
                  </p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                  <User className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/40">
                    Role
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
                    {portfolio.role_position}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-foreground/10 pt-8">
          {prevPortfolio ? (
            <Link
              href={`/portfolio/${prevPortfolio.id}`}
              className="group flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-white/10 p-4 transition-all hover:bg-neutral-50 dark:hover:bg-white/5 hover:shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 text-foreground/40 group-hover:text-foreground transition-colors" />
              <div>
                <p className="text-xs text-foreground/40">Previous</p>
                <p className="text-sm font-medium">
                  {(prevPortfolio as { id: string; title?: string }).title ?? "Previous Project"}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPortfolio ? (
            <Link
              href={`/portfolio/${nextPortfolio.id}`}
              className="group flex items-center justify-end gap-3 rounded-xl border border-neutral-200 dark:border-white/10 p-4 transition-all hover:bg-neutral-50 dark:hover:bg-white/5 hover:shadow-sm text-right"
            >
              <div>
                <p className="text-xs text-foreground/40">Next</p>
                <p className="text-sm font-medium">
                  {(nextPortfolio as { id: string; title?: string }).title ?? "Next Project"}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-foreground/40 group-hover:text-foreground transition-colors" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>

      {/* Footer */}
      {profile && (
        <PortfolioFooter profile={profile} />
      )}
    </div>
  );
}
