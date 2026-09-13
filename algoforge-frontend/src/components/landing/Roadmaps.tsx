import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";

const ROADMAPS = [
  { name: "Arrays & Hashing", status: "In progress", color: "#FF7A3D" },
  { name: "Stacks & Queues", status: "In progress", color: "#45D9C7" },
  { name: "Sliding Window", status: "In progress", color: "#8C7BFF" },
  { name: "Binary Search", status: "Coming soon", color: "#FFC24B" },
  { name: "Trees & Graphs", status: "Coming soon", color: "#FF5D6C" },
  { name: "Dynamic Programming", status: "Coming soon", color: "#45D9C7" },
];

export function Roadmaps() {
  return (
    <section className="section-shell relative bg-void py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Guided learning</SectionLabel>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Roadmaps that know where you&apos;re headed.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAPS.map((roadmap, index) => (
            <motion.div key={roadmap.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * 0.06 }}>
              <Card className="group relative overflow-hidden p-6 transition-all hover:-translate-y-1 hover:border-forge/30">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40" style={{ background: roadmap.color }} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-xl font-semibold">{roadmap.name}</h3>
                    <ArrowUpRight size={18} className="text-ink-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forge" />
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">Beginner to advanced practice path</p>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: roadmap.color }}>
                    {roadmap.status}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
