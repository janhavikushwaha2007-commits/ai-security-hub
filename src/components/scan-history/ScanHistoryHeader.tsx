import { Link } from "@tanstack/react-router";
import { ArrowLeft, History, ShieldHalf, Settings, UserRound } from "lucide-react";

export function ScanHistoryHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-brand)] shadow-[var(--shadow-glow)]">
            <ShieldHalf className="size-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-sm font-semibold uppercase tracking-[0.16em]">
            AI Security Mesh
          </span>
        </Link>

        <span aria-hidden="true" className="hidden h-6 w-px bg-border sm:block" />
        <p className="hidden font-display text-sm text-muted-foreground sm:block">Scan History</p>

        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-accent shadow-[var(--shadow-soft)]">
            <span className="relative grid size-2 place-items-center">
              <span className="animate-pulse-orb absolute size-2 rounded-full bg-accent" />
              <span className="size-1.5 rounded-full bg-accent" />
            </span>
            Protected
          </span>
          <button
            type="button"
            aria-label="Settings"
            className="press-3d grid size-10 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground"
          >
            <Settings className="size-4.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Profile"
            className="press-3d grid size-10 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground"
          >
            <UserRound className="size-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="border-t border-border/60 bg-surface/40">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-5 py-2.5 sm:px-8">
          <Link
            to="/dashboard"
            className="press-3d inline-flex items-center gap-2 rounded-lg border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to Dashboard
          </Link>
          <Link
            to="/scan-center"
            className="press-3d inline-flex items-center gap-2 rounded-lg border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground"
          >
            Go to Scan Center
          </Link>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <History className="size-3.5" aria-hidden="true" />
            Sample record archive
          </span>
        </div>
      </div>
    </header>
  );
}
