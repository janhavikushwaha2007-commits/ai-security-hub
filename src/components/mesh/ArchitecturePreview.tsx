import { ChevronRight } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { architectureStages } from "./landing-data";

export function ArchitecturePreview() {
  return (
    <Section
      id="security"
      eyebrow="Security architecture"
      title="A transparent analysis pipeline"
      description="A preview of how a submission is planned to travel through the system once detection services are connected."
    >
      <Reveal>
        <div className="surface-card grid-mesh relative overflow-hidden p-6 sm:p-10">
          <div className="relative flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
            {architectureStages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-3 lg:flex-1">
                <div className="lift-hover flex-1 rounded-xl border border-border bg-background/70 px-4 py-4 text-center shadow-[var(--shadow-soft)] transition-all">
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-accent">
                    Stage {i + 1}
                  </span>
                  <span className="mt-1.5 block text-sm font-semibold">{stage}</span>
                </div>
                {i < architectureStages.length - 1 ? (
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 rotate-90 text-muted-foreground lg:rotate-0"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
