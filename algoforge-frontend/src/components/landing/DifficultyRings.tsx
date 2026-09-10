import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";

const RINGS = [
  { label: "Easy", solved: 612, total: 640, color: "#45D9C7" },
  { label: "Medium", solved: 498, total: 720, color: "#FFC24B" },
  { label: "Hard", solved: 141, total: 340, color: "#FF5D6C" },
];

function Ring({ r, i }: { r: (typeof RINGS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const size = 168;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = r.solved / r.total;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.5 }}
    >
      <Card className="flex flex-col items-center p-8">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#1A2032"
              strokeWidth={stroke}
              fill="none"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={r.color}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={
                inView
                  ? { strokeDashoffset: circumference * (1 - pct) }
                  : {}
              }
              transition={{ delay: 0.2 + i * 0.12, duration: 1.1, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 6px ${r.color}66)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-semibold mono-num">
              {r.solved}
              <span className="text-ink-faint">/{r.total}</span>
            </span>
            <span
              className="mt-1 text-xs font-semibold uppercase tracking-widest"
              style={{ color: r.color }}
            >
              {r.label}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function DifficultyRings() {
  return (
    <section className="relative bg-surface py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Track your progress</SectionLabel>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Watch every ring fill in.
          </h2>
          <p className="mt-4 text-lg text-ink-muted">
            Progress by difficulty, updated with every accepted submission.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {RINGS.map((r, i) => (
            <Ring key={r.label} r={r} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
