import { useEffect, useRef } from "react";
import { CheckCircle2, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatReportDate, reportRiskClass, type ReportRecord } from "./reports-alerts-data";

interface Props {
  report: ReportRecord | null;
  onClose: () => void;
}

export function ReportDetails({ report, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!report) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [report, onClose]);

  if (!report) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" aria-label="Close report details" onClick={onClose} className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div role="dialog" aria-modal="true" aria-labelledby="report-detail-title" className="motion-safe:animate-in motion-safe:slide-in-from-right relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-border bg-background shadow-[var(--shadow-soft)] duration-300">
        <div className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-accent">
            <ShieldAlert className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">DEMO REPORT · {report.type}</p>
            <h2 id="report-detail-title" className="mt-1 text-base font-semibold">{report.title}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close report details" className="press-3d grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground transition-colors hover:text-foreground">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-6 px-5 py-6 sm:px-6">
          <div className="surface-card flex items-center gap-5 p-5">
            <div className="relative grid size-20 shrink-0 place-items-center">
              <svg viewBox="0 0 100 100" className="size-20 -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r="42" className="fill-none stroke-border" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" className={cn("fill-none", report.riskLevel === "Safe" ? "stroke-accent" : report.riskLevel === "Suspicious" ? "stroke-primary" : "stroke-destructive")} strokeWidth="9" strokeLinecap="round" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - report.riskScore / 100)} />
              </svg>
              <span className="absolute text-lg font-semibold">{report.riskScore}</span>
            </div>
            <div>
              <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", reportRiskClass[report.riskLevel])}>{report.riskLevel}</span>
              <p className="mt-2 text-sm text-muted-foreground">DEMO risk score · {report.riskScore}/100</p>
              <time dateTime={report.date} className="mt-1 block text-xs text-muted-foreground">{formatReportDate(report.date)}</time>
            </div>
          </div>
          <section>
            <h3 className="text-sm font-semibold">Findings</h3>
            <ul className="mt-3 space-y-2">
              {report.findings.map((finding) => (
                <li key={finding} className="flex items-start gap-2.5 rounded-xl border border-border bg-surface/50 px-3 py-2.5 text-sm text-muted-foreground">
                  {report.riskLevel === "Safe" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" /> : <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />}
                  {finding}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-sm font-semibold">Explanation</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{report.explanation}</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold">Recommended actions</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
              {report.recommendedActions.map((action) => <li key={action}>{action}</li>)}
            </ul>
          </section>
          <p className="rounded-xl border border-border bg-surface/50 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            Demo data only. This sample report is not based on a real scan, user, or security alert.
          </p>
        </div>
      </div>
    </div>
  );
}