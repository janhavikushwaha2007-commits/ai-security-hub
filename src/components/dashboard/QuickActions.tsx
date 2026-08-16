import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/mesh/Reveal";
import { MeshButton } from "@/components/mesh/MeshButton";
import { quickActions } from "./dashboard-data";

export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading" className="scroll-mt-24">
      <Reveal>
        <h2 id="quick-actions-heading" className="text-xl font-semibold sm:text-2xl">
          Quick Actions
        </h2>
      </Reveal>

      <Reveal delay={80} className="mt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) =>
            action.label === "Scan Message" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/scan-message">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Check Website" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/scan-url">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : (
              <MeshButton key={action.label} size="lg" className="w-full justify-start">
                <action.icon aria-hidden="true" />
                {action.label}
              </MeshButton>
            ),
          )}
        </div>
      </Reveal>
    </section>
  );
}
