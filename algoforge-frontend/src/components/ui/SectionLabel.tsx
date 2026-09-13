export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3 py-1 text-[10px] font-medium tracking-[0.12em] text-forge shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="h-1.5 w-1.5 rounded-full bg-forge animate-pulse-glow" />
      {children}
    </div>
  );
}
