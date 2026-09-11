import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

interface Props {
  easy: number;
  medium: number;
  hard: number;
}

const rows = [
  { key: "easy", label: "Easy", tone: "text-cyan", bg: "bg-cyan", valueKey: "easy" },
  { key: "medium", label: "Medium", tone: "text-amber", bg: "bg-amber", valueKey: "medium" },
  { key: "hard", label: "Hard", tone: "text-violet", bg: "bg-violet", valueKey: "hard" },
] as const;

export function DifficultyProgress({ easy, medium, hard }: Props) {
  const values = { easy, medium, hard };
  const total = easy + medium + hard;
  const easyAngle = total ? (easy / total) * 360 : 0;
  const mediumAngle = total ? (medium / total) * 360 : 0;
  const mediumEnd = easyAngle + mediumAngle;
  const distribution = total
    ? `conic-gradient(#45d9c7 0deg ${easyAngle}deg, #f4b740 ${easyAngle}deg ${mediumEnd}deg, #9a83ff ${mediumEnd}deg 360deg)`
    : "conic-gradient(#1a2230 0deg 360deg)";

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold">Difficulty progress</h2>
          <p className="mt-1 text-xs text-ink-faint">Your solved distribution</p>
        </div>
        <span className="rounded-lg border border-hairline bg-surface px-2.5 py-1.5 text-xs font-semibold mono-num">{total} solved</span>
      </div>
      <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-hairline bg-surface/55 p-4 sm:flex-row sm:items-center">
        <div className="relative mx-auto h-24 w-24 shrink-0 rounded-full p-2 sm:mx-0" style={{ background: distribution }}>
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-hairline bg-elevated">
            <span className="font-display text-xl font-semibold mono-num">{total}</span>
            <span className="text-[9px] uppercase tracking-[0.14em] text-ink-faint">solved</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2.5">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-ink-muted">
                <span className={cn("h-2 w-2 rounded-full", row.bg)} /> {row.label}
              </span>
              <span className="font-semibold text-ink mono-num">{values[row.valueKey]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {rows.map((row) => {
          const value = values[row.valueKey];
          const percentage = total ? Math.round((value / total) * 100) : 0;
          return (
            <div key={row.key}>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className={cn("font-semibold", row.tone)}>{row.label}</span>
                <span className="text-ink-muted"><b className="text-ink mono-num">{value}</b> · {percentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <div className={cn("h-full rounded-full transition-all", row.bg)} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
