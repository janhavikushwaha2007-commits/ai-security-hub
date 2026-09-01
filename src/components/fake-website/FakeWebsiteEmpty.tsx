import { Globe2, ScanLine, ShieldCheck } from "lucide-react";

export function FakeWebsiteEmpty() {
  return (
    <section
      aria-labelledby="fake-website-empty-heading"
      className="surface-card flex flex-col items-center justify-center p-8 text-center sm:p-12"
    >
      <span className="grid size-16 place-items-center rounded-2xl border border-border bg-surface/70 shadow-[var(--shadow-soft)]">
        <Globe2 className="size-7 text-muted-foreground" aria-hidden="true" />
      </span>
      <h2 id="fake-website-empty-heading" className="mt-5 text-lg font-semibold sm:text-xl">
        No website analyzed yet
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Paste a website address above and press{" "}
        <span className="inline-flex items-center gap-1 font-medium text-accent">
          <ScanLine className="size-3.5" aria-hidden="true" />
          Analyze Website
        </span>{" "}
        to see a demo risk breakdown, or load one of the example scenarios.
      </p>
      <p className="mt-5 inline-flex items-start gap-2 rounded-xl border border-border bg-surface/50 p-3 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
        The address is checked with local pattern heuristics inside your browser. Nothing is sent to
        a server and no live threat-intelligence database is connected yet.
      </p>
    </section>
  );
}
