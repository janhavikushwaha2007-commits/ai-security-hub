import { ArrowRight } from "lucide-react";
import { MeshButton } from "./MeshButton";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="px-5 pb-24 sm:px-8">
      <Reveal className="mx-auto w-full max-w-5xl">
        <div className="surface-card relative overflow-hidden px-6 py-16 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-hero)]"
          />
          <div
            aria-hidden="true"
            className="animate-pulse-orb pointer-events-none absolute left-1/2 top-0 size-72 -translate-x-1/2 rounded-full bg-violet/20 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Start Protecting Your <span className="text-gradient-brand">Digital Life</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Create an account to be ready when the detection modules go live.
            </p>
            <div className="mt-8 flex justify-center">
              <MeshButton size="lg">
                Get Started
                <ArrowRight aria-hidden="true" />
              </MeshButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
