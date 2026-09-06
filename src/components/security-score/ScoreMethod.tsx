import { Reveal } from "@/components/mesh/Reveal";
import { Info } from "lucide-react";
import { scoringSteps } from "./security-score-data";

export function ScoreMethod() {
  return (
    <Reveal>
      <section
        aria-labelledby="score-method-heading"
        className="surface-card lift-hover p-5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface/60">
            <Info className="size-5 text-primary" aria-hidden="true" />
          </span>
          <h2 id="score-method-heading" className="text-xl font-semibold sm:text-2xl">
            How your score is calculated
          </h2>
        </div>

        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {scoringSteps.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-border bg-surface/50 p-4">
              <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Step {i + 1}
              </span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
            </li>
          ))}
        </ol>

        <p className="mt-5 rounded-xl border border-border bg-surface/50 p-4 text-sm leading-relaxed text-muted-foreground">
          The demo calculation is fixed and reproducible: the same sample ratings always produce the
          same score. When real account data is connected, these sample ratings are replaced with
          measured results and the score becomes personal to you.
        </p>
      </section>
    </Reveal>
  );
}
