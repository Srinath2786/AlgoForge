import { Trophy } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Card } from "@/components/ui/Card";

export function Contests() {
  return (
    <section id="contests" className="section-shell relative bg-surface py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Practice cadence</SectionLabel>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Build a weekly rhythm that keeps you sharp.
          </h2>
          <p className="mt-4 text-lg text-ink-muted">Set a daily challenge, choose problems from the catalog, and use your contribution graph to turn practice into a lasting habit.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="col-span-full border-forge/20 bg-gradient-to-br from-forge/10 via-surface to-surface p-8 text-center">
            <Trophy className="mx-auto text-forge" size={26} />
            <h3 className="mt-4 font-display text-xl font-semibold">Competitive contests are planned next</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-muted">The current product is focused on problem solving, scheduled daily challenges, submissions, and the global leaderboard. Timed registrations and contest rankings will appear here when they are ready.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
