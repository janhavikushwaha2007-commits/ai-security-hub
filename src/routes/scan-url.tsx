import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanUrlHeader } from "@/components/scan-url/ScanUrlHeader";
import { ScanUrlForm } from "@/components/scan-url/ScanUrlForm";
import { ScanUrlResult } from "@/components/scan-url/ScanUrlResult";
import { ScanUrlEmpty } from "@/components/scan-url/ScanUrlEmpty";
import { ApiError, scanUrl, type ScanResult } from "@/lib/api";

const title = "Scan URL — AI Security Mesh";
const description =
  "Scan a suspicious link for phishing signals. AI Security Mesh checks for lookalike domains, suspicious paths, protocol issues, and common scam patterns.";

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
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await scanUrl(url);
      setResult(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to analyze the URL. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
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
              Paste or type a suspicious link below to run a real security analysis. Our scanner
              checks for lookalike domains, suspicious paths, protocol issues, and common phishing
              patterns.
            </p>
          </div>

          <ScanUrlForm
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
            hasResult={result !== null}
          />

          {error ? (
            <p role="alert" className="surface-card border-destructive/50 p-5 text-sm text-destructive">
              {error}
            </p>
          ) : result ? (
            <ScanUrlResult result={result} />
          ) : (
            <ScanUrlEmpty />
          )}
        </div>
      </main>
    </div>
  );
}
