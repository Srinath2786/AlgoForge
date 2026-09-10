import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const FAQS = [
  {
    q: "Is AlgoForge free to use?",
    a: "Yes. Create an account, browse the available problems, run code against sample tests, and track your progress on the dashboard.",
  },
  {
    q: "Which languages are supported?",
    a: "Java, Python, C++, and JavaScript are supported by the current Docker-backed execution service.",
  },
  {
    q: "How are solutions checked?",
    a: "Run uses visible sample test cases. Submit sends your solution to the judge, which checks it against the complete test suite and returns a verdict with execution details.",
  },
  {
    q: "Can colleges or companies use this for hiring?",
    a: "Yes — the Enterprise plan includes cohort management, custom problem sets, and a hiring analytics dashboard for teams and campuses.",
  },
  {
    q: "Do you offer certificates?",
    a: "Completing a roadmap track (like DSA or System Design) earns you a verifiable certificate you can add to your resume or LinkedIn.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-shell relative bg-surface py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-14 divide-y divide-hairline border-y border-hairline">
          {FAQS.map((f, i) => (
            <div key={f.q} className="overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="focus-ring flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-medium">{f.q}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-forge/20 bg-forge/5">
                  <Plus
                    size={18}
                    className={`shrink-0 text-forge transition-transform duration-300 ${
                      open === i ? "rotate-45" : ""
                    }`}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-ink-muted">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
