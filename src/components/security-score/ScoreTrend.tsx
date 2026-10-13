import { Reveal } from "@/components/mesh/Reveal";
import { demoTrend } from "./security-score-data";

export function ScoreTrend() {
  const scores = demoTrend.map((p) => p.score);
  const min = Math.min(...scores) - 6;
  const max = Math.max(...scores) + 4;
  const range = Math.max(max - min, 1);
  const change = (scores[scores.length - 1] ?? 0) - (scores[0] ?? 0);

  return (
    <Reveal>
      <section aria-labelledby="score-trend-heading" className="surface-card lift-hover p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="score-trend-heading" className="text-xl font-semibold sm:text-2xl">
              7-Day Score Trend
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Illustrative sample values — not a record of real activity.
            </p>
          </div>
          <span className="rounded-full border border-border bg-surface/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Demo data
          </span>
        </div>

        <div className="mt-6 flex h-44 items-end gap-2 sm:gap-4">
          {demoTrend.map((point, i) => {
            const height = ((point.score - min) / range) * 100;
            return (
              <div key={point.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{point.score}</span>
                <div className="flex h-full w-full items-end">
                  <span
                    className="w-full rounded-t-lg bg-[image:var(--gradient-brand)] opacity-90 shadow-[var(--shadow-soft)] motion-safe:animate-[fade-in_0.5s_ease-out_both]"
                    style={{ height: `${height}%`, animationDelay: `${i * 70}ms` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{point.label}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          Sample change across the week:{" "}
          <span className="font-medium text-accent">
            {change >= 0 ? "+" : ""}
            {change} points
          </span>
        </p>
      </section>
    </Reveal>
  );
}
