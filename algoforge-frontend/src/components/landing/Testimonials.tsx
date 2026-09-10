import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";

const TESTIMONIALS = [
  {
    quote:
      "The AI review caught an O(n²) approach I would've shipped straight into an interview. Fixed it, understood why, and it stuck.",
    name: "Ananya Rao",
    role: "SDE-2, offer from a FAANG company",
    initials: "AR",
    accent: "#FF7A3D",
  },
  {
    quote:
      "Weekly contests turned practice into a habit. I stopped dreading DSA rounds because I'd already solved something harder that morning.",
    name: "Rahul Mehta",
    role: "Final-year CSE student",
    initials: "RM",
    accent: "#45D9C7",
  },
  {
    quote:
      "The system design roadmap alone was worth it — it's the first resource that actually built intuition instead of just listing patterns.",
    name: "Sneha Iyer",
    role: "Backend Engineer",
    initials: "SI",
    accent: "#8C7BFF",
  },
];

export function Testimonials() {
  return (
    <section className="section-shell relative bg-surface py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Loved by developers</SectionLabel>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Don&apos;t take our word for it.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="flex h-full flex-col overflow-hidden p-6">
                <div className="flex gap-1 text-amber">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: `${t.accent}22`, color: t.accent }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-ink-faint">{t.role}</p>
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
