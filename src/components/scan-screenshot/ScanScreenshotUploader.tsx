import { useRef, useState, type DragEvent } from "react";
import { MeshButton } from "@/components/mesh/MeshButton";
import {
  AlertCircle,
  CheckCircle2,
  ImageUp,
  Loader2,
  RefreshCcw,
  ScanLine,
  UploadCloud,
  X,
} from "lucide-react";
import {
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
  SUPPORTED_IMAGE_EXTENSIONS,
  formatFileSize,
  getExtension,
  screenshotScenarios,
  type ScreenshotScenarioId,
  type SelectedImageInfo,
} from "./scan-screenshot-data";
import { cn } from "@/lib/utils";

interface ScanScreenshotUploaderProps {
  image: SelectedImageInfo | null;
  scenario: ScreenshotScenarioId;
  onScenarioChange: (scenario: ScreenshotScenarioId) => void;
  onSelectImage: (image: SelectedImageInfo | null) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
  hasResult: boolean;
}

export function ScanScreenshotUploader({
  image,
  scenario,
  onScenarioChange,
  onSelectImage,
  onAnalyze,
  onClear,
  isAnalyzing,
  hasResult,
}: ScanScreenshotUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSelect = (picked: File) => {
    const extension = getExtension(picked.name);
    const isSupported =
      (SUPPORTED_IMAGE_EXTENSIONS as readonly string[]).includes(extension) &&
      (picked.type === "" || picked.type.startsWith("image/"));

    if (!isSupported) {
      setError(
        `Unsupported file type${extension ? ` (.${extension})` : ""}. Choose a PNG, JPG, JPEG, or WEBP image.`,
      );
      onSelectImage(null);
      return;
    }
    if (picked.size > MAX_IMAGE_SIZE_BYTES) {
      setError(
        `Image is too large (${formatFileSize(picked.size)}). Maximum size is ${MAX_IMAGE_SIZE_MB} MB.`,
      );
      onSelectImage(null);
      return;
    }
    setError(null);
    onSelectImage({
      name: picked.name,
      extension,
      size: picked.size,
      type: picked.type || `${extension.toUpperCase()} image`,
      previewUrl: URL.createObjectURL(picked),
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSelect(dropped);
  };

  const handleAnalyze = () => {
    if (!image) {
      setError("Please select a screenshot to analyze.");
      return;
    }
    setError(null);
    onAnalyze();
  };

  const handleRemove = () => {
    if (inputRef.current) inputRef.current.value = "";
    setError(null);
    onSelectImage(null);
    onClear();
  };

  return (
    <section aria-labelledby="scan-screenshot-heading" className="scroll-mt-24">
      <div className="surface-card p-5 sm:p-7">
        <div>
          <h2 id="scan-screenshot-heading" className="text-lg font-semibold sm:text-xl">
            Add a screenshot
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Review a screenshot of a suspicious message, login page, or payment prompt. No AI, OCR,
            or detection service is connected in this build — the image stays in your browser and
            the result below is a labelled demo.
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-10 text-center transition-all duration-200",
            isDragging
              ? "scale-[1.01] border-accent bg-accent/10 shadow-[var(--shadow-glow)]"
              : error
                ? "border-destructive/60 bg-surface/40"
                : "border-border bg-surface/40 hover:border-accent/50 hover:bg-surface/60",
          )}
        >
          <span
            className={cn(
              "grid size-14 place-items-center rounded-2xl border border-border bg-surface/70 shadow-[var(--shadow-soft)] transition-colors",
              isDragging ? "text-accent" : "text-muted-foreground",
            )}
          >
            <UploadCloud className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-medium text-foreground">
            Drag &amp; drop a screenshot here
          </p>
          <p className="mt-1 text-xs text-muted-foreground">or</p>
          <div className="mt-3">
            <MeshButton variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              <ImageUp className="size-4" aria-hidden="true" />
              Choose Screenshot
            </MeshButton>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_ACCEPT_ATTRIBUTE}
            className="sr-only"
            aria-label="Choose a screenshot to analyze"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) validateAndSelect(picked);
            }}
          />
          <p className="mt-5 max-w-lg text-xs leading-relaxed text-muted-foreground">
            Supported formats: PNG, JPG, JPEG, WEBP
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Maximum image size: {MAX_IMAGE_SIZE_MB} MB
          </p>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-destructive"
          >
            <AlertCircle className="size-3.5" aria-hidden="true" />
            {error}
          </p>
        ) : null}

        {image ? (
          <div className="lift-hover mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface/60 p-4 shadow-[var(--shadow-soft)]">
            <div className="relative shrink-0 overflow-hidden rounded-xl border border-border bg-surface/70">
              <img
                src={image.previewUrl}
                alt={`Preview of the selected screenshot ${image.name}`}
                className="size-20 object-cover sm:size-24"
              />
              {isAnalyzing ? (
                <span
                  aria-hidden="true"
                  className="animate-scan-sweep absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{image.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {image.extension.toUpperCase()} · {image.type} · {formatFileSize(image.size)}
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-primary" aria-hidden="true" />
                    <span className="text-primary">Analyzing…</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5 text-accent" aria-hidden="true" />
                    <span className="text-accent">Ready to analyze</span>
                  </>
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <MeshButton variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                  <RefreshCcw className="size-4" aria-hidden="true" />
                  Replace
                </MeshButton>
                <MeshButton variant="outline" size="sm" onClick={handleRemove}>
                  <X className="size-4" aria-hidden="true" />
                  Remove
                </MeshButton>
              </div>
            </div>
          </div>
        ) : null}

        <fieldset className="mt-6">
          <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Demo scenario
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {screenshotScenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onScenarioChange(s.id)}
                aria-pressed={scenario === s.id}
                className={cn(
                  "press-3d rounded-xl border px-3.5 py-2 text-left text-xs font-medium shadow-[var(--shadow-soft)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  scenario === s.id
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-border bg-surface/60 text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="block">{s.label}</span>
                <span className="mt-0.5 block text-[0.7rem] font-normal opacity-80">{s.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {isAnalyzing ? (
          <div className="mt-5 overflow-hidden rounded-full bg-surface/70">
            <div className="animate-scan-sweep h-1.5 w-1/3 rounded-full bg-[image:var(--gradient-brand)]" />
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <MeshButton onClick={handleAnalyze} disabled={isAnalyzing} className="min-w-[11rem]">
            {isAnalyzing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ScanLine className="size-4" aria-hidden="true" />
            )}
            {isAnalyzing ? "Analyzing..." : "Analyze Screenshot"}
          </MeshButton>
          <MeshButton variant="outline" onClick={handleRemove} disabled={!image && !hasResult}>
            <X className="size-4" aria-hidden="true" />
            {hasResult ? "Analyze Another Screenshot" : "Clear"}
          </MeshButton>
        </div>
      </div>
    </section>
  );
}
