import { useEffect, useState } from "react";
import { Reveal } from "@/components/mesh/Reveal";
import { cn } from "@/lib/utils";
import { bandMeta, type ScoreResult } from "./security-score-data";

interface ScoreGaugeProps {
  result: ScoreResult;
}

const CIRCUMFERENCE = 2 * Math.PI * 42;

export function ScoreGauge({ result }: ScoreGaugeProps) {
  const meta = bandMeta[result.band];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(result.score);
      return;
    }
    const id = window.setTimeout(() => setProgress(result.score), 80);
    return () => window.clearTimeout(id);
  }, [result.score]);

  return (
    <Reveal>
      <section aria-labelledby="score-gauge-heading" className="surface-card lift-hover p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,240px)_1fr] lg:items-center">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Overall Score
            </span>
            <div
              className="relative flex size-44 items-center justify-center sm:size-52"
              role="img"
              aria-label={`Demo security score ${result.score} out of 100 — ${result.band}`}
            >
              <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-border/50"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={cn("motion-safe:transition-[stroke-dashoffset]", meta.stroke)}
                  style={{
                    strokeDasharray: CIRCUMFERENCE,
                    strokeDashoffset: CIRCUMFERENCE * (1 - progress / 100),
                    transitionDuration: "1200ms",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  {result.score}
                </span>
                <span className="text-xs text-muted-foreground">out of 100</span>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold",
                meta.border,
                meta.bg,
                meta.text,
              )}
            >
              <span className={cn("size-2 rounded-full", meta.dot)} />
              {result.band}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="score-gauge-heading" className="text-xl font-semibold sm:text-2xl">
                Demo Security Score
              </h2>
              <span className="rounded-full border border-border bg-surface/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Demo data
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{meta.summary}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This number is calculated from fixed sample values in the interface preview. It does
              not represent a real security posture — a real score will appear once account data
              and live detection services are connected.
            </p>
            <dl className="grid gap-3 sm:grid-cols-3">
              {result.factors.slice(0, 3).map((factor) => (
                <div key={factor.id} className="rounded-xl border border-border bg-surface/50 p-3">
                  <dt className="text-xs text-muted-foreground">{factor.label}</dt>
                  <dd className="mt-1 font-display text-lg font-semibold">{factor.rating}/100</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
