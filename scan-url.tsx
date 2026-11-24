import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanUrlHeader } from "@/components/scan-url/ScanUrlHeader";
import { ScanUrlForm } from "@/components/scan-url/ScanUrlForm";
import { ScanUrlEmpty } from "@/components/scan-url/ScanUrlEmpty";

const API_BASE = "http://localhost:8000";

const title = "Scan URL — Live Phishing Detection | AI Security Mesh";
const description =
  "Real-time AI Security Mesh URL scanner: live DNS, SSL certificate, HTTP redirect, and phishing-signal analysis.";

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

type BackendScanResult = {
  risk_score: number;
  risk_level: string;
  reasons: string[];
  mode: string;
  details?: {
    host?: string;
    ip_address?: string;
    ssl_valid?: boolean;
    ssl_issuer?: string;
    http_status?: number;
  };
};

function ScanUrlPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BackendScanResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (submittedUrl?: string) => {
    setError("");
    setResult(null);
    setIsAnalyzing(true);

    // Grab URL either from callback argument or from the input field in DOM
    const inputEl = document.querySelector("input") as HTMLInputElement | null;
    const targetUrl = (submittedUrl || inputEl?.value || "").trim();

    if (!targetUrl) {
      setError("Please enter a URL to scan.");
      setIsAnalyzing(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/scan/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
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
              Real-time threat inspection powered by the AI Security Mesh FastAPI backend: checks
              live DNS resolution, SSL/TLS certificates, and phishing patterns.
            </p>
          </div>

          <ScanUrlForm
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
                  <h2 className="text-lg font-semibold">Live FastAPI Scan Result</h2>
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
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-4 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground">Resolved IP:</span>{" "}
                    <strong>{result.details.ip_address || "Unresolved"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">SSL Valid:</span>{" "}
                    <strong>{result.details.ssl_valid ? "Yes" : "No"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">HTTP Status:</span>{" "}
                    <strong>{result.details.http_status || "N/A"}</strong>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm font-semibold">Detected Security Signals</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            !isAnalyzing && <ScanUrlEmpty />
          )}
        </div>
      </main>
    </div>
  );
}
