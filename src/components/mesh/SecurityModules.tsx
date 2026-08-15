import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { securityModules } from "./landing-data";

export function SecurityModules() {
  return (
    <Section
      id="features"
      eyebrow="Security modules"
      title="Eight layers, one security mesh"
      description="Each module focuses on a distinct attack surface. Together they form a connected view of your personal risk."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {securityModules.map((module, i) => (
          <Reveal as="li" key={module.title} delay={i * 60}>
            <article className="surface-card lift-hover group h-full p-6">
              <span className="grid size-11 place-items-center rounded-xl border border-border bg-background/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/50">
                <module.icon className="size-5 text-accent" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-semibold">{module.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {module.description}
              </p>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
