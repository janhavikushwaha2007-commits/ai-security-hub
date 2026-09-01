import { useState } from "react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { AlertCircle, Globe2, Loader2, ScanLine, X } from "lucide-react";
import { MAX_CHARS, demoScenarios, isValidUrl } from "./fake-website-data";
import { cn } from "@/lib/utils";

interface FakeWebsiteFormProps {
  url: string;
  onUrlChange: (value: string) => void;
  onAnalyze: (url: string) => void;
  onClear: () => void;
  isAnalyzing: boolean;
  hasResult: boolean;
}

export function FakeWebsiteForm({
  url,
  onUrlChange,
  onAnalyze,
  onClear,
  isAnalyzing,
  hasResult,
}: FakeWebsiteFormProps) {
  const [error, setError] = useState<string | null>(null);

  const charCount = url.length;
  const overLimit = charCount > MAX_CHARS;

  const handleAnalyze = () => {
    const value = url.trim();
    if (!value) {
      setError("Please enter a website address to analyze.");
      return;
    }
    if (value.length > MAX_CHARS) {
      setError(`Address must be ${MAX_CHARS.toLocaleString()} characters or fewer.`);
      return;
    }
    if (value.includes(" ")) {
      setError("A website address cannot contain spaces.");
      return;
    }
    if (!isValidUrl(value)) {
      setError("That does not look like a valid address. Try a format like https://example.com.");
      return;
    }
    setError(null);
    onAnalyze(value);
  };

  const handleClear = () => {
    setError(null);
    onUrlChange("");
    onClear();
  };

  return (
    <section aria-labelledby="fake-website-form-heading" className="scroll-mt-24">
      <div className="surface-card p-5 sm:p-7">
        <div>
          <h2 id="fake-website-form-heading" className="text-lg font-semibold sm:text-xl">
            Check a website address
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The checker inspects the connection type, domain structure, keywords, extension, and
            brand-impersonation patterns. This is a frontend preview using local heuristics — no
            live threat-intelligence service is connected yet.
          </p>
        </div>

        <div className="mt-6">
          <label htmlFor="fake-website-url" className="sr-only">
            Website address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Globe2 className="size-4" aria-hidden="true" />
            </span>
            <input
              id="fake-website-url"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={url}
              disabled={isAnalyzing}
              onChange={(e) => {
                onUrlChange(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAnalyze();
              }}
              placeholder="https://example.com/login"
              maxLength={MAX_CHARS + 50}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "fake-website-url-error" : undefined}
              className={cn(
                "w-full rounded-2xl border bg-surface/60 py-4 pl-11 pr-4 text-sm leading-relaxed text-foreground shadow-[var(--shadow-soft)] transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60",
                error || overLimit
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-border",
              )}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span
              className={cn(
                "text-xs",
                overLimit ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            </span>
            {error ? (
              <span
                id="fake-website-url-error"
                role="alert"
                className="inline-flex items-center gap-1.5 text-xs text-destructive"
              >
                <AlertCircle className="size-3.5" aria-hidden="true" />
                {error}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Demo scenarios
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                disabled={isAnalyzing}
                onClick={() => {
                  setError(null);
                  onUrlChange(scenario.url);
                  onAnalyze(scenario.url);
                }}
                className="press-3d inline-flex flex-col items-start rounded-xl border border-border bg-surface/60 px-3.5 py-2 text-left shadow-[var(--shadow-soft)] transition-colors hover:border-accent/60 hover:bg-surface disabled:opacity-60"
              >
                <span className="text-xs font-medium text-foreground">{scenario.label}</span>
                <span className="text-[0.7rem] text-muted-foreground">{scenario.hint}</span>
              </button>
            ))}
          </div>
        </div>

        {isAnalyzing ? (
          <div className="mt-6">
            <p className="inline-flex items-center gap-2 text-xs font-medium text-primary">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Running pattern checks on the address…
            </p>
            <div className="mt-3 overflow-hidden rounded-full bg-surface/70">
              <div className="animate-scan-sweep h-1.5 w-1/3 rounded-full bg-[image:var(--gradient-brand)]" />
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <MeshButton onClick={handleAnalyze} disabled={isAnalyzing} className="min-w-[11rem]">
            {isAnalyzing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ScanLine className="size-4" aria-hidden="true" />
            )}
            {isAnalyzing ? "Analyzing..." : hasResult ? "Analyze Another URL" : "Analyze Website"}
          </MeshButton>
          <MeshButton
            variant="outline"
            onClick={handleClear}
            disabled={isAnalyzing || (!url && !hasResult)}
          >
            <X className="size-4" aria-hidden="true" />
            Clear
          </MeshButton>
        </div>
      </div>
    </section>
  );
}
