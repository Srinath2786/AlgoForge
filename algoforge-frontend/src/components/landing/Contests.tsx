import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Clock } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function useCountdown(target: Date) {
  const [left, setLeft] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const clamped = Math.max(left, 0);
  const d = Math.floor(clamped / 86400000);
  const h = Math.floor((clamped % 86400000) / 3600000);
  const m = Math.floor((clamped % 3600000) / 60000);
  const s = Math.floor((clamped % 60000) / 1000);
  return { d, h, m, s };
}

const CONTESTS = [
  { name: "Weekly Contest 412", when: 2, participants: 8213, prize: "Top 100 → Certificate", accent: "#FF7A3D" },
  { name: "Biweekly Contest 138", when: 6, participants: 5490, prize: "Top 50 → Swag Kit", accent: "#45D9C7" },
  { name: "AlgoForge Cup — Java Special", when: 9, participants: 12042, prize: "₹50,000 pool", accent: "#8C7BFF" },
];

function ContestCard({ c, i }: { c: (typeof CONTESTS)[number]; i: number }) {
  const target = new Date(Date.now() + c.when * 3600 * 1000);
  const t = useCountdown(target);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.08 }}
    >
      <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-forge/30">
        <div
          className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-35"
          style={{ background: c.accent }}
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl border text-forge"
              style={{ background: `${c.accent}1A`, borderColor: `${c.accent}66` }}
            >
              <Trophy size={18} />
            </span>
            <div className="flex items-center gap-1 font-mono text-xs text-ink-faint">
              <Users size={13} /> {c.participants.toLocaleString()}
            </div>
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">{c.name}</h3>
          <p className="mt-1 text-sm text-ink-muted">{c.prize}</p>

          <div className="mt-5 flex items-center gap-1.5 text-ink-faint">
            <Clock size={13} />
            <span className="font-mono text-[10px] uppercase tracking-widest">Starts in</span>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[
              { v: t.d, l: "d" },
              { v: t.h, l: "h" },
              { v: t.m, l: "m" },
              { v: t.s, l: "s" },
            ].map((u) => (
              <div key={u.l} className="rounded-lg border border-hairline bg-surface py-2 text-center">
                <p className="font-mono text-lg font-semibold text-forge mono-num">
                  {String(u.v).padStart(2, "0")}
                </p>
                <p className="font-mono text-[9px] uppercase text-ink-faint">{u.l}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-5 w-full">
            Register
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export function Contests() {
  return (
    <section id="contests" className="section-shell relative bg-surface py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Practice cadence</SectionLabel>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Build a weekly rhythm that keeps you sharp.
          </h2>
          <p className="mt-4 text-lg text-ink-muted">Set a daily challenge, choose problems from the catalog, and use your contribution graph to turn practice into a lasting habit.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="col-span-full border-forge/20 bg-gradient-to-br from-forge/10 via-surface to-surface p-8 text-center">
            <Trophy className="mx-auto text-forge" size={26} />
            <h3 className="mt-4 font-display text-xl font-semibold">Competitive contests are planned next</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-muted">The current product is focused on problem solving, scheduled daily challenges, submissions, and the global leaderboard. Timed registrations and contest rankings will appear here when they are ready.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
