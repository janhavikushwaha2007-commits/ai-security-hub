import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanFileHeader } from "@/components/scan-file/ScanFileHeader";
import { ScanFileUploader } from "@/components/scan-file/ScanFileUploader";
import { ScanFileResult } from "@/components/scan-file/ScanFileResult";
import { ScanFileEmpty } from "@/components/scan-file/ScanFileEmpty";
import type { SelectedFileInfo } from "@/components/scan-file/scan-file-data";

const title = "Scan File — Malicious File Detection | AI Security Mesh";
const description =
  "Preview the AI Security Mesh file scanner. Upload a suspicious document or archive to see a simulated frontend analysis with threat indicators and recommendations.";

export const Route = createFileRoute("/scan-file")({
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
  component: ScanFilePage,
});

function ScanFilePage() {
  const [file, setFile] = useState<SelectedFileInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const handleSelectFile = (next: SelectedFileInfo | null) => {
    setFile(next);
    setHasResult(false);
    setIsAnalyzing(false);
  };

  const handleAnalyze = () => {
    setHasResult(false);
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 1400);
  };

  const handleClear = () => {
    setHasResult(false);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <ScanFileHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-3xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Malicious File Detection</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This is a frontend preview. Upload a suspicious document or archive below to see a
              simulated demo analysis — no real malware scanning service is connected yet, and your
              file never leaves your device.
            </p>
          </div>

          <ScanFileUploader
            file={file}
            onSelectFile={handleSelectFile}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
            hasResult={hasResult}
          />

          {hasResult ? <ScanFileResult file={file} /> : <ScanFileEmpty />}
        </div>
      </main>
    </div>
  );
}
