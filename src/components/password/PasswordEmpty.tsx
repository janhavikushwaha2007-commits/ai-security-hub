import { KeyRound, Lock } from "lucide-react";

export function PasswordEmpty() {
  return (
    <section
      aria-labelledby="password-empty-heading"
      className="surface-card flex flex-col items-center justify-center p-8 text-center sm:p-12"
    >
      <span className="grid size-16 place-items-center rounded-2xl border border-border bg-surface/70 shadow-[var(--shadow-soft)]">
        <KeyRound className="size-7 text-muted-foreground" aria-hidden="true" />
      </span>
      <h2
        id="password-empty-heading"
        className="mt-5 text-lg font-semibold text-foreground sm:text-xl"
      >
        No password entered yet
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Type a password above to see a live strength breakdown. Analysis runs entirely in your
        browser.
      </p>
      <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
        <Lock className="size-3.5" aria-hidden="true" />
        Nothing is stored, logged, or sent anywhere
      </p>
    </section>
  );
}
