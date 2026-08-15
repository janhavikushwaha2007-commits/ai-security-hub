import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { howItWorksSteps } from "./landing-data";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="From suspicious content to a clear decision"
      description="Four steps, every time — so results stay predictable and easy to follow."
    >
      <ol className="grid gap-5 md:grid-cols-4">
        {howItWorksSteps.map((step, i) => (
          <Reveal as="li" key={step.label} delay={i * 90}>
            <div className="surface-card lift-hover relative h-full p-6">
              <span className="font-display text-sm font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{step.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              {i < howItWorksSteps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute right-[-14px] top-1/2 hidden h-px w-6 bg-gradient-to-r from-accent/60 to-transparent md:block"
                />
              ) : null}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
