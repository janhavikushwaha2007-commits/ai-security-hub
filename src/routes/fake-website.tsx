import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FakeWebsiteHeader } from "@/components/fake-website/FakeWebsiteHeader";
import { FakeWebsiteForm } from "@/components/fake-website/FakeWebsiteForm";
import { FakeWebsiteResult } from "@/components/fake-website/FakeWebsiteResult";
import { FakeWebsiteEmpty } from "@/components/fake-website/FakeWebsiteEmpty";
import { analyzeWebsite, type WebsiteAnalysis } from "@/components/fake-website/fake-website-data";

const title = "Fake Website Detection — Phishing Site Checker | AI Security Mesh";
const description =
  "Preview the AI Security Mesh fake website checker: HTTPS, domain structure, keyword, reputation, and phishing-signal checks with a demo risk score out of 100.";

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

function FakeWebsitePage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WebsiteAnalysis | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const handleAnalyze = (value: string) => {
    setResult(null);
    setFailure(null);
    setIsAnalyzing(true);
    timer.current = window.setTimeout(() => {
      try {
        setResult(analyzeWebsite(value));
      } catch {
        setFailure("We could not read that address. Check the format and try again.");
      }
      setIsAnalyzing(false);
    }, 1300);
  };

  const handleClear = () => {
    if (timer.current) window.clearTimeout(timer.current);
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
              Check whether a website address shows the patterns used by phishing and impersonation
              sites. This is a frontend preview: the analysis runs on local heuristics in your
              browser and is not checked against a live threat-intelligence database.
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
            <FakeWebsiteResult result={result} />
          ) : isAnalyzing ? null : (
            <FakeWebsiteEmpty />
          )}
        </div>
      </main>
    </div>
  );
}
