import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PortfolioList } from "@/components/portfolio-list";

export default async function PortfoliosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: portfolios } = await supabase
    .from("portfolios")
    .select(
      "id, title, year_accomplished, role_position, is_featured, sort_order, portfolio_images(id, image_url, is_cover)"
    )
    .eq("user_id", user!.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolios</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Manage your portfolio projects
          </p>
        </div>
        <Link
          href="/admin/portfolios/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Link>
      </div>

      <PortfolioList portfolios={portfolios ?? []} />
    </div>
  );
}
