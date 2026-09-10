import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";

const ROADMAPS = [
  { name: "Java", problems: 320, color: "#FF7A3D", progress: 72 },
  { name: "Python", problems: 410, color: "#45D9C7", progress: 88 },
  { name: "C++", problems: 275, color: "#8C7BFF", progress: 58 },
  { name: "JavaScript", problems: 298, color: "#FFC24B", progress: 63 },
  { name: "DSA", problems: 540, color: "#FF5D6C", progress: 91 },
  { name: "System Design", problems: 64, color: "#45D9C7", progress: 44 },
];

export function Roadmaps() {
  return (
    <section className="section-shell relative bg-void py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionLabel>Guided learning</SectionLabel>
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Roadmaps that know where you&apos;re headed.
            </h2>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAPS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="group relative overflow-hidden p-6 transition-all hover:-translate-y-1 hover:border-forge/30">
                <div
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                  style={{ background: r.color }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-xl font-semibold">{r.name}</h3>
                    <ArrowUpRight
                      size={18}
                      className="text-ink-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forge"
                    />
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">{r.problems} problems · beginner → advanced</p>
                  <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                    <span>Progress</span>
                    <span className="mono-num">{r.progress}%</span>
                  </div>
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-hairline-soft">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${r.progress}%`, background: r.color }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
