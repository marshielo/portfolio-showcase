import { createClient } from "@/lib/supabase/server";
import ScrollStack from "@/components/ui/scroll-stack";
import type { ScrollStackCard } from "@/components/ui/scroll-stack";
import { Mail, Phone, ExternalLink } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  const { data: portfolios } = await supabase
    .from("portfolios")
    .select("*, portfolio_images(*)")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(5);

  const cards: ScrollStackCard[] = (portfolios ?? []).map((p) => {
    const coverImage = p.portfolio_images?.find(
      (img: { is_cover: boolean }) => img.is_cover
    );
    const firstImage = coverImage ?? p.portfolio_images?.[0];

    return {
      id: p.id,
      title: p.title,
      subtitle: `${p.year_accomplished}`,
      badge: p.role_position,
      backgroundImage: firstImage?.image_url,
    };
  });

  return (
    <div className="min-h-screen">
      {/* Hero / Cover Section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-sm uppercase tracking-widest text-foreground/40">
          {profile?.submission_title ?? "Portfolio Submission for Apple Developer Academy"}
        </p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">
          {profile?.full_name ?? "Your Name"}
        </h1>
        <p className="mt-3 text-lg text-foreground/60">
          {profile?.student_status}
          {profile?.current_semester && ` — ${profile.current_semester}`}
        </p>
        <p className="mt-1 text-sm font-medium text-foreground/40">
          {profile?.submission_cohort ?? "Cohort 2024"}
        </p>

        {/* Contact info */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/60">
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {profile.email}
            </a>
          )}
          {profile?.phone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-4 w-4" />
              {profile.phone}
            </span>
          )}
          {profile?.professional_link && (
            <a
              href={profile.professional_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              Professional Profile
            </a>
          )}
        </div>

        <div className="mt-12 animate-bounce text-foreground/30">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Scroll Stack Cards */}
      {cards.length > 0 && <ScrollStack cards={cards} />}

      {/* Empty state */}
      {cards.length === 0 && (
        <section className="flex min-h-[50vh] items-center justify-center">
          <p className="text-foreground/40">No portfolio projects yet.</p>
        </section>
      )}
    </div>
  );
}
