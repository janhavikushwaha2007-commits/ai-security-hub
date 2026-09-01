import { Reveal } from "@/components/mesh/Reveal";
import {
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Info,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { checkMeta, riskMeta, type CheckStatus, type WebsiteAnalysis } from "./fake-website-data";
import { cn } from "@/lib/utils";

interface FakeWebsiteResultProps {
  result: WebsiteAnalysis;
}

const levelIcon: Record<WebsiteAnalysis["riskLevel"], LucideIcon> = {
  Safe: ShieldCheck,
  Suspicious: AlertTriangle,
  "High Risk": ShieldAlert,
};

const statusIcon: Record<CheckStatus, LucideIcon> = {
  pass: CheckCircle2,
  warn: AlertTriangle,
  fail: XCircle,
};

export function FakeWebsiteResult({ result }: FakeWebsiteResultProps) {
  const meta = riskMeta[result.riskLevel];
  const LevelIcon = levelIcon[result.riskLevel];

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dash = (result.riskScore / 100) * circumference;

  return (
    <Reveal>
      <section aria-labelledby="fake-website-result-heading" className="scroll-mt-24">
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
              <div className="min-w-0">
                <h2 id="fake-website-result-heading" className="text-lg font-semibold sm:text-xl">
                  Demo Result
                </h2>
                <p className="truncate text-xs text-muted-foreground">{result.url}</p>
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
              <span className={cn("size-2 rounded-full", meta.dot)} aria-hidden="true" />
              {result.riskLevel}
            </span>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              <div className="surface-card flex flex-col items-center justify-center gap-3 p-6 text-center">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Risk score
                </span>
                <div className="relative grid size-36 place-items-center">
                  <svg viewBox="0 0 120 120" className="size-36 -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="fill-none stroke-border"
                      strokeWidth="9"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className={cn("fill-none transition-[stroke-dasharray] duration-700 ease-out", meta.ring)}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${dash} ${circumference}`}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="font-display text-3xl font-semibold tracking-tight">
                      {result.riskScore}
                    </p>
                    <p className="text-xs text-muted-foreground">out of 100</p>
                  </div>
                </div>
                <p className={cn("text-sm font-medium", meta.text)}>{result.riskLevel}</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface/60 p-4 shadow-[var(--shadow-soft)] transition-colors hover:border-accent/40">
                <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <Gauge className="size-3.5" aria-hidden="true" />
                  Domain reputation
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {result.reputation.label}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {result.reputation.score}/100
                  </span>
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface/80">
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width] duration-700 ease-out"
                    style={{ width: `${result.reputation.score}%` }}
                  />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {result.reputation.detail}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Security checks
                </h3>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {result.checks.map((check) => {
                    const cMeta = checkMeta[check.status];
                    const StatusIcon = statusIcon[check.status];
                    return (
                      <li
                        key={check.id}
                        className="rounded-2xl border border-border bg-surface/60 p-4 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-lg border",
                              cMeta.border,
                              cMeta.bg,
                            )}
                          >
                            <StatusIcon className={cn("size-4", cMeta.text)} aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{check.label}</p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {check.detail}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Phishing signals
                </h3>
                <ul className="mt-3 space-y-3">
                  {result.signals.map((signal) => (
                    <li
                      key={signal.label}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-surface/60 p-4 shadow-[var(--shadow-soft)] transition-colors hover:border-accent/40"
                    >
                      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{signal.label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {signal.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-surface/50 p-4">
                <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <Info className="size-3.5" aria-hidden="true" />
                  What this means
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {result.explanation}
                </p>
              </div>

              <div
                className={cn(
                  "rounded-2xl border p-4",
                  meta.border,
                  meta.bg,
                )}
              >
                <p className={cn("text-xs font-medium uppercase tracking-[0.14em]", meta.text)}>
                  Recommended actions
                </p>
                <ul className="mt-3 space-y-2">
                  {result.recommendations.map((rec) => (
                    <li key={rec} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
                      <CheckCircle2
                        className={cn("mt-0.5 size-4 shrink-0", meta.text)}
                        aria-hidden="true"
                      />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Demo output only. These findings come from local pattern heuristics in your browser
                and are not verified against a live threat-intelligence database.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
