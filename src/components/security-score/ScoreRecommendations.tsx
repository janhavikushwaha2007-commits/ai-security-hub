import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/mesh/Reveal";
import { MeshButton } from "@/components/mesh/MeshButton";
import { demoRecommendations } from "./security-score-data";

export function ScoreRecommendations() {
  return (
    <section aria-labelledby="score-reco-heading" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="score-reco-heading" className="text-xl font-semibold sm:text-2xl">
            Recommended Actions
          </h2>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Demo data
          </span>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {demoRecommendations.map((item, i) => (
          <Reveal key={item.title} delay={i * 70}>
            <article className="surface-card lift-hover flex h-full flex-col gap-3 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-accent/40 bg-accent/10">
                    <Sparkles className="size-5 text-accent" aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <span className="rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Sample impact {item.impact}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              <div className="mt-auto pt-2">
                <MeshButton variant="outline" size="sm" asChild>
                  <Link to={item.actionTo}>
                    {item.actionLabel}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </MeshButton>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
