"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="items-center justify-center px-4">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Glassmorphic Card */}
        <div className="rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-white/70 dark:bg-black/40 p-8 backdrop-blur-xl shadow-2xl shadow-purple-500/5">
          {/* Brand */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-purple-600 to-cyan-500 dark:from-foreground dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Adyuta.
            </h1>
            <p className="mt-2 text-sm text-foreground/50">
              Sign in to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 dark:border-red-800 dark:bg-red-950/50 p-3 text-sm text-red-600 dark:text-red-400 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground/70"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm outline-none backdrop-blur-sm transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 placeholder:text-foreground/30"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground/70"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm outline-none backdrop-blur-sm transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 placeholder:text-foreground/30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-foreground/30">
          &copy; {new Date().getFullYear()} Adyuta Indra Adyatma
        </p>
      </div>
    </AuroraBackground>
  );
}
