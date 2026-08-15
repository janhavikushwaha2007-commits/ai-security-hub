import { ArrowRight, Sparkles } from "lucide-react";
import { MeshButton } from "./MeshButton";
import { Reveal } from "./Reveal";
import heroMesh from "@/assets/hero-mesh.png";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      {/* Ambient background layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-hero)]"
      />
      <div
        aria-hidden="true"
        className="grid-mesh pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="animate-pulse-orb pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-violet/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-pulse-orb pointer-events-none absolute -right-16 top-52 size-80 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
              AI-assisted threat awareness for everyday digital life
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              Your Intelligent <span className="text-gradient-brand">Digital Security</span> Layer
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              AI SECURITY MESH is designed to help you analyse suspicious digital content —
              messages, links, websites, files, and passwords — and turn technical signals into
              security guidance you can actually understand and act on.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MeshButton size="lg">
                Get Started
                <ArrowRight aria-hidden="true" />
              </MeshButton>
              <MeshButton asChild variant="outline" size="lg">
                <a href="#features">Explore Features</a>
              </MeshButton>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-6 text-xs text-muted-foreground">
              Preview build — the interface below showcases the planned modules. Detection services
              are not connected yet.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="relative">
          <div className="animate-float-slow relative mx-auto max-w-md">
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-full bg-accent/20 blur-3xl"
            />
            <img
              src={heroMesh}
              alt="Illustration of a security shield connected to a mesh of protected network nodes"
              width={1024}
              height={1024}
              className="relative w-full drop-shadow-2xl"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
