import { FileSearch2, ScanLine } from "lucide-react";

export function ScanFileEmpty() {
  return (
    <section
      aria-labelledby="empty-state-heading"
      className="surface-card flex flex-col items-center justify-center p-8 text-center sm:p-12"
    >
      <span className="grid size-16 place-items-center rounded-2xl border border-border bg-surface/70 shadow-[var(--shadow-soft)]">
        <FileSearch2 className="size-7 text-muted-foreground" aria-hidden="true" />
      </span>
      <h2
        id="empty-state-heading"
        className="mt-5 text-lg font-semibold text-foreground sm:text-xl"
      >
        No file analyzed yet
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Drag a suspicious document or archive into the upload area above, then click{" "}
        <span className="inline-flex items-center gap-1 font-medium text-accent">
          <ScanLine className="size-3.5" aria-hidden="true" />
          Analyze File
        </span>{" "}
        to see a demo result.
      </p>
    </section>
  );
}
