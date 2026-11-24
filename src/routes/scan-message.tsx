import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanMessageHeader } from "@/components/scan-message/ScanMessageHeader";
import { ScanMessageForm } from "@/components/scan-message/ScanMessageForm";
import { ScanMessageResult } from "@/components/scan-message/ScanMessageResult";
import { ScanMessageEmpty } from "@/components/scan-message/ScanMessageEmpty";
import { ApiError, scanMessage, type ScanResult } from "@/lib/api";

const title = "Scan Message — AI Security Mesh";
const description =
  "Scan a suspicious SMS, email, or chat message for scam patterns. AI Security Mesh checks for urgency cues, credential requests, and common fraud language.";

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
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (message: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await scanMessage(message);
      setResult(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to analyze the message. Please try again.");
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
              Paste or type a suspicious message below to run a real security analysis. Our scanner
              checks for manipulation patterns, urgency cues, suspicious links, and common scam
              language.
            </p>
          </div>

          <ScanMessageForm
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
            <ScanMessageResult result={result} />
          ) : (
            <ScanMessageEmpty />
          )}
        </div>
      </main>
    </div>
  );
}
