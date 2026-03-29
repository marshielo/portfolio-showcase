import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, FileDown } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count } = await supabase
    .from("portfolios")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { data: recentPortfolios } = await supabase
    .from("portfolios")
    .select("id, title, year_accomplished, sort_order")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Manage your portfolio projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-foreground/10 p-6">
          <p className="text-sm text-foreground/60">Total Portfolios</p>
          <p className="mt-2 text-3xl font-bold">{count ?? 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/portfolios/new"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add New Portfolio
        </Link>
        <Link
          href="/api/export/pdf"
          className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
        >
          <FileDown className="h-4 w-4" />
          Export PDF
        </Link>
      </div>

      {/* Recent Portfolios */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Portfolios</h2>
        {recentPortfolios && recentPortfolios.length > 0 ? (
          <div className="divide-y divide-foreground/10 rounded-xl border border-foreground/10">
            {recentPortfolios.map((p) => (
              <Link
                key={p.id}
                href={`/admin/portfolios/${p.id}/edit`}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-foreground/5"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-foreground/60">
                    {p.year_accomplished}
                  </p>
                </div>
                <span className="text-xs text-foreground/40">
                  #{p.sort_order}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/60">
            No portfolios yet.{" "}
            <Link
              href="/admin/portfolios/new"
              className="underline hover:text-foreground"
            >
              Create your first one
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
