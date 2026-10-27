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
            action.label === "Scan Center" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/scan-center">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Security Score" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/security-score">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Reports & Alerts" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/reports-alerts">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Scan History" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/scan-history">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Scan Message" ? (
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
            ) : action.label === "Scan File" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/scan-file">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Check Password" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/password-check">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Check Now" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/fake-website">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Scan Screenshot" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/scan-screenshot">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Profile & Settings" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/profile-settings">
                  <action.icon aria-hidden="true" />
                  {action.label}
                </Link>
              </MeshButton>
            ) : action.label === "Secure Storage" ? (
              <MeshButton key={action.label} size="lg" className="w-full justify-start" asChild>
                <Link to="/secure-storage">
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
