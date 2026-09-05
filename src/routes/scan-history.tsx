import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { ScanHistoryHeader } from "@/components/scan-history/ScanHistoryHeader";
import { ScanHistoryTable } from "@/components/scan-history/ScanHistoryTable";
import { ScanHistoryDetails } from "@/components/scan-history/ScanHistoryDetails";
import { MeshButton } from "@/components/mesh/MeshButton";
import { Footer } from "@/components/mesh/Footer";
import type { ScanHistoryRecord } from "@/components/scan-history/scan-history-data";

const title = "Scan History — AI Security Mesh";
const description =
  "Review sample AI Security Mesh scan records with filters, search, sorting, and detailed demo results. Frontend preview only.";

export const Route = createFileRoute("/scan-history")({
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
  component: ScanHistoryPage,
});

function ScanHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ScanHistoryRecord | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ScanHistoryHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-6xl space-y-10 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Scan History</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A record archive for every AI Security Mesh scanner. All entries below are clearly
              labelled sample records for interface preview — no real scans, message contents,
              file contents, or passwords are stored or displayed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <MeshButton variant="outline" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to Dashboard
                </Link>
              </MeshButton>
              <MeshButton asChild>
                <Link to="/scan-center">
                  <LayoutGrid className="size-4" aria-hidden="true" />
                  Go to Scan Center
                </Link>
              </MeshButton>
            </div>
          </div>

          <ScanHistoryTable loading={loading} onViewDetails={setSelected} />
        </div>
      </main>
      <Footer />
      <ScanHistoryDetails record={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
