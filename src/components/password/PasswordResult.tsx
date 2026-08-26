import { Reveal } from "@/components/mesh/Reveal";
import { levelMeta, MIN_LENGTH, type PasswordAnalysis } from "./password-data";
import { CheckCircle2, Lightbulb, ShieldCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordResultProps {
  analysis: PasswordAnalysis;
}

const LEVELS = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"] as const;

export function PasswordResult({ analysis }: PasswordResultProps) {
  const meta = levelMeta[analysis.level];
  const activeIndex = LEVELS.indexOf(analysis.level);

  return (
    <Reveal>
      <section aria-labelledby="password-result-heading" className="scroll-mt-24">
        <div className="surface-card overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/60 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl border",
                  meta.border,
                  meta.bg,
                )}
              >
                <ShieldCheck className={cn("size-5", meta.text)} aria-hidden="true" />
              </span>
              <div>
                <h2 id="password-result-heading" className="text-lg font-semibold sm:text-xl">
                  Strength Analysis
                </h2>
                <p className="text-xs text-muted-foreground">
                  Calculated in your browser — nothing leaves this device
                </p>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors duration-300",
                meta.border,
                meta.bg,
                meta.text,
              )}
              aria-live="polite"
            >
              <span className={cn("size-2 rounded-full", meta.dot)} aria-hidden="true" />
              {analysis.level}
            </span>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium uppercase tracking-wider">Strength score</span>
                <span className={cn("font-display text-base font-bold", meta.text)}>
                  {analysis.score} / 100
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface/70">
                <div
                  className={cn("h-full rounded-full transition-all duration-500 ease-out", meta.bar)}
                  style={{ width: `${Math.max(analysis.score, 4)}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {LEVELS.map((lvl, i) => (
                  <div key={lvl} className="flex flex-col items-center gap-1.5">
                    <span
                      className={cn(
                        "h-1.5 w-full rounded-full transition-colors duration-300",
                        i <= activeIndex ? meta.bar : "bg-border/60",
                      )}
                    />
                    <span
                      className={cn(
                        "hidden text-[10px] transition-colors sm:block",
                        i === activeIndex ? meta.text : "text-muted-foreground/70",
                      )}
                    >
                      {lvl}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Security checks</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {analysis.checks.map((check) => (
                  <li
                    key={check.id}
                    className={cn(
                      "lift-hover flex items-start gap-3 rounded-xl border bg-surface/60 p-4 shadow-[var(--shadow-soft)] transition-colors",
                      check.passed ? "border-accent/30" : "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0",
                        check.passed ? "text-accent" : "text-destructive",
                      )}
                    >
                      {check.passed ? (
                        <CheckCircle2 className="size-4.5" aria-hidden="true" />
                      ) : (
                        <XCircle className="size-4.5" aria-hidden="true" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{check.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {check.hint}
                      </p>
                    </div>
                    <span className="sr-only">{check.passed ? "Passed" : "Not met"}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-foreground">
                <Lightbulb className="size-4" aria-hidden="true" />
                Improvement suggestions
              </h3>
              <ul className="mt-2 space-y-2">
                {analysis.suggestions.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm leading-relaxed text-accent-foreground/90"
                  >
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-accent-foreground/70">
                Guidance target: {MIN_LENGTH}+ characters with mixed case, numbers, and symbols.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
