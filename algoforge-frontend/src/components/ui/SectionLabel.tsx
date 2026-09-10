export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-hairline bg-elevated/50 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-forge">
      <span className="h-1.5 w-1.5 rounded-full bg-forge animate-pulse-glow" />
      {children}
    </div>
  );
}
