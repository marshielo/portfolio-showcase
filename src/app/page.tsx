import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/ui/hero-section";
import { ProjectShowcase } from "@/components/ui/project-showcase";
import type { ProjectCard } from "@/components/ui/project-showcase";
import { AboutSection } from "@/components/ui/about-section";
import { ExperienceSection } from "@/components/ui/experience-section";
import { BentoGridSection } from "@/components/ui/bento-grid-section";
import { ContactFooter } from "@/components/ui/contact-footer";
import { PortfolioNavbar } from "@/components/portfolio-navbar";

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
    .order("sort_order", { ascending: true });

  const cards: ProjectCard[] = (portfolios ?? []).map((p) => {
    const coverImage = p.portfolio_images?.find(
      (img: { is_cover: boolean }) => img.is_cover
    );
    const firstImage = coverImage ?? p.portfolio_images?.[0];

    return {
      id: p.id,
      title: p.title,
      year: `${p.year_accomplished}`,
      role: p.role_position,
      backgroundImage: firstImage?.image_url,
      publicationLink: p.publication_link ?? undefined,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <PortfolioNavbar email={profile?.email} />
      <HeroSection
        name={profile?.full_name ?? "Adyuta"}
        email={profile?.email}
      />

      {cards.length > 0 && <ProjectShowcase cards={cards} />}

      {cards.length === 0 && (
        <section className="flex min-h-[50vh] items-center justify-center">
          <p className="text-foreground/40">No portfolio projects yet.</p>
        </section>
      )}

      {/* Gradient divider */}
      <div className="mx-auto max-w-3xl h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <AboutSection linkedinUrl="https://linkedin.com/in/adyutaindra" />

      {/* Gradient divider */}
      <div className="mx-auto max-w-3xl h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <ExperienceSection />

      {/* Gradient divider */}
      <div className="mx-auto max-w-3xl h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <BentoGridSection email={profile?.email} />

      <ContactFooter
        name={profile?.full_name}
        email={profile?.email}
        githubUsername="marshielo"
        linkedinUrl="https://linkedin.com/in/adyutaindra"
      />
    </div>
  );
}
