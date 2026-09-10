import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Play, UploadCloud, CheckCircle2, XCircle } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const DEFAULT_CODE = `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }
}`;

const CONSOLE_LINES = [
  { ok: true, text: 'Case 1 ✓  Input: "()[]{}"  →  true' },
  { ok: true, text: 'Case 2 ✓  Input: "(]"  →  false' },
  { ok: true, text: 'Case 3 ✓  Input: "([)]"  →  false' },
];

export function LivePreview() {
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);

  function handleRun() {
    setRunning(true);
    setRan(false);
    setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 1100);
  }

  return (
    <section className="relative bg-surface py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>See it in action</SectionLabel>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            A real IDE, right in your browser.
          </h2>
          <p className="mt-4 text-lg text-ink-muted">
            Monaco-powered editor, instant compilation, and a live console.
            This is the exact environment you’ll use once you sign in.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-14 overflow-hidden rounded-2xl border border-hairline bg-void shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
            <div className="border-b border-hairline p-6 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex items-center gap-2">
                <Badge className="border-cyan/30 bg-cyan/10 text-cyan">Easy</Badge>
                <Badge className="border-hairline text-ink-muted">Stack</Badge>
                <Badge className="border-hairline text-ink-muted">String</Badge>
              </div>
              <h3 className="font-display text-xl font-semibold">20. Valid Parentheses</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Given a string <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-xs text-forge">s</code>
                containing only <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-xs text-forge">(){"{}"}[]</code>,
                determine whether the input is valid. Brackets must close in the correct order.
              </p>
              <div className="mt-5 space-y-2 font-mono text-xs text-ink-faint">
                <p>Constraints:</p>
                <p>1 ≤ s.length ≤ 10⁴</p>
                <p>s consists only of bracket characters</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
                <span className="font-mono text-xs text-ink-faint">Solution.java</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRun} disabled={running}>
                    <Play size={14} /> {running ? "Running..." : "Run Code"}
                  </Button>
                  <Button variant="forge" size="sm" onClick={handleRun} disabled={running}>
                    <UploadCloud size={14} /> Submit
                  </Button>
                </div>
              </div>

              <div className="h-[260px]">
                <MonacoEditor
                  language="java"
                  theme="vs-dark"
                  value={DEFAULT_CODE}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontFamily: "var(--font-mono)",
                    padding: { top: 16 },
                  }}
                />
              </div>

              <div className="border-t border-hairline bg-elevated/40 p-5">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  Console
                </p>
                {!ran && !running && (
                  <p className="font-mono text-xs text-ink-faint">
                    Press &quot;Run Code&quot; to execute against sample test cases.
                  </p>
                )}
                {running && <p className="font-mono text-xs text-forge">Compiling...</p>}
                {ran && (
                  <div className="space-y-1.5">
                    {CONSOLE_LINES.map((l) => (
                      <div key={l.text} className="flex items-center gap-2 font-mono text-xs">
                        {l.ok ? (
                          <CheckCircle2 size={13} className="shrink-0 text-cyan" />
                        ) : (
                          <XCircle size={13} className="shrink-0 text-danger" />
                        )}
                        <span className="text-ink-muted">{l.text}</span>
                      </div>
                    ))}
                    <p className="pt-2 font-mono text-xs font-semibold text-cyan">
                      All test cases passed · Runtime 38ms
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
