import { FileSearch2, SearchX } from "lucide-react";

export function ScanHistoryEmpty({ filtered }: { filtered: boolean }) {
  const Icon = filtered ? SearchX : FileSearch2;
  return (
    <div className="surface-card flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-border bg-surface/70 text-accent shadow-[var(--shadow-soft)]">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-base font-semibold">
        {filtered ? "No records match your filters" : "No scan records yet"}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {filtered
          ? "Try a different search term, scan type, risk level, or date range."
          : "Sample history records appear here. Once a real scan service is connected, your own records will replace this demo list."}
      </p>
    </div>
  );
}
