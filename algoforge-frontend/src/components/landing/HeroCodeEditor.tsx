import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const SNIPPET = `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) {
            return new int[] { seen.get(need), i };
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}`;

function highlight(line: string) {
  return line
    .replace(/\b(public|int|new|for|if|return|class|Map)\b/g, '<span class="text-violet">$1</span>')
    .replace(/\b(twoSum|containsKey|get|put|HashMap)\b/g, '<span class="text-cyan">$1</span>')
    .replace(/(\d+)/g, '<span class="text-amber">$1</span>')
    .replace(/(nums|target|seen|need|i)\b/g, '<span class="text-ink">$1</span>');
}

const TESTS = [
  { label: "nums=[2,7,11,15], target=9", status: "pass" },
  { label: "nums=[3,2,4], target=6", status: "pass" },
  { label: "nums=[3,3], target=6", status: "running" },
];

export function HeroCodeEditor() {
  const lines = SNIPPET.split("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full max-w-xl"
    >
      <div className="absolute -inset-px rounded-2xl seam bg-[length:200%_100%] animate-seam-flow opacity-60 blur-[2px]" />
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-[#0B0E17]/95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-cyan/70" />
          </div>
          <span className="font-mono text-xs text-ink-faint">Solution.java</span>
          <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-[10px] text-cyan">
            Java 21
          </span>
        </div>

        <div className="flex">
          <div className="select-none border-r border-hairline px-3 py-4 font-mono text-xs leading-6 text-ink-faint">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="flex-1 overflow-hidden px-4 py-4 font-mono text-[13px] leading-6 text-ink">
            {lines.map((l, i) => (
              <div
                key={i}
                dangerouslySetInnerHTML={{ __html: highlight(l) || "&nbsp;" }}
              />
            ))}
            <span className="inline-block h-4 w-1.5 animate-pulse bg-forge align-middle" />
          </pre>
        </div>

        <div className="border-t border-hairline bg-elevated/40 px-4 py-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Test Cases
          </p>
          <div className="space-y-1.5">
            {TESTS.map((t) => (
              <div key={t.label} className="flex items-center gap-2 font-mono text-xs">
                {t.status === "pass" ? (
                  <CheckCircle2 size={13} className="text-cyan shrink-0" />
                ) : t.status === "running" ? (
                  <Loader2 size={13} className="animate-spin text-forge shrink-0" />
                ) : (
                  <Circle size={13} className="text-ink-faint shrink-0" />
                )}
                <span className="text-ink-muted">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
