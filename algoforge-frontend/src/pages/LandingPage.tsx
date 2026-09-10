import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Trophy, LayoutDashboard, Code2, History, BarChart3 } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { CursorGlow } from "@/components/shared/CursorGlow";
import { DifficultyRings } from "@/components/landing/DifficultyRings";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { Features } from "@/components/landing/Features";
import { PlatformOverview } from "@/components/landing/PlatformOverview";
import { LivePreview } from "@/components/landing/LivePreview";
import { Stats } from "@/components/landing/Stats";
import { Contests } from "@/components/landing/Contests";
import { LeaderboardPreview } from "@/components/landing/LeaderboardPreview";
import { Footer } from "@/components/landing/Footer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { problemService } from "@/lib/services/problems";
import { leaderboardService } from "@/lib/services/leaderboard";
import { useAuthStore } from "@/store/auth-store";

export default function LandingPage() {
  const { token, username, hydrated, hydrate } = useAuthStore();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  const problemsQuery = useQuery({
    queryKey: ["landing-problems"],
    queryFn: () => problemService.search({ page: 0, size: 8 }),
  });

  const leaderboardQuery = useQuery({
    queryKey: ["landing-leaderboard"],
    queryFn: () => leaderboardService.getAll({ page: 0, size: 5 }),
  });

  const totalProblems = problemsQuery.data?.totalElements ?? 0;
  const topEntry = leaderboardQuery.data?.content[0];

  return (
    <main className="relative">
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <Hero isLoggedIn={!!token} username={username} />
      <TrustedBy />
      <Features />
      <PlatformOverview />

      {token && (
        <section className="relative bg-surface py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forge">
                  Your workspace
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Pick up exactly where you left off.
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-ink-muted">
                  Start with your dashboard, jump straight into the problem set, or review
                  recent submissions and ranking momentum.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LayoutDashboard size={15} /> Dashboard
                  </Button>
                </Link>
                <Link to="/problems">
                  <Button variant="forge" size="sm" className="gap-2">
                    <Code2 size={15} /> Problems
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="p-5 xl:col-span-2">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">Today&apos;s focus</p>
                <p className="mt-4 font-display text-3xl font-semibold tracking-tight">
                  A short path to your next solved problem.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-muted">
                  <span className="rounded-full border border-hairline bg-elevated px-3 py-1.5">Resume practice</span>
                  <span className="rounded-full border border-hairline bg-elevated px-3 py-1.5">Check rank</span>
                  <span className="rounded-full border border-hairline bg-elevated px-3 py-1.5">Open editor</span>
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">Top solver</p>
                <p className="mt-4 font-display text-3xl font-semibold text-forge">
                  {topEntry?.username ?? "—"}
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  {topEntry ? `${topEntry.solvedCount} solved · ${topEntry.score.toFixed(1)} score` : "Leaderboard is still warming up"}
                </p>
              </Card>

              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">Leaderboard</p>
                <div className="mt-4 flex items-center gap-2">
                  <Trophy className="text-amber" size={18} />
                  <p className="font-display text-3xl font-semibold mono-num">
                    #{topEntry?.rank ?? "—"}
                  </p>
                </div>
                <p className="mt-2 text-sm text-ink-muted">
                  Keep solving to move up and stay on top of your streak.
                </p>
              </Card>

              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">Catalog</p>
                <p className="mt-4 font-display text-3xl font-semibold text-gradient-forge mono-num">
                  {totalProblems.toLocaleString()}+
                </p>
                <p className="mt-2 text-sm text-ink-muted">Problems ready in the backend.</p>
              </Card>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card className="flex items-center gap-3 p-4">
                <History className="text-ink-muted" size={18} />
                <div>
                  <p className="text-sm font-medium">Review progress</p>
                  <p className="text-xs text-ink-faint">Open recent submissions and inspect run results.</p>
                </div>
              </Card>
              <Card className="flex items-center gap-3 p-4">
                <BarChart3 className="text-ink-muted" size={18} />
                <div>
                  <p className="text-sm font-medium">Track momentum</p>
                  <p className="text-xs text-ink-faint">See language usage, rank, and daily practice.</p>
                </div>
              </Card>
              <Card className="flex items-center gap-3 p-4">
                <ArrowUpRight className="text-ink-muted" size={18} />
                <div>
                  <p className="text-sm font-medium">Jump back in</p>
                  <p className="text-xs text-ink-faint">Continue solving without hunting through menus.</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {token ? (
        <LivePreview />
      ) : (
        <section className="relative bg-surface py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <SectionLabel>What you get after login</SectionLabel>
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                The full coding workspace stays behind sign-in.
              </h2>
              <p className="mt-4 text-lg text-ink-muted">
                Once you log in, you can open problems, write code, run against sample cases,
                and submit to the judge. The public landing page keeps the preview clean and
                focused on what the product does.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">Private editor</p>
                <p className="mt-3 font-display text-2xl font-semibold">Code workspace</p>
                <p className="mt-2 text-sm text-ink-muted">
                  The Monaco editor and submission console appear only after authentication.
                </p>
              </Card>
              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">Protected practice</p>
                <p className="mt-3 font-display text-2xl font-semibold">Problem set access</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Logged-in users can open problems, filter by difficulty, and start solving.
                </p>
              </Card>
              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">Judge flow</p>
                <p className="mt-3 font-display text-2xl font-semibold">Run and submit</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Sample runs stay local to the sandbox, while submissions are graded by the backend.
                </p>
              </Card>
            </div>
          </div>
        </section>
      )}
      <Stats />
      <DifficultyRings />
      <Contests />
      <LeaderboardPreview />
      <Footer />
    </main>
  );
}
