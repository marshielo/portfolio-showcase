import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
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
    .select("id, sort_order")
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
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>
          <span className="text-sm text-foreground/40">
            Project {projectNumber} of {totalProjects}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
          {/* Left Column — Metadata */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                Artwork/Project Title
              </p>
              <h1 className="mt-1 text-2xl font-bold">{portfolio.title}</h1>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                Year Accomplished
              </p>
              <p className="mt-1">{portfolio.year_accomplished}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                Role/Position
              </p>
              <p className="mt-1">{portfolio.role_position}</p>
            </div>

            {portfolio.publication_link && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                  Publication Link
                </p>
                <a
                  href={portfolio.publication_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Project
                </a>
              </div>
            )}
          </div>

          {/* Right Column — Description + Images */}
          <div className="space-y-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                Artwork/Project Description
              </p>
              <div className="mt-3 whitespace-pre-wrap text-foreground/80 leading-relaxed">
                {portfolio.description}
              </div>
            </div>

            {/* Main Image */}
            {mainImage && (
              <div className="overflow-hidden rounded-xl bg-foreground/5">
                <img
                  src={mainImage.image_url}
                  alt={mainImage.alt_text ?? portfolio.title}
                  className="w-full object-contain"
                />
              </div>
            )}

            {/* Gallery */}
            {otherImages.length > 0 && (
              <ImageGallery images={otherImages} />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-between border-t border-foreground/10 pt-6">
          {prevPortfolio ? (
            <Link
              href={`/portfolio/${prevPortfolio.id}`}
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Project
            </Link>
          ) : (
            <div />
          )}
          {nextPortfolio ? (
            <Link
              href={`/portfolio/${nextPortfolio.id}`}
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground"
            >
              Next Project
              <ArrowRight className="h-4 w-4" />
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
