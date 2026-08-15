import { useState } from "react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { ScanLine, Sparkles, X, AlertCircle } from "lucide-react";
import { EXAMPLE_MESSAGE, MAX_CHARS } from "./scan-message-data";
import { cn } from "@/lib/utils";

interface ScanMessageFormProps {
  onAnalyze: (message: string) => void;
  onClear: () => void;
  isAnalyzing: boolean;
  hasResult: boolean;
}

export function ScanMessageForm({ onAnalyze, onClear, isAnalyzing, hasResult }: ScanMessageFormProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const charCount = message.length;
  const nearLimit = charCount > MAX_CHARS * 0.9;
  const overLimit = charCount > MAX_CHARS;

  const handleAnalyze = () => {
    if (!message.trim()) {
      setError("Please enter a message to analyze.");
      return;
    }
    if (overLimit) {
      setError(`Message must be ${MAX_CHARS.toLocaleString()} characters or fewer.`);
      return;
    }
    setError(null);
    onAnalyze(message.trim());
  };

  const handleClear = () => {
    setMessage("");
    setError(null);
    onClear();
  };

  const loadExample = () => {
    setMessage(EXAMPLE_MESSAGE);
    setError(null);
  };

  return (
    <section aria-labelledby="scan-message-heading" className="scroll-mt-24">
      <div className="surface-card p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="scan-message-heading" className="text-lg font-semibold sm:text-xl">
              Paste or type a suspicious message
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This scanner checks for manipulation patterns, urgency cues, suspicious links, and
              common scam language. Detection services are not connected yet — results below are a
              frontend preview.
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
          <label htmlFor="message-input" className="sr-only">
            Suspicious message
          </label>
          <textarea
            id="message-input"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste an SMS, email, or chat message you want to review..."
            rows={8}
            maxLength={MAX_CHARS + 50}
            className={cn(
              "w-full resize-y rounded-2xl border bg-surface/60 p-4 text-sm leading-relaxed text-foreground shadow-[var(--shadow-soft)] transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
              overLimit
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-border",
            )}
          />
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
          <MeshButton
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="min-w-[10rem]"
          >
            <ScanLine className="size-4" aria-hidden="true" />
            {isAnalyzing ? "Analyzing..." : "Analyze Message"}
          </MeshButton>
          <MeshButton
            variant="outline"
            onClick={handleClear}
            disabled={!message && !hasResult}
          >
            <X className="size-4" aria-hidden="true" />
            Clear
          </MeshButton>
        </div>
      </div>
    </section>
  );
}
