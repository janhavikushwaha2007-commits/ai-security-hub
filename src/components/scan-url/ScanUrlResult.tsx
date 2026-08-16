import { Reveal } from "@/components/mesh/Reveal";
import { demoUrlResult, riskMeta, type DemoUrlResult } from "./scan-url-data";
import { AlertTriangle, CheckCircle2, Globe2, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanUrlResultProps {
  result?: DemoUrlResult;
}

const levelIcon: Record<DemoUrlResult["riskLevel"], typeof AlertTriangle> = {
  Safe: ShieldCheck,
  Suspicious: AlertTriangle,
  "High Risk": ShieldAlert,
};

export function ScanUrlResult({ result = demoUrlResult }: ScanUrlResultProps) {
  const meta = riskMeta[result.riskLevel];
  const LevelIcon = levelIcon[result.riskLevel];

  return (
    <Reveal>
      <section aria-labelledby="url-result-heading" className="scroll-mt-24">
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
                <LevelIcon className={cn("size-5", meta.text)} aria-hidden="true" />
              </span>
              <div>
                <h2 id="url-result-heading" className="text-lg font-semibold sm:text-xl">
                  Demo Result
                </h2>
                <p className="text-xs text-muted-foreground">
                  Simulated output for frontend preview
                </p>
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
              {result.riskLevel}
            </span>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[280px_1fr]">
            <div className="space-y-6">
              <div className="surface-card flex flex-col items-center justify-center gap-2 p-6 text-center">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Risk Score
                </span>
                <div className="relative flex size-36 items-center justify-center rounded-full border-8 border-border/40">
                  <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-border/40"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.riskScore / 100) * 264} 264`}
                      className={cn("transition-all duration-700", meta.text)}
                    />
                  </svg>
                  <div className="relative">
                    <span className={cn("font-display text-4xl font-bold", meta.text)}>
                      {result.riskScore}
                    </span>
                    <span className="block text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <span className={cn("text-sm font-medium", meta.text)}>{meta.label}</span>
              </div>

              <div className="surface-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Info className="size-4 text-accent" aria-hidden="true" />
                  What this means
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {result.explanation}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground">URL analysis signals</h3>
                <ul className="mt-4 grid gap-3">
                  {result.signals.map((signal, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-4 shadow-[var(--shadow-soft)]"
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Globe2 className="size-3.5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">{signal.label}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                          {signal.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-foreground">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Recommended action
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-accent-foreground/90">
                  {result.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
