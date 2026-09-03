import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanScreenshotHeader } from "@/components/scan-screenshot/ScanScreenshotHeader";
import { ScanScreenshotUploader } from "@/components/scan-screenshot/ScanScreenshotUploader";
import { ScanScreenshotResult } from "@/components/scan-screenshot/ScanScreenshotResult";
import { ScanScreenshotEmpty } from "@/components/scan-screenshot/ScanScreenshotEmpty";
import {
  getDemoScreenshotResult,
  type ScreenshotAnalysis,
  type ScreenshotScenarioId,
  type SelectedImageInfo,
} from "@/components/scan-screenshot/scan-screenshot-data";

const title = "Screenshot Analysis — Image Threat Preview | AI Security Mesh";
const description =
  "Preview the AI Security Mesh screenshot analyzer. Add an image of a suspicious message or login page to see a demo risk score, security signals, and recommended actions.";

export const Route = createFileRoute("/scan-screenshot")({
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
  component: ScanScreenshotPage,
});

function ScanScreenshotPage() {
  const [image, setImage] = useState<SelectedImageInfo | null>(null);
  const [scenario, setScenario] = useState<ScreenshotScenarioId>("high-risk");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScreenshotAnalysis | null>(null);

  const handleSelectImage = (next: SelectedImageInfo | null) => {
    setImage((prev) => {
      if (prev?.previewUrl && prev.previewUrl !== next?.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return next;
    });
    setResult(null);
    setIsAnalyzing(false);
  };

  const handleAnalyze = () => {
    setResult(null);
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setResult(getDemoScreenshotResult(scenario));
    }, 1400);
  };

  const handleClear = () => {
    setResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <ScanScreenshotHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-3xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Screenshot / Image Analysis</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This is a frontend preview. Add a screenshot of a suspicious message, login page, or
              payment prompt and pick a demo scenario — results are clearly labelled demo data, and
              your image is never uploaded or transmitted anywhere.
            </p>
          </div>

          <ScanScreenshotUploader
            image={image}
            scenario={scenario}
            onScenarioChange={(next) => {
              setScenario(next);
              setResult(null);
            }}
            onSelectImage={handleSelectImage}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
            hasResult={result !== null}
          />

          {result ? (
            <ScanScreenshotResult result={result} image={image} />
          ) : (
            <ScanScreenshotEmpty />
          )}
        </div>
      </main>
    </div>
  );
}
