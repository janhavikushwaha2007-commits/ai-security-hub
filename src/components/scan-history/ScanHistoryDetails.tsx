import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { X, ShieldAlert, ArrowRight } from "lucide-react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { cn } from "@/lib/utils";
import {
  formatTimestamp,
  riskBadgeClass,
  scanTypeIcons,
  scanTypeRoutes,
  statusBadgeClass,
  type ScanHistoryRecord,
} from "./scan-history-data";

interface Props {
  record: ScanHistoryRecord | null;
  onClose: () => void;
}

export function ScanHistoryDetails({ record, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!record) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [record, onClose]);

  if (!record) return null;

  const Icon = scanTypeIcons[record.type];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-detail-title"
        className="motion-safe:animate-in motion-safe:slide-in-from-right relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-border bg-background shadow-[var(--shadow-soft)] duration-300"
      >
        <div className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-accent">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Demo record · {record.type}
            </p>
            <h2 id="scan-detail-title" className="mt-1 truncate text-base font-semibold">
              {record.label}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="press-3d grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-6">
          <div className="surface-card flex items-center gap-5 p-5">
            <div className="relative grid size-20 shrink-0 place-items-center">
              <svg viewBox="0 0 100 100" className="size-20 -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r="42" className="fill-none stroke-border" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={cn(
                    "fill-none transition-[stroke-dashoffset] duration-700",
                    record.riskLevel === "Safe"
                      ? "stroke-accent"
                      : record.riskLevel === "Suspicious"
                        ? "stroke-primary"
                        : "stroke-destructive",
                  )}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - record.riskScore / 100)}
                />
              </svg>
              <span className="absolute text-lg font-semibold">{record.riskScore}</span>
            </div>
            <div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                  riskBadgeClass[record.riskLevel],
                )}
              >
                {record.riskLevel}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">Risk score {record.riskScore}/100</p>
              <span
                className={cn(
                  "mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs",
                  statusBadgeClass[record.status],
                )}
              >
                {record.status}
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Scan type</dt>
              <dd className="mt-1 font-medium">{record.type}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Timestamp</dt>
              <dd className="mt-1 font-medium">{formatTimestamp(record.timestamp)}</dd>
            </div>
          </dl>

          <div>
            <h3 className="text-sm font-semibold">Detected signals</h3>
            <ul className="mt-3 space-y-2">
              {record.signals.map((signal) => (
                <li
                  key={signal}
                  className="flex items-start gap-2.5 rounded-xl border border-border bg-surface/50 px-3 py-2.5 text-sm text-muted-foreground"
                >
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {signal}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Explanation</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{record.explanation}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Recommended action</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {record.recommendation}
            </p>
          </div>

          <p className="rounded-xl border border-border bg-surface/50 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            Demo data. This record is sample content for interface preview only — it is not a real
            scan, and no message text, file contents, or passwords are stored.
          </p>

          <MeshButton variant="outline" className="w-full" asChild>
            <Link to={scanTypeRoutes[record.type]}>
              Open {record.type} scanner
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </MeshButton>
        </div>
      </div>
    </div>
  );
}
