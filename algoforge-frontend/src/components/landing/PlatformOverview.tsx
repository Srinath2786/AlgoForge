import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, ChevronRight, Code2, Play, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";

const STEPS = [
  {
    number: "01",
    icon: Code2,
    title: "Choose a challenge",
    description: "Browse problems by difficulty and topic, then open a focused workspace with examples and constraints.",
    tone: "text-forge border-forge/25 bg-forge/10",
  },
  {
    number: "02",
    icon: Play,
    title: "Run with confidence",
    description: "Use the Monaco editor and run against visible sample cases before you submit your final solution.",
    tone: "text-cyan border-cyan/25 bg-cyan/10",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Measure your growth",
    description: "Review verdicts, execution details, acceptance rate, activity, and your place on the leaderboard.",
    tone: "text-violet border-violet/25 bg-violet/10",
  },
];

export function PlatformOverview() {
  return (
    <section className="relative overflow-hidden bg-surface py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[52rem] -translate-x-1/2 rounded-full bg-forge/10 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-xl">
            <SectionLabel>The AlgoForge loop</SectionLabel>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Practice with a system that keeps your next move clear.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              AlgoForge keeps the workflow simple: understand the problem, write a solution,
              validate it safely, and use every result to make the next attempt better.
            </p>
            <Link to="/register" className="mt-8 inline-flex">
              <Button variant="forge" size="md">
                Create your workspace <ChevronRight size={17} />
              </Button>
            </Link>
          </div>

          <Card className="relative overflow-hidden p-5 sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,122,61,0.12),transparent_32%)]" />
            <div className="relative flex items-center justify-between border-b border-hairline pb-4">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">Your practice session</p>
                <p className="mt-1 font-display text-lg font-semibold">One clear loop, end to end</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                <ShieldCheck size={17} />
              </div>
            </div>
            <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-hairline bg-void/55 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-ink-faint">{step.number}</span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${step.tone}`}>
                      <step.icon size={15} />
                    </div>
                  </div>
                  <h3 className="mt-6 font-display text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl border border-hairline bg-void/40 p-5">
            <CheckCircle2 className="mt-0.5 shrink-0 text-cyan" size={18} />
            <div><p className="font-medium">Visible and hidden tests</p><p className="mt-1 text-sm text-ink-muted">Practice against samples, then let the judge verify your final submission.</p></div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-hairline bg-void/40 p-5">
            <ShieldCheck className="mt-0.5 shrink-0 text-forge" size={18} />
            <div><p className="font-medium">Isolated execution</p><p className="mt-1 text-sm text-ink-muted">Code runs in a Docker-backed sandbox with time, memory, and network limits.</p></div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-hairline bg-void/40 p-5">
            <Trophy className="mt-0.5 shrink-0 text-amber" size={18} />
            <div><p className="font-medium">Progress with context</p><p className="mt-1 text-sm text-ink-muted">Use dashboard activity, submissions, and rank to decide what to solve next.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
