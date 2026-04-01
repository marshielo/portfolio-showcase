import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, FileDown, FolderOpen, Star, ImageIcon, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { count: totalCount } = await supabase
    .from("portfolios")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: featuredCount } = await supabase
    .from("portfolios")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .eq("is_featured", true);

  const { data: recentPortfolios } = await supabase
    .from("portfolios")
    .select("id, title, year_accomplished, sort_order")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Here&apos;s an overview of your portfolio
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-xl border border-foreground/10 p-6 transition-all hover:shadow-md hover:border-purple-400/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
              <FolderOpen className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Total Projects</p>
              <p className="text-2xl font-bold">{totalCount ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="group rounded-xl border border-foreground/10 p-6 transition-all hover:shadow-md hover:border-cyan-400/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-500/10">
              <Star className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Featured</p>
              <p className="text-2xl font-bold">{featuredCount ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="group rounded-xl border border-foreground/10 p-6 transition-all hover:shadow-md hover:border-orange-400/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
              <ImageIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Showcased</p>
              <p className="text-2xl font-bold">{totalCount ? "Live" : "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/portfolios/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <Plus className="h-4 w-4" />
          Add New Portfolio
        </Link>
        <Link
          href="/api/export/pdf"
          className="inline-flex items-center gap-2 rounded-xl border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-all hover:bg-foreground/5 hover:shadow-sm"
        >
          <FileDown className="h-4 w-4" />
          Export PDF
        </Link>
      </div>

      {/* Recent Portfolios */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <Link
            href="/admin/portfolios"
            className="inline-flex items-center gap-1 text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentPortfolios && recentPortfolios.length > 0 ? (
          <div className="divide-y divide-foreground/5 rounded-xl border border-foreground/10 overflow-hidden">
            {recentPortfolios.map((p) => (
              <Link
                key={p.id}
                href={`/admin/portfolios/${p.id}/edit`}
                className="flex items-center justify-between px-5 py-4 transition-all hover:bg-foreground/[0.03]"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-foreground/50 mt-0.5">
                    {p.year_accomplished}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/40">
                    #{p.sort_order}
                  </span>
                  <ArrowRight className="h-4 w-4 text-foreground/20" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-foreground/20 p-8 text-center">
            <FolderOpen className="mx-auto h-8 w-8 text-foreground/20 mb-3" />
            <p className="text-sm text-foreground/60">
              No portfolios yet.{" "}
              <Link
                href="/admin/portfolios/new"
                className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                Create your first one
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
