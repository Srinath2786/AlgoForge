import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Flame, Info } from "lucide-react";
import { DashboardHeatmapDay } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Cell = DashboardHeatmapDay & { dateObj: Date; week: number; day: number };

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDate(value: string) {
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? new Date(value) : d;
}

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfSundayWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function buildWeeks(days: DashboardHeatmapDay[]) {
  const normalized = days
    .map((day) => ({ ...day, dateObj: toDate(day.date) }))
    .filter((day) => !Number.isNaN(day.dateObj.getTime()))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  if (!normalized.length) return { monthGroups: [] as { label: string; weeks: Cell[][] }[] };

  const first = startOfSundayWeek(normalized[0].dateObj);
  const last = startOfSundayWeek(normalized[normalized.length - 1].dateObj);
  const weekCount = Math.floor((last.getTime() - first.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  const lookup = new Map(normalized.map((day) => [localDateKey(day.dateObj), day]));

  const weeks: Cell[][] = Array.from({ length: weekCount }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const date = new Date(first);
      date.setDate(first.getDate() + week * 7 + day);
      const key = localDateKey(date);
      const existing = lookup.get(key);
      return {
        date: key,
        count: existing?.count ?? 0,
        dateObj: date,
        week,
        day,
      };
    })
  );

  const monthGroups: { label: string; weeks: Cell[][] }[] = [];
  weeks.forEach((week) => {
    const label = week[0].dateObj.toLocaleDateString(undefined, { month: "short" });
    const previous = monthGroups[monthGroups.length - 1];
    if (!previous || previous.label !== label) {
      monthGroups.push({ label, weeks: [week] });
    } else {
      previous.weeks.push(week);
    }
  });

  return { monthGroups };
}

function level(count: number) {
  if (count <= 0) return "border-white/[0.07] bg-[#151b29]";
  if (count === 1) return "border-cyan/25 bg-cyan/25 shadow-[inset_0_0_0_1px_rgba(69,217,199,0.08)]";
  if (count <= 3) return "border-forge/35 bg-gradient-to-br from-cyan/55 to-forge/45";
  if (count <= 6) return "border-forge/50 bg-gradient-to-br from-forge/75 to-amber/70 shadow-[0_0_10px_rgba(255,122,61,0.16)]";
  return "border-amber/70 bg-gradient-to-br from-amber to-forge-hot shadow-[0_0_14px_rgba(255,184,77,0.3)]";
}

function calculateStreak(days: DashboardHeatmapDay[]) {
  const counts = new Map(days.map((day) => [day.date, day.count]));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let streak = 0;

  const currentKey = localDateKey(cursor);
  if ((counts.get(currentKey) ?? 0) === 0) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while ((counts.get(localDateKey(cursor)) ?? 0) > 0) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function calculateMaxStreak(days: DashboardHeatmapDay[]) {
  let maxStreak = 0;
  let currentStreak = 0;

  days
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((day) => {
      currentStreak = day.count > 0 ? currentStreak + 1 : 0;
      maxStreak = Math.max(maxStreak, currentStreak);
    });

  return maxStreak;
}

export function ContributionHeatmap({ days }: { days: DashboardHeatmapDay[] }) {
  const [hovered, setHovered] = useState<Cell | null>(null);
  const { monthGroups } = useMemo(() => buildWeeks(days), [days]);
  const streak = useMemo(() => calculateStreak(days), [days]);
  const maxStreak = useMemo(() => calculateMaxStreak(days), [days]);
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const activeDays = days.filter((day) => day.count > 0).length;
  const max = Math.max(0, ...days.map((day) => day.count));

  return (
    <section className="rounded-2xl border border-hairline bg-elevated/55 p-5 shadow-glass sm:p-6" aria-label="Coding activity">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-forge/20 bg-forge/10 text-forge">
              <Activity size={16} />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">Coding activity</h2>
              <p className="text-xs text-ink-faint">Your submissions in the past one year</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-hairline bg-surface px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Submissions</p>
            <p className="mt-0.5 font-display text-lg font-semibold mono-num">{total}</p>
          </div>
          <div className="rounded-xl border border-hairline bg-surface px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Active days</p>
            <p className="mt-0.5 font-display text-lg font-semibold mono-num">{activeDays}</p>
          </div>
          <div className="rounded-xl border border-forge/20 bg-forge/5 px-3 py-2">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-forge">
              <Flame size={11} /> Max streak
            </p>
            <p className="mt-0.5 font-display text-lg font-semibold mono-num">{maxStreak}d</p>
          </div>
        </div>
      </div>

      {total === 0 ? (
        <div className="mt-6 flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-hairline bg-surface/60 px-5 text-center">
          <p className="text-sm font-medium text-ink">Your activity graph starts with one solve.</p>
          <p className="mt-1 max-w-md text-xs leading-5 text-ink-faint">Choose a problem, run your code, and submit it to light up today&apos;s square.</p>
          <Link to="/problems" className="mt-4"><Button variant="outline" size="sm">Find a problem</Button></Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto pb-1">
          <div className="min-w-[800px]">
            <div className="flex gap-2">
              <div className="grid w-9 grid-rows-7 gap-1.5 pt-0.5 text-[9px] leading-3 text-ink-faint">
                {weekdayLabels.map((label, index) => (
                  <span key={label} className={index % 2 === 1 ? "opacity-0" : "opacity-100"}>{label}</span>
                ))}
              </div>

              <div className="flex gap-3">
                {monthGroups.map((month, monthIndex) => (
                  <div key={`${month.label}-${monthIndex}`} className="rounded-xl border border-hairline bg-void/30 p-2">
                    <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{month.label}</p>
                    <div className="flex gap-1">
                      {month.weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-rows-7 gap-1">
                          {week.map((cell) => (
                            <button
                              key={cell.date}
                              type="button"
                              aria-label={`${cell.date}: ${cell.count} submissions`}
                              onMouseEnter={() => setHovered(cell)}
                              onMouseLeave={() => setHovered(null)}
                              className={cn(
                                "h-4 w-4 rounded-[3px] border transition-all duration-200 hover:scale-125 hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-forge/60 focus:ring-offset-2 focus:ring-offset-elevated",
                                level(cell.count)
                              )}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
        <div className="flex items-center gap-2 text-[11px] text-ink-faint">
          <Info size={13} /> Hover a day to inspect activity.
          {max > 0 && <span className="hidden sm:inline">Peak: {max} submissions · Current streak: {streak}d</span>}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-ink-faint">
          <span>Less</span>
          {[0, 1, 3, 6, 7].map((count) => <span key={count} className={cn("h-3.5 w-3.5 rounded-[3px] border", level(count))} />)}
          <span>More</span>
        </div>
      </div>

      {hovered && (
        <div className="pointer-events-none fixed z-[100] hidden rounded-lg border border-hairline bg-surface px-3 py-2 text-xs shadow-2xl sm:block" style={{ left: "50%", bottom: "24px", transform: "translateX(-50%)" }}>
          <p className="font-medium text-ink">{hovered.dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
          <p className="mt-0.5 text-ink-muted"><span className="font-semibold text-forge">{hovered.count}</span> submissions</p>
        </div>
      )}
    </section>
  );
}
