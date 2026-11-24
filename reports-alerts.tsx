import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { AlertsList } from "@/components/reports-alerts/AlertsList";
import { ReportDetails } from "@/components/reports-alerts/ReportDetails";
import { ReportsAlertsHeader } from "@/components/reports-alerts/ReportsAlertsHeader";
import { ReportsList } from "@/components/reports-alerts/ReportsList";
import { ReportsOverview } from "@/components/reports-alerts/ReportsOverview";
import { demoAlerts, demoReports, type ReportRecord } from "@/components/reports-alerts/reports-alerts-data";
import { Footer } from "@/components/mesh/Footer";
import { MeshButton } from "@/components/mesh/MeshButton";

const title = "Reports & Alerts — AI Security Mesh";
const description =
  "Browse clearly labelled sample security reports and alerts with report search, risk filters, and detail views. Frontend preview only.";

export const Route = createFileRoute("/reports-alerts")({
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
  component: ReportsAlertsPage,
});

function ReportsAlertsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (!Array.isArray(demoReports) || !Array.isArray(demoAlerts)) {
          throw new Error("Sample data unavailable");
        }
        setError(null);
      } catch {
        setError("The sample reports could not be prepared. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ReportsAlertsHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-6xl space-y-10 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Reports &amp; Alerts</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Review report examples, risk summaries, and suggested next steps. Every report and alert on this page is fixed DEMO DATA for interface preview only; none represents a real scan, person, or security event.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <MeshButton variant="outline" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to Dashboard
                </Link>
              </MeshButton>
            </div>
          </div>

          {error ? (
            <section className="surface-card flex flex-col items-center gap-3 p-10 text-center" role="alert">
              <span className="grid size-12 place-items-center rounded-xl border border-destructive/40 bg-destructive/10">
                <ShieldAlert className="size-6 text-destructive" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold">Reports unavailable</h2>
              <p className="max-w-md text-sm text-muted-foreground">{error}</p>
              <MeshButton variant="outline" onClick={() => window.location.reload()}>
                Try again
              </MeshButton>
            </section>
          ) : (
            <>
              <ReportsOverview />
              <ReportsList loading={loading} onViewDetails={setSelectedReport} />
              {!loading ? <AlertsList /> : null}
            </>
          )}
        </div>
      </main>
      <Footer />
      <ReportDetails report={selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  );
}