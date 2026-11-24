import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SecurityOverview } from "@/components/dashboard/SecurityOverview";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ThreatOverview } from "@/components/dashboard/ThreatOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Footer } from "@/components/mesh/Footer";

const API_BASE = "http://localhost:8000";

const title = "Security Dashboard — Live Telemetry | AI Security Mesh";
const description =
  "Live AI Security Mesh dashboard connected to the FastAPI threat engine: real-time scan statistics, risk distribution, and recent security checks.";

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

type StatsData = {
  total_scans: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  recent_scans: Array<{
    risk_score: number;
    risk_level: string;
    reasons: string[];
    mode: string;
    scanned_at: string;
  }>;
};

function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/scan/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) setStats(json.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-96 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-6xl space-y-12 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Security Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Real-time threat telemetry and live inspection metrics powered by the AI Security Mesh
              FastAPI backend.
            </p>
          </div>

          {stats && (
            <div className="surface-card grid grid-cols-2 gap-4 border-primary/30 p-5 sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Live Backend Scans</p>
                <p className="mt-1 text-2xl font-bold">{stats.total_scans}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">High Risk Detected</p>
                <p className="mt-1 text-2xl font-bold text-destructive">{stats.high_risk}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Medium Risk</p>
                <p className="mt-1 text-2xl font-bold text-amber-500">{stats.medium_risk}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Safe / Low Risk</p>
                <p className="mt-1 text-2xl font-bold text-emerald-500">{stats.low_risk}</p>
              </div>
            </div>
          )}

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
