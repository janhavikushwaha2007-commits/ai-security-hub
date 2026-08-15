import { Reveal } from "@/components/mesh/Reveal";
import { threatBreakdown } from "./dashboard-data";
import { cn } from "@/lib/utils";

export function ThreatOverview() {
  const total = threatBreakdown.reduce((sum, s) => sum + s.value, 0);

  return (
    <section aria-labelledby="threat-heading" className="scroll-mt-24">
      <Reveal>
        <h2 id="threat-heading" className="text-xl font-semibold sm:text-2xl">
          Threat Overview
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Distribution of {total} sample results across risk levels.
        </p>
      </Reveal>

      <Reveal delay={80} className="mt-6">
        <div className="surface-card p-5 sm:p-6">
          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-surface"
            role="img"
            aria-label={threatBreakdown
              .map((s) => `${s.label}: ${s.value} of ${total}`)
              .join(", ")}
          >
            {threatBreakdown.map((slice) => (
              <span
                key={slice.label}
                className={cn("h-full transition-[width] duration-700", slice.className)}
                style={{ width: `${(slice.value / total) * 100}%` }}
              />
            ))}
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {threatBreakdown.map((slice) => (
              <li key={slice.label} className="rounded-xl border border-border bg-surface/50 p-4">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn("size-2.5 rounded-full", slice.className)}
                  />
                  <span className="text-sm text-muted-foreground">{slice.label}</span>
                </div>
                <p className="mt-3 font-display text-2xl font-semibold">{slice.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {Math.round((slice.value / total) * 100)}% of scans
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
