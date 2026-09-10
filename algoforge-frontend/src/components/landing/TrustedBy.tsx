const SIGNALS = ["Monaco editor", "Docker sandbox", "Hidden test cases", "JWT security", "Progress dashboard", "Live leaderboard"];

export function TrustedBy() {
  const loop = [...SIGNALS, ...SIGNALS];
  return (
    <section className="relative border-y border-hairline-soft bg-surface/60 py-10">
      <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
        Built for serious coding practice
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface to-transparent" />
        <div className="marquee-track flex w-max gap-16 py-1">
          {loop.map((name, i) => (
            <span
              key={i}
              className="font-display text-2xl font-semibold tracking-tight text-ink-faint/70 transition-colors hover:text-ink"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
