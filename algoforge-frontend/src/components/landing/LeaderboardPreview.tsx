import { motion } from "framer-motion";
import { Crown, Flame, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { leaderboardService } from "@/lib/services/leaderboard";

function initialsFromUsername(username: string) {
  return username
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

export function LeaderboardPreview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["landing-leaderboard-preview"],
    queryFn: () => leaderboardService.getAll({ page: 0, size: 5 }),
  });

  const leaders = data?.content ?? [];

  return (
    <section id="leaderboard" className="relative bg-void py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>Live rankings</SectionLabel>
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              The leaderboard keeps moving.
            </h2>
          </div>
          <Link to="/leaderboard">
            <Button variant="outline" size="sm" className="gap-2">
              <Trophy size={14} /> View full leaderboard
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12"
        >
          <Card className="divide-y divide-hairline overflow-hidden">
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="h-5 w-8 rounded bg-elevated" />
                  <div className="h-10 w-10 rounded-full bg-elevated" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-elevated" />
                    <div className="h-2.5 w-20 rounded bg-elevated" />
                  </div>
                  <div className="h-4 w-16 rounded bg-elevated" />
                </div>
              ))}

            {!isLoading && !isError && leaders.length === 0 && (
              <div className="px-6 py-8 text-sm text-ink-muted">The leaderboard is warming up. New rankings appear after submissions are graded.</div>
            )}

            {!isLoading && !isError && leaders.map((leader, index) => (
              <div
                key={leader.username}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-elevated/60"
              >
                <div className="w-8 shrink-0 text-center">
                  {index === 0 ? (
                    <Crown size={18} className="mx-auto text-amber" />
                  ) : (
                    <span className="font-mono text-sm text-ink-faint mono-num">#{leader.rank}</span>
                  )}
                </div>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-void"
                  style={{ background: ["#FFC24B", "#C7CCD9", "#D9884D", "#45D9C7", "#8C7BFF"][index % 5] }}
                >
                  {initialsFromUsername(leader.username)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{leader.username}</p>
                  <p className="text-xs text-ink-faint">{leader.solvedCount} solved · {leader.totalSubmissions} submissions</p>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-forge mono-num">
                  <Flame size={13} />
                  {leader.score.toFixed(1)}
                </div>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
