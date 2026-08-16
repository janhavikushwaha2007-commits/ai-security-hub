import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanMessageHeader } from "@/components/scan-message/ScanMessageHeader";
import { ScanMessageForm } from "@/components/scan-message/ScanMessageForm";
import { ScanMessageResult } from "@/components/scan-message/ScanMessageResult";
import { ScanMessageEmpty } from "@/components/scan-message/ScanMessageEmpty";

const title = "Scan Message — AI Security Mesh";
const description =
  "Preview the AI Security Mesh scam message scanner. Paste a suspicious message to see a simulated frontend analysis with risk signals and recommendations.";

export const Route = createFileRoute("/scan-message")({
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
  component: ScanMessagePage,
});

function ScanMessagePage() {
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
      <ScanMessageHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-3xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Scam Message Detection</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This is a frontend preview. Paste or type a suspicious message below to see a
              simulated demo analysis — no real detection service is connected yet.
            </p>
          </div>

          <ScanMessageForm
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
            hasResult={hasResult}
          />

          {hasResult ? <ScanMessageResult /> : <ScanMessageEmpty />}
        </div>
      </main>
    </div>
  );
}
