import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/portfolio-form";
import { ImageManager } from "@/components/image-manager";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*, portfolio_images(*)")
    .eq("id", id)
    .single();

  if (!portfolio) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Edit Portfolio</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Update your project details and images
        </p>
      </div>
      <PortfolioForm portfolio={portfolio} />
      <ImageManager
        portfolioId={id}
        images={portfolio.portfolio_images ?? []}
      />
    </div>
  );
}
