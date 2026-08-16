import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanUrlHeader } from "@/components/scan-url/ScanUrlHeader";
import { ScanUrlForm } from "@/components/scan-url/ScanUrlForm";
import { ScanUrlResult } from "@/components/scan-url/ScanUrlResult";
import { ScanUrlEmpty } from "@/components/scan-url/ScanUrlEmpty";

const title = "Scan URL — AI Security Mesh";
const description =
  "Preview the AI Security Mesh URL scanner. Paste a suspicious link to see a simulated frontend analysis with risk signals and recommendations.";

export const Route = createFileRoute("/scan-url")({
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
  component: ScanUrlPage,
});

function ScanUrlPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 1200);
  };

  const handleClear = () => {
    setHasResult(false);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <ScanUrlHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-3xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Phishing URL Detection</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This is a frontend preview. Paste or type a suspicious link below to see a simulated
              demo analysis — no real detection service is connected yet.
            </p>
          </div>

          <ScanUrlForm
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
            hasResult={hasResult}
          />

          {hasResult ? <ScanUrlResult /> : <ScanUrlEmpty />}
        </div>
      </main>
    </div>
  );
}
