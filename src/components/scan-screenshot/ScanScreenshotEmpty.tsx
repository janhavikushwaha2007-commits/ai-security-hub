import { ImageOff, ScanLine } from "lucide-react";

export function ScanScreenshotEmpty() {
  return (
    <section
      aria-labelledby="screenshot-empty-heading"
      className="surface-card flex flex-col items-center justify-center p-8 text-center sm:p-12"
    >
      <span className="grid size-16 place-items-center rounded-2xl border border-border bg-surface/70 shadow-[var(--shadow-soft)]">
        <ImageOff className="size-7 text-muted-foreground" aria-hidden="true" />
      </span>
      <h2
        id="screenshot-empty-heading"
        className="mt-5 text-lg font-semibold text-foreground sm:text-xl"
      >
        No screenshot analyzed yet
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Add a screenshot above and pick a demo scenario to see how the result panel will look. Your
        image stays in this browser tab — nothing is uploaded or transmitted.
      </p>
      <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-[var(--shadow-soft)]">
        <ScanLine className="size-3.5 text-accent" aria-hidden="true" />
        Demo / local preview — no AI or OCR model is connected
      </p>
    </section>
  );
}
