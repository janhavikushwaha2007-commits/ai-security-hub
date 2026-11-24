import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FakeWebsiteHeader } from "@/components/fake-website/FakeWebsiteHeader";
import { FakeWebsiteForm } from "@/components/fake-website/FakeWebsiteForm";
import { FakeWebsiteEmpty } from "@/components/fake-website/FakeWebsiteEmpty";

const API_BASE = "http://localhost:8000";

const title = "Fake Website Detection — Live Phishing Site Checker | AI Security Mesh";
const description =
  "Live AI Security Mesh fake website checker: real-time DNS, SSL certificate, HTTP header, and phishing-signal analysis.";

export const Route = createFileRoute("/fake-website")({
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
  component: FakeWebsitePage,
});

type BackendWebsiteResult = {
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

function FakeWebsitePage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BackendWebsiteResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const handleAnalyze = async (submittedValue?: string) => {
    setResult(null);
    setFailure(null);

    const inputEl = document.querySelector("input") as HTMLInputElement | null;
    const targetUrl = (
      typeof submittedValue === "string" && submittedValue.trim()
        ? submittedValue
        : url || inputEl?.value || ""
    ).trim();

    if (!targetUrl) {
      setFailure("Please enter a website URL or click one of the example buttons first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_BASE}/api/scan/website`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const json = await response.json();
      setResult(json.data);
    } catch {
      setFailure(
        "Could not connect to FastAPI backend on port 8000. Make sure uvicorn is running."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setIsAnalyzing(false);
    setResult(null);
    setFailure(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <FakeWebsiteHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-4xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Fake Website Detection</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Real-time threat inspection powered by the AI Security Mesh FastAPI backend: verifies
              live DNS resolution, SSL/TLS certificate validity, HTTP redirects, and phishing patterns.
            </p>
          </div>

          <FakeWebsiteForm
            url={url}
            onUrlChange={setUrl}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
            hasResult={result !== null}
          />

          {failure ? (
            <p
              role="alert"
              className="surface-card border-destructive/50 p-5 text-sm text-destructive"
            >
              {failure}
            </p>
          ) : result ? (
            <div className="surface-card space-y-5 rounded-2xl border border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Live FastAPI Website Inspection</h2>
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
                    <span className="text-muted-foreground">SSL Certificate:</span>{" "}
                    <strong>{result.details.ssl_valid ? "Valid" : "Invalid / Missing"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">HTTP Status:</span>{" "}
                    <strong>{result.details.http_status || "No Response"}</strong>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm font-semibold">Live Security Findings</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            !isAnalyzing && <FakeWebsiteEmpty />
          )}
        </div>
      </main>
    </div>
  );
}
