import { Reveal } from "@/components/mesh/Reveal";
import { overviewStats } from "./dashboard-data";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  accent: "text-accent",
  violet: "text-violet",
  primary: "text-primary",
  muted: "text-muted-foreground",
};

export function SecurityOverview() {
  return (
    <section aria-labelledby="overview-heading" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="overview-heading" className="text-xl font-semibold sm:text-2xl">
            Security Overview
          </h2>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Sample data
          </span>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 70}>
            <article className="surface-card lift-hover h-full p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <stat.icon
                  className={cn("size-5 shrink-0", toneClass[stat.tone])}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-4 font-display text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{stat.hint}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
