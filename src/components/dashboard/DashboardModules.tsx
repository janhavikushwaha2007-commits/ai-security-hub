import { Reveal } from "@/components/mesh/Reveal";
import { MeshButton } from "@/components/mesh/MeshButton";
import { dashboardModules } from "./dashboard-data";
import { cn } from "@/lib/utils";

const statusClass: Record<string, string> = {
  Ready: "border-accent/40 text-accent",
  Preview: "border-primary/40 text-primary",
  Attention: "border-destructive/50 text-destructive",
};

export function DashboardModules() {
  return (
    <section aria-labelledby="modules-heading" className="scroll-mt-24">
      <Reveal>
        <h2 id="modules-heading" className="text-xl font-semibold sm:text-2xl">
          Security Modules
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Module interfaces are previews — detection services are not connected yet.
        </p>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {dashboardModules.map((mod, i) => (
          <Reveal key={mod.title} delay={i * 70}>
            <article className="surface-card lift-hover flex h-full flex-col p-5">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-accent shadow-[var(--shadow-soft)]">
                  <mod.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{mod.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {mod.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                    statusClass[mod.status],
                  )}
                >
                  {mod.status}
                </span>
                <MeshButton variant="outline" size="sm">
                  {mod.action}
                </MeshButton>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
