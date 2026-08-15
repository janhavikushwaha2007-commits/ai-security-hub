import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { benefits } from "./landing-data";

export function WhyMesh() {
  return (
    <Section
      id="about"
      eyebrow="Why AI Security Mesh"
      title="Built for clarity, not alarm"
      description="Security tooling only helps if the answer makes sense. Every design decision here works toward that."
    >
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, i) => (
          <Reveal as="li" key={benefit.title} delay={i * 70}>
            <div className="surface-card lift-hover group flex h-full gap-4 p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/10 transition-colors duration-300 group-hover:bg-accent/20">
                <benefit.icon className="size-5 text-accent" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold">{benefit.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
