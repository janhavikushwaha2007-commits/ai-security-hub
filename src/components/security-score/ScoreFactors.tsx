import { Link } from "@tanstack/react-router";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Reveal } from "@/components/mesh/Reveal";
import { cn } from "@/lib/utils";
import { factorStatusMeta, type ScoreFactor } from "./security-score-data";

interface ScoreFactorsProps {
  factors: ScoreFactor[];
}

export function ScoreFactors({ factors }: ScoreFactorsProps) {
  if (factors.length === 0) {
    return (
      <Reveal>
        <section className="surface-card p-8 text-center">
          <h2 className="text-lg font-semibold">No scoring factors yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Factor breakdowns will appear here once scan data is available.
          </p>
        </section>
      </Reveal>
    );
  }

  return (
    <section aria-labelledby="score-factors-heading" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="score-factors-heading" className="text-xl font-semibold sm:text-2xl">
            Score Breakdown
          </h2>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Demo data
          </span>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {factors.map((factor, i) => {
          const meta = factorStatusMeta[factor.status];
          const contribution = Math.round((factor.rating * factor.weight) / 100);
          return (
            <Reveal key={factor.id} delay={i * 70}>
              <article className="surface-card lift-hover h-full p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl border",
                        meta.border,
                        meta.bg,
                      )}
                    >
                      <factor.icon className={cn("size-5", meta.text)} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{factor.label}</h3>
                      <p className="text-xs text-muted-foreground">
                        Weight {factor.weight}% · contributes {contribution} of {factor.weight}{" "}
                        points
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      meta.border,
                      meta.bg,
                      meta.text,
                    )}
                  >
                    {factor.status}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Current rating</span>
                    <span className="font-medium text-foreground">{factor.rating}/100</span>
                  </div>
                  <div
                    className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border/50"
                    role="progressbar"
                    aria-valuenow={factor.rating}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${factor.label} demo rating`}
                  >
                    <span
                      className="block h-full rounded-full bg-[image:var(--gradient-brand)] motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out"
                      style={{ width: `${factor.rating}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {factor.explanation}
                </p>

                <p className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-surface/50 p-3 text-sm text-muted-foreground">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{factor.suggestion}</span>
                </p>

                <Link
                  to={factor.actionTo}
                  className="press-3d mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-surface/70 px-3 py-2 text-xs font-medium shadow-[var(--shadow-soft)] transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {factor.actionLabel}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
