import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LayoutGrid, ShieldAlert } from "lucide-react";
import { SecurityScoreHeader } from "@/components/security-score/SecurityScoreHeader";
import { ScoreGauge } from "@/components/security-score/ScoreGauge";
import { ScoreFactors } from "@/components/security-score/ScoreFactors";
import { ScoreTrend } from "@/components/security-score/ScoreTrend";
import { ScoreMethod } from "@/components/security-score/ScoreMethod";
import { ScoreRecommendations } from "@/components/security-score/ScoreRecommendations";
import { MeshButton } from "@/components/mesh/MeshButton";
import { Footer } from "@/components/mesh/Footer";
import {
  computeSecurityScore,
  demoFactors,
  type ScoreResult,
} from "@/components/security-score/security-score-data";

const title = "Security Score — AI Security Mesh";
const description =
  "See a transparent demo security score with factor breakdown, 7-day trend, and recommended actions. Frontend preview only.";

export const Route = createFileRoute("/security-score")({
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
  component: SecurityScorePage,
});

function SecurityScorePage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setResult(computeSecurityScore(demoFactors));
        setError(null);
      } catch {
        setError("The demo score could not be prepared. Please try again.");
      }
      setLoading(false);
    }, 550);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SecurityScoreHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-6xl space-y-10 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Security Score</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A transparent view of how protected a profile is, built from a fixed demo scoring
              model. Every number on this page is sample data for interface preview — it does not
              describe a real person's security posture.
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

          {loading ? (
            <div className="space-y-4" aria-busy="true" aria-live="polite">
              <div className="surface-card h-64 animate-pulse" />
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="surface-card h-52 animate-pulse" />
                <div className="surface-card h-52 animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">Preparing the demo score…</p>
            </div>
          ) : error || !result ? (
            <section className="surface-card flex flex-col items-center gap-3 p-10 text-center">
              <span className="grid size-12 place-items-center rounded-xl border border-destructive/40 bg-destructive/10">
                <ShieldAlert className="size-6 text-destructive" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold">Score unavailable</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                {error ?? "The demo score could not be prepared."}
              </p>
              <MeshButton variant="outline" onClick={() => window.location.reload()}>
                Try again
              </MeshButton>
            </section>
          ) : (
            <>
              <ScoreGauge result={result} />
              <ScoreFactors factors={result.factors} />
              <ScoreTrend />
              <ScoreMethod />
              <ScoreRecommendations />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
