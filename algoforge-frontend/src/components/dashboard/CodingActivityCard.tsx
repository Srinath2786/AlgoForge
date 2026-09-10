import { useEffect, useState } from "react";
import { Activity, CalendarDays, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CodingActivityResponse } from "@/types/api";
import { cn } from "@/lib/utils";

interface Props {
  activity?: CodingActivityResponse;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function CodingActivityCard({ activity, isLoading, isError, onRetry }: Props) {
  const months = activity?.months ?? [];
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  const month = months[selectedMonthIndex] ?? months[months.length - 1];
  const weeks = month?.weeks ?? [];
  const week = weeks[selectedWeekIndex] ?? weeks[weeks.length - 1];

  const days = week?.days ?? [];
  const totalSubmissions = months.reduce((sum, item) => sum + item.totalSubmissions, 0);
  const totalAccepted = months.reduce((sum, item) => sum + item.acceptedSubmissions, 0);
  const currentMonth = month ?? null;

  useEffect(() => {
    if (months.length === 0) return;
    setSelectedMonthIndex((prev) => Math.min(prev, months.length - 1));
  }, [months.length]);

  useEffect(() => {
    if (weeks.length === 0) return;
    setSelectedWeekIndex((prev) => Math.min(prev, weeks.length - 1));
  }, [weeks.length]);

  if (isLoading) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="h-64 animate-pulse rounded-xl bg-surface/70" />
      </Card>
    );
  }

  if (isError || !months.length) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold">Daily coding activity</h2>
            <p className="mt-1 text-xs text-ink-faint">Real activity from your submissions</p>
          </div>
          <Activity className="text-ink-faint" size={17} />
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-hairline bg-surface/60 p-6 text-center text-sm text-ink-faint">
          {isError ? "We couldn't load your activity history." : "Your activity history will appear after your first submission."}
          {onRetry && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-5 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-forge/20 bg-forge/10 text-forge">
            <CalendarDays size={18} />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold">Daily coding activity</h2>
            <p className="text-xs text-ink-faint">Real data from your accepted and submitted solutions</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-hairline bg-surface px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Total submissions</p>
            <p className="mt-0.5 font-display text-lg font-semibold mono-num">{totalSubmissions}</p>
          </div>
          <div className="rounded-xl border border-forge/20 bg-forge/5 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-forge">Accepted</p>
            <p className="mt-0.5 font-display text-lg font-semibold mono-num">{totalAccepted}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 xl:flex-row">
        <div className="w-full xl:w-[220px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Month</span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedMonthIndex((prev) => Math.max(0, prev - 1))}
                disabled={selectedMonthIndex === 0}
                aria-label="Previous month"
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedMonthIndex((prev) => Math.min(months.length - 1, prev + 1))}
                disabled={selectedMonthIndex >= months.length - 1}
                aria-label="Next month"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-hairline bg-surface/70 p-2">
            {months.map((item, index) => (
              <button
                key={item.monthKey}
                type="button"
                onClick={() => setSelectedMonthIndex(index)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  selectedMonthIndex === index
                    ? "bg-forge/10 text-forge ring-1 ring-forge/30"
                    : "text-ink-muted hover:bg-surface"
                )}
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs">{item.totalSubmissions}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-hairline bg-surface/60 p-4">
          {currentMonth && (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Selected month</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{currentMonth.label}</h3>
                </div>
                <div className="rounded-lg border border-hairline bg-elevated px-3 py-2 text-right">
                  <p className="text-[10px] text-ink-faint">Accepted</p>
                  <p className="font-display text-base font-semibold mono-num">{currentMonth.acceptedSubmissions}</p>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Week</span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setSelectedWeekIndex((prev) => Math.max(0, prev - 1))}
                    disabled={selectedWeekIndex === 0}
                    aria-label="Previous week"
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setSelectedWeekIndex((prev) => Math.min(weeks.length - 1, prev + 1))}
                    disabled={selectedWeekIndex >= weeks.length - 1}
                    aria-label="Next week"
                  >
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {weeks.map((item, index) => (
                  <button
                    key={`${item.label}-${index}`}
                    type="button"
                    onClick={() => setSelectedWeekIndex(index)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      selectedWeekIndex === index
                        ? "border-forge/30 bg-forge/10 text-forge"
                        : "border-hairline bg-surface text-ink-muted"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {days.map((day) => (
                  <div key={day.date} className="rounded-xl border border-hairline bg-elevated/70 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-ink-muted">{day.label}</span>
                      <span className="rounded-full bg-forge/10 px-2 py-0.5 text-[10px] font-medium text-forge">{day.totalSubmissions}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-ink-faint">
                      <div>
                        <p>Accepted</p>
                        <p className="font-display text-sm font-semibold text-ink">{day.acceptedSubmissions}</p>
                      </div>
                      <div>
                        <p>Solved</p>
                        <p className="font-display text-sm font-semibold text-ink">{day.problemsSolved}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-hairline pt-4 text-[11px] text-ink-faint">
                <Info size={13} />
                Hover over or inspect each day to see detailed coding stats for the selected week.
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
