import { motion } from "framer-motion";
import {
  TerminalSquare,
  Trophy,
  BarChart3,
  BookOpenCheck,
  Flame,
  TimerReset,
  Gauge,
  Layers3,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Problem Library",
    desc: "Browse curated challenges by difficulty and topic, then jump straight into the editor when you're ready.",
    tone: "forge",
  },
  {
    icon: TerminalSquare,
    title: "Real Sandbox Runs",
    desc: "Run code against sample cases in an isolated backend sandbox, then submit it for final grading.",
    tone: "cyan",
  },
  {
    icon: Trophy,
    title: "Live Leaderboards",
    desc: "See where you rank by solved count, score, and recent performance across the platform.",
    tone: "violet",
  },
  {
    icon: BarChart3,
    title: "Dashboard Insights",
    desc: "Track acceptance rate, streaks, recent submissions, and your submission rhythm in one place.",
    tone: "forge",
  },
  {
    icon: Flame,
    title: "Daily Momentum",
    desc: "Keep your streak alive with consistent practice and a clear view of your recent progress.",
    tone: "cyan",
  },
  {
    icon: Gauge,
    title: "Performance Tracking",
    desc: "Measure your coding speed, runtime, and success trends after every submission.",
    tone: "violet",
  },
  {
    icon: Layers3,
    title: "Submission History",
    desc: "Review every run, inspect outcomes, and compare how your solutions improve over time.",
    tone: "forge",
  },
  {
    icon: TimerReset,
    title: "Practice Workflow",
    desc: "Move from challenge selection to solution review with a clean, focused coding loop.",
    tone: "cyan",
  },
];

const toneMap: Record<string, string> = {
  forge: "text-forge bg-forge/10 border-forge/25",
  cyan: "text-cyan bg-cyan/10 border-cyan/25",
  violet: "text-violet bg-violet/10 border-violet/25",
};

export function Features() {
  return (
    <section id="features" className="section-shell relative bg-void py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Built for real practice</SectionLabel>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            A cleaner path from problem to rank.
          </h2>
          <p className="mt-4 text-lg text-ink-muted">
            AlgoForge brings together challenge solving, sandbox execution, leaderboard ranking,
            and submission review in one streamlined coding platform.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
            >
              <Card className="group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-forge/30">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div
                    className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${toneMap[f.tone]}`}
                  >
                    <f.icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
