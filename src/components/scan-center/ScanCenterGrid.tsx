import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/mesh/Reveal";
import { MeshButton } from "@/components/mesh/MeshButton";
import { scanCenterScanners } from "./scan-center-data";
import { cn } from "@/lib/utils";

const statusClass: Record<string, string> = {
  Ready: "border-accent/40 text-accent",
  Preview: "border-primary/40 text-primary",
  Attention: "border-destructive/50 text-destructive",
};

export function ScanCenterGrid() {
  return (
    <section aria-labelledby="scanners-heading" className="scroll-mt-24">
      <Reveal>
        <h2 id="scanners-heading" className="text-xl font-semibold sm:text-2xl">
          Choose what you want to check
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Each scanner below is a frontend preview. Select one to open its demo interface — no
          real detection service is connected yet.
        </p>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scanCenterScanners.map((scanner, i) => (
          <Reveal key={scanner.id} delay={i * 70}>
            <article className="surface-card lift-hover flex h-full flex-col p-5">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-accent shadow-[var(--shadow-soft)]">
                  <scanner.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{scanner.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {scanner.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-1 flex-col justify-end">
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground/80">
                  <span className="font-medium text-foreground/90">Best for:</span> {scanner.guidance}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                      statusClass[scanner.status],
                    )}
                  >
                    {scanner.status}
                  </span>
                  <MeshButton variant="outline" size="sm" asChild>
                    <Link to={scanner.route}>
                      Open Scanner
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </MeshButton>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
