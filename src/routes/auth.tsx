import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Footer } from "@/components/mesh/Footer";
import { Reveal } from "@/components/mesh/Reveal";
import { MeshButton } from "@/components/mesh/MeshButton";

const title = "Sign In / Register — AI Security Mesh";
const description =
  "Preview the login and registration experience of AI Security Mesh. Frontend demo only — no accounts are created and no credentials are stored.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-start gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-accent shadow-[var(--shadow-soft)]">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Frontend Preview · Demo Only
              </span>
              <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">
                Access your security layer
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                This page previews the sign-in and registration experience. You can try both modes,
                validation, and password visibility — nothing is submitted, stored, or logged, and
                no account is created. Real authentication will be connected during the backend
                phase.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  {
                    title: "Password stays on this device",
                    text: "Typed passwords are never sent anywhere, saved in browser storage, or written to logs.",
                  },
                  {
                    title: "Validation you can rely on later",
                    text: "Email format, minimum password length, and confirmation matching are checked before anything would be submitted.",
                  },
                  {
                    title: "Ready for real authentication",
                    text: "The interface is structured so a real identity service can be connected during the backend phase without redesign.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border border-accent/40 bg-accent/10">
                      <ShieldCheck className="size-3.5 text-accent" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <MeshButton variant="outline" asChild>
                  <Link to="/">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back to Homepage
                  </Link>
                </MeshButton>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:sticky lg:top-28">
            <AuthCard />
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
