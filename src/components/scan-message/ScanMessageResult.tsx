import { Reveal } from "@/components/mesh/Reveal";
import { riskMeta, type DemoResult } from "./scan-message-data";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScanResult } from "@/lib/api";

interface ScanMessageResultProps {
  result: ScanResult;
}

type RiskLevel = DemoResult["riskLevel"];

const levelIcon: Record<RiskLevel, typeof AlertTriangle> = {
  Safe: ShieldCheck,
  Suspicious: AlertTriangle,
  "High Risk": ShieldAlert,
};

function mapRiskLevel(level: string): RiskLevel {
  if (level === "Safe") return "Safe";
  if (level === "Suspicious") return "Suspicious";
  return "High Risk";
}

export function ScanMessageResult({ result }: ScanMessageResultProps) {
  const riskLevel = mapRiskLevel(result.risk_level);
  const meta = riskMeta[riskLevel];
  const LevelIcon = levelIcon[riskLevel];
  const signals = result.reasons.map((reason, i) => ({
    label: `Signal ${i + 1}`,
    description: reason,
  }));

  return (
    <Reveal>
      <section aria-labelledby="result-heading" className="scroll-mt-24">
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
                <h2 id="result-heading" className="text-lg font-semibold sm:text-xl">
                  Analysis Result
                </h2>
                <p className="text-xs text-muted-foreground">{result.mode}</p>
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
              {riskLevel}
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
                      strokeDasharray={`${(result.risk_score / 100) * 264} 264`}
                      className={cn("transition-all duration-700", meta.text)}
                    />
                  </svg>
                  <div className="relative">
                    <span className={cn("font-display text-4xl font-bold", meta.text)}>
                      {result.risk_score}
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
                  {riskLevel === "High Risk"
                    ? "This message shows several scam patterns. Do not click any links or share personal information."
                    : riskLevel === "Suspicious"
                      ? "This message has some warning signs. Verify through an official channel before taking action."
                      : "No significant scam patterns detected, but always be cautious with unexpected messages."}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Detected warning signals</h3>
                <ul className="mt-4 grid gap-3">
                  {signals.map((signal, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-4 shadow-[var(--shadow-soft)]"
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <AlertTriangle className="size-3.5" aria-hidden="true" />
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
                  {riskLevel === "High Risk"
                    ? "Do not click any links or make payments. Contact the organisation directly through its official website or app, then delete the message."
                    : riskLevel === "Suspicious"
                      ? "Do not click links or share details. Verify with the sender through an official channel before acting."
                      : "No action needed, but remain cautious with any unexpected messages asking for personal information."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
