import { Link } from "react-router-dom";
import { Flame, Sparkles, ShieldCheck, Trophy } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 py-16">
      <div className="absolute inset-0 bg-forge-glow" />
      <div className="absolute inset-0 grid-fade" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forge/10 blur-[140px]" />

      <div className="relative grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-forge/20 bg-forge/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-forge">
            <Sparkles size={12} /> Full coding workflow
          </div>
          <h1 className="mt-6 max-w-lg font-display text-5xl font-semibold leading-[1.05] tracking-tight">
            Build your <span className="text-gradient-forge">next streak.</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-ink-muted">
            Practice smarter, submit faster, and keep momentum with a workspace built for consistent problem-solving.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: ShieldCheck, text: "Secure authentication and private workspace access" },
              { icon: Trophy, text: "Live leaderboard rankings and streak tracking" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl border border-hairline bg-elevated/55 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-forge/20 bg-forge/10 text-forge">
                  <Icon size={16} />
                </div>
                <p className="text-sm text-ink-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 lg:justify-start">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-forge/30 bg-forge/15 shadow-[0_0_18px_rgba(255,122,61,0.16)]">
              <Flame className="text-forge" size={19} strokeWidth={2.4} />
            </span>
            <span className="font-display text-xl font-semibold">
              Algo<span className="text-forge">Forge</span>
            </span>
          </Link>

          <div className="rounded-[28px] border border-hairline bg-elevated/75 p-7 shadow-[0_18px_60px_rgba(3,6,15,0.6)] backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">Access</p>
                <h2 className="mt-1 font-display text-2xl font-semibold">{title}</h2>
              </div>
              <div className="rounded-full border border-forge/20 bg-forge/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-forge">
                Live
              </div>
            </div>
            <p className="mb-6 text-sm text-ink-muted">{subtitle}</p>
            <div>{children}</div>
          </div>

          <p className="mt-6 text-center text-sm text-ink-muted lg:text-left">{footer}</p>
        </div>
      </div>
    </main>
  );
}
