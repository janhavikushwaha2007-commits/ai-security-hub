import { HardDrive, Lock, ShieldCheck, Files } from "lucide-react";
import {
  STORAGE_QUOTA_BYTES,
  STORAGE_QUOTA_MB,
  formatFileSize,
  type StoredFile,
} from "./secure-storage-data";

interface StorageUsageProps {
  files: StoredFile[];
}

export function StorageUsage({ files }: StorageUsageProps) {
  const used = files.reduce((total, file) => total + file.size, 0);
  const percent = Math.min(100, (used / STORAGE_QUOTA_BYTES) * 100);
  const safeCount = files.filter((file) => file.status === "Scanned / Safe").length;
  const reviewCount = files.filter((file) => file.status === "Needs Review").length;

  const stats = [
    { label: "Files stored", value: String(files.length), icon: Files },
    { label: "Scanned / Safe", value: String(safeCount), icon: ShieldCheck },
    { label: "Needs review", value: String(reviewCount), icon: Lock },
  ];

  return (
    <section aria-labelledby="storage-usage-heading" className="surface-card lift-hover p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-accent shadow-[var(--shadow-soft)]">
            <HardDrive className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="storage-usage-heading" className="text-lg font-semibold sm:text-xl">
              Storage usage
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Demo vault allowance of {STORAGE_QUOTA_MB} MB — usage is calculated in your browser.
            </p>
          </div>
        </div>
        <p className="font-display text-2xl font-semibold tracking-tight">
          {formatFileSize(used)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            / {STORAGE_QUOTA_MB} MB
          </span>
        </p>
      </div>

      <div
        className="mt-6 h-2.5 overflow-hidden rounded-full bg-surface/70"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Storage used"
      >
        <div
          className="h-full rounded-full bg-[image:var(--gradient-brand)] shadow-[var(--shadow-glow)] transition-[width] duration-700 ease-out"
          style={{ width: `${Math.max(percent, files.length ? 2 : 0)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {percent.toFixed(1)}% of the demo allowance used
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface/60 p-4 shadow-[var(--shadow-soft)] transition-colors hover:border-accent/40"
          >
            <span className="grid size-9 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground">
              <stat.icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold leading-none">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
