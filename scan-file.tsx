import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanFileHeader } from "@/components/scan-file/ScanFileHeader";
import { ScanFileUploader } from "@/components/scan-file/ScanFileUploader";
import { ScanFileEmpty } from "@/components/scan-file/ScanFileEmpty";
import type { SelectedFileInfo } from "@/components/scan-file/scan-file-data";

const API_BASE = "http://localhost:8000";

const title = "Scan File — Live Malware Detection | AI Security Mesh";
const description =
  "Real-time AI Security Mesh file scanner: computes SHA-256 hashes and detects dangerous scripts or executables.";

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

type BackendFileResult = {
  risk_score: number;
  risk_level: string;
  reasons: string[];
  mode: string;
  details?: {
    filename?: string;
    size_kb?: number;
    sha256?: string;
  };
};

function ScanFilePage() {
  const [file, setFile] = useState<SelectedFileInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BackendFileResult | null>(null);
  const [error, setError] = useState("");

  const handleSelectFile = (next: SelectedFileInfo | null) => {
    setFile(next);
    setResult(null);
    setError("");
    setIsAnalyzing(false);
  };

  const handleAnalyze = async () => {
    setResult(null);
    setError("");
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_BASE}/api/scan/file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          size_bytes: file.size || 0,
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      setResult(json.data);
    } catch {
      setError("Could not connect to FastAPI backend on port 8000.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError("");
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
              Real-time binary inspection powered by the AI Security Mesh FastAPI backend: generates
              SHA-256 cryptographic hashes and detects executable headers or embedded scripts.
            </p>
          </div>

          <ScanFileUploader
            file={file}
            onSelectFile={handleSelectFile}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
            hasResult={result !== null}
          />

          {error && (
            <p className="surface-card border-destructive/50 p-4 text-sm text-destructive">
              {error}
            </p>
          )}

          {result ? (
            <div className="surface-card space-y-5 rounded-2xl border border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Live FastAPI File Inspection</h2>
                  <p className="text-xs text-muted-foreground">{result.mode}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    result.risk_level === "High"
                      ? "bg-destructive/15 text-destructive"
                      : result.risk_level === "Medium"
                        ? "bg-amber-500/15 text-amber-500"
                        : "bg-emerald-500/15 text-emerald-500"
                  }`}
                >
                  {result.risk_level} Risk ({result.risk_score}/100)
                </span>
              </div>

              {result.details && (
                <div className="space-y-1.5 rounded-xl bg-muted/40 p-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">File:</span>{" "}
                    <strong>{result.details.filename}</strong> ({result.details.size_kb} KB)
                  </div>
                  <div className="break-all">
                    <span className="text-muted-foreground">SHA-256:</span>{" "}
                    <code className="font-mono">{result.details.sha256}</code>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm font-semibold">Inspection Findings</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            !isAnalyzing && <ScanFileEmpty />
          )}
        </div>
      </main>
    </div>
  );
}
