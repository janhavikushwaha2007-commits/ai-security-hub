import { useState } from "react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { ScanLine, Sparkles, X, AlertCircle, Link2 } from "lucide-react";
import { EXAMPLE_URL, MAX_CHARS } from "./scan-url-data";
import { cn } from "@/lib/utils";

interface ScanUrlFormProps {
  onAnalyze: (url: string) => void;
  onClear: () => void;
  isAnalyzing: boolean;
  hasResult: boolean;
}

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(.*)$/i;

export function ScanUrlForm({ onAnalyze, onClear, isAnalyzing, hasResult }: ScanUrlFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const charCount = url.length;
  const nearLimit = charCount > MAX_CHARS * 0.9;
  const overLimit = charCount > MAX_CHARS;

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setError("Please enter a URL to analyze.");
      return false;
    }
    if (value.trim().length > MAX_CHARS) {
      setError(`URL must be ${MAX_CHARS.toLocaleString()} characters or fewer.`);
      return false;
    }
    if (!URL_REGEX.test(value.trim())) {
      setError("Please enter a valid URL (e.g., https://example.com).");
      return false;
    }
    return true;
  };

  const handleAnalyze = () => {
    if (!validateUrl(url)) return;
    setError(null);
    onAnalyze(url.trim());
  };

  const handleClear = () => {
    setUrl("");
    setError(null);
    onClear();
  };

  const loadExample = () => {
    setUrl(EXAMPLE_URL);
    setError(null);
  };

  return (
    <section aria-labelledby="scan-url-heading" className="scroll-mt-24">
      <div className="surface-card p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="scan-url-heading" className="text-lg font-semibold sm:text-xl">
              Enter a suspicious URL
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This scanner checks for lookalike domains, suspicious paths, protocol issues, and
              common phishing patterns. Detection services are not connected yet — results below
              are a frontend preview.
            </p>
          </div>
          <button
            type="button"
            onClick={loadExample}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/10"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            Try an example
          </button>
        </div>

        <div className="mt-6">
          <label htmlFor="url-input" className="sr-only">
            Suspicious URL
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Link2 className="size-4" aria-hidden="true" />
            </span>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAnalyze();
              }}
              placeholder="https://example.com/suspicious-link"
              maxLength={MAX_CHARS + 50}
              className={cn(
                "w-full rounded-2xl border bg-surface/60 py-4 pl-11 pr-4 text-sm leading-relaxed text-foreground shadow-[var(--shadow-soft)] transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
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
                overLimit
                  ? "text-destructive"
                  : nearLimit
                    ? "text-primary"
                    : "text-muted-foreground",
              )}
            >
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            </span>
            {error ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="size-3.5" aria-hidden="true" />
                {error}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <MeshButton onClick={handleAnalyze} disabled={isAnalyzing} className="min-w-[10rem]">
            <ScanLine className="size-4" aria-hidden="true" />
            {isAnalyzing ? "Analyzing..." : "Analyze URL"}
          </MeshButton>
          <MeshButton
            variant="outline"
            onClick={handleClear}
            disabled={!url && !hasResult}
          >
            <X className="size-4" aria-hidden="true" />
            Clear
          </MeshButton>
        </div>
      </div>
    </section>
  );
}
