import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldHalf } from "lucide-react";

export function AuthHeader() {
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
        <p className="hidden font-display text-sm text-muted-foreground sm:block">Account Access</p>

        <div className="ml-auto">
          <Link
            to="/"
            className="press-3d inline-flex items-center gap-2 rounded-lg border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </header>
  );
}
