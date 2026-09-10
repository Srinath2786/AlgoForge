import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Compass,
  LayoutDashboard,
  Trophy,
  Shield,
  Cpu,
  Play,
  CheckCircle2,
  BarChart3,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Particles } from "./Particles";
import { HeroCodeEditor } from "./HeroCodeEditor";

export function Hero({
  isLoggedIn = false,
  username,
}: {
  isLoggedIn?: boolean;
  username?: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rX = useTransform(sy, [-40, 40], [6, -6]);
  const rY = useTransform(sx, [-40, 40], [-8, 8]);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouse}
      className="relative flex min-h-screen items-center overflow-hidden bg-void pt-28"
    >
      <div className="absolute inset-0 bg-forge-glow" />
      <div className="absolute inset-0 grid-fade" />
      <Particles />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forge/12 blur-[150px]" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <SectionLabel>Challenge · practice · climb</SectionLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl xl:text-[5.1rem]"
          >
            {isLoggedIn ? (
              <>
                Welcome back,
                <br />
                <span className="text-gradient-forge">{username ?? "coder"}</span>
              </>
            ) : (
              <>
                Learn faster.
                <br />
                Solve smarter. <span className="text-gradient-forge">Win bigger.</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
          >
            {isLoggedIn
              ? "Your dashboard is ready. Open your next challenge, review recent submissions, and keep your ranking momentum moving."
              : "Train with structured problem paths, real code execution, and a leaderboard built for people who want to keep pushing upward."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <Link to={isLoggedIn ? "/dashboard" : "/register"}>
              <Button variant="forge" size="lg" className="w-full sm:w-auto">
                {isLoggedIn ? (
                  <>
                    <LayoutDashboard size={18} /> Open Dashboard
                  </>
                ) : (
                  <>
                    Get Started <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </Link>
            <Link to={isLoggedIn ? "/problems" : "/register"}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Compass size={18} /> {isLoggedIn ? "Explore Problems" : "Start Solving"}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-3 text-sm text-ink-faint"
          >
            <div className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface/70 px-3 py-1.5">
              <CheckCircle2 size={14} className="text-cyan" />
              Real judge runs
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface/70 px-3 py-1.5">
              <BarChart3 size={14} className="text-amber" />
              Live leaderboard
            </div>
            {isLoggedIn && (
              <div className="flex items-center gap-1.5 rounded-full border border-forge/25 bg-forge/10 px-3 py-1.5 text-forge">
                <Trophy size={14} />
                Signed in as <span className="font-semibold">{username ?? "coder"}</span>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          style={{ rotateX: rX, rotateY: rY, transformPerspective: 1000 }}
          className="relative flex justify-center lg:justify-end"
        >
          {isLoggedIn ? (
            <HeroCodeEditor />
          ) : (
            <div className="hero-squircle relative w-full max-w-[560px] overflow-hidden border border-hairline bg-[#0d111b]/90 p-4 shadow-[0_30px_90px_rgba(7,9,14,0.65)]">
              <div className="hero-orb absolute -right-12 -top-10 h-40 w-40 rounded-full bg-forge/20 blur-3xl" />
              <div className="hero-orb absolute -bottom-8 left-12 h-32 w-32 rounded-full bg-cyan/15 blur-3xl" />

              <div className="relative rounded-[26px] border border-white/10 bg-[#111827]/80 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-hairline pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[22px] border border-hairline bg-surface/70 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                        Problem
                      </span>
                      <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-[10px] text-cyan">
                        Medium
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs text-ink-faint">Two Sum</p>
                        <h3 className="mt-1 font-display text-2xl font-semibold">Hash map path</h3>
                      </div>

                      <div className="rounded-xl border border-hairline bg-[#0b1220] p-3 font-mono text-[11px] leading-6 text-ink">
                        <div className="text-violet">class</div>
                        <div className="mt-1 text-cyan">Solution</div>
                        <div className="mt-2 text-ink-muted">{`for (int i = 0; i < nums.length; i++) {`}</div>
                        <div className="mt-1 pl-3 text-ink-muted">{`int need = target - nums[i];`}</div>
                        <div className="mt-1 pl-3 text-ink-muted">{`if (seen.containsKey(need))`}</div>
                        <div className="mt-1 pl-6 text-amber">{`return new int[]{...};`}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[22px] border border-hairline bg-surface/70 p-4">
                      <div className="flex items-center justify-between text-xs text-ink-faint">
                        <span>Completion</span>
                        <span className="font-semibold text-forge">84%</span>
                      </div>
                      <div className="mt-3 h-2.5 rounded-full bg-white/5">
                        <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-forge via-amber to-cyan" />
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-xl border border-hairline bg-elevated/40 p-2">
                          <div className="font-display text-xl font-semibold text-cyan">18</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-faint">Easy</div>
                        </div>
                        <div className="rounded-xl border border-hairline bg-elevated/40 p-2">
                          <div className="font-display text-xl font-semibold text-amber">12</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-faint">Med</div>
                        </div>
                        <div className="rounded-xl border border-hairline bg-elevated/40 p-2">
                          <div className="font-display text-xl font-semibold text-violet">5</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-faint">Hard</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-hairline bg-surface/70 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Fresh streak</p>
                          <p className="mt-2 font-display text-3xl font-semibold text-gradient-forge">12 days</p>
                        </div>
                        <div className="rounded-2xl border border-forge/30 bg-forge/10 p-2 text-forge">
                          <TrendingUp size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[22px] border border-dashed border-hairline bg-[#0b1220]/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                        Ready to start
                      </p>
                      <p className="mt-1 font-display text-xl font-semibold">Sign in and open your workspace</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
