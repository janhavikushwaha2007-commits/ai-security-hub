import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanMessageHeader } from "@/components/scan-message/ScanMessageHeader";
import { ScanMessageForm } from "@/components/scan-message/ScanMessageForm";
import { ScanMessageEmpty } from "@/components/scan-message/ScanMessageEmpty";

const API_BASE = "http://localhost:8000";

const title = "Scan Message — Live Scam & Phishing Detector | AI Security Mesh";
const description =
  "Real-time AI Security Mesh message scanner: detects SMS, WhatsApp, and email phishing, OTP scams, and malicious links.";

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

type BackendMessageResult = {
  risk_score: number;
  risk_level: string;
  reasons: string[];
  mode: string;
  details?: {
    extracted_links?: string[];
    length?: number;
  };
};

function ScanMessagePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BackendMessageResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (submittedText?: string) => {
    setError("");
    setResult(null);
    setIsAnalyzing(true);

    const textareaEl = document.querySelector("textarea") as HTMLTextAreaElement | null;
    const targetMsg = (submittedText || textareaEl?.value || "").trim();

    if (!targetMsg) {
      setError("Please enter or paste a message to scan.");
      setIsAnalyzing(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/scan/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: targetMsg }),
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
      <ScanMessageHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-3xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Scam &amp; Phishing Message Scanner</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Real-time threat inspection powered by the AI Security Mesh FastAPI backend: analyzes
              SMS, WhatsApp, and email text for OTP scams, fake bank alerts, and malicious links.
            </p>
          </div>

          <ScanMessageForm
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
                  <h2 className="text-lg font-semibold">Live FastAPI Message Analysis</h2>
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

              <div>
                <h3 className="mb-2 text-sm font-semibold">Detected Warning Signals</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            !isAnalyzing && <ScanMessageEmpty />
          )}
        </div>
      </main>
    </div>
  );
}
