import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SecurityOverview } from "@/components/dashboard/SecurityOverview";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ThreatOverview } from "@/components/dashboard/ThreatOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Footer } from "@/components/mesh/Footer";

const title = "Security Dashboard Preview — AI Security Mesh";
const description =
  "Preview the AI Security Mesh dashboard: security score, threat overview, detection modules, and recent activity — a frontend preview with sample data.";

export const Route = createFileRoute("/dashboard")({
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
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-96 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-6xl space-y-16 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Security Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This is a frontend preview of the future product. All figures, modules, and activity
              shown below are sample demo data — no detection services are connected yet.
            </p>
          </div>

          <SecurityOverview />
          <DashboardModules />
          <ThreatOverview />
          <RecentActivity />
          <QuickActions />
        </div>
      </main>
      <Footer />
    </div>
  );
}
