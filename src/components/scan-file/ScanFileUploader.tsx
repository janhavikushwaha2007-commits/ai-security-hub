import { useRef, useState, type DragEvent } from "react";
import { MeshButton } from "@/components/mesh/MeshButton";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  ScanLine,
  UploadCloud,
  X,
} from "lucide-react";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  SUPPORTED_EXTENSIONS,
  formatFileSize,
  getExtension,
  type SelectedFileInfo,
} from "./scan-file-data";
import { cn } from "@/lib/utils";

interface ScanFileUploaderProps {
  file: SelectedFileInfo | null;
  onSelectFile: (file: SelectedFileInfo | null) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
  hasResult: boolean;
}

export function ScanFileUploader({
  file,
  onSelectFile,
  onAnalyze,
  onClear,
  isAnalyzing,
  hasResult,
}: ScanFileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSelect = (picked: File) => {
    const extension = getExtension(picked.name);
    if (!extension || !(SUPPORTED_EXTENSIONS as readonly string[]).includes(extension)) {
      setError(`Unsupported file type${extension ? ` (.${extension})` : ""}. Choose a supported document or archive.`);
      onSelectFile(null);
      return;
    }
    if (picked.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large (${formatFileSize(picked.size)}). Maximum size is ${MAX_FILE_SIZE_MB} MB.`);
      onSelectFile(null);
      return;
    }
    setError(null);
    onSelectFile({
      name: picked.name,
      extension,
      size: picked.size,
      type: picked.type || `${extension.toUpperCase()} file`,
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSelect(dropped);
  };

  const handleAnalyze = () => {
    if (!file) {
      setError("Please select a file to analyze.");
      return;
    }
    setError(null);
    onAnalyze();
  };

  const handleRemove = () => {
    if (inputRef.current) inputRef.current.value = "";
    setError(null);
    onSelectFile(null);
    onClear();
  };

  return (
    <section aria-labelledby="scan-file-heading" className="scroll-mt-24">
      <div className="surface-card p-5 sm:p-7">
        <div>
          <h2 id="scan-file-heading" className="text-lg font-semibold sm:text-xl">
            Upload a suspicious file
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This scanner is designed to review attachments and downloads for risky payload
            indicators before you open them. Detection services are not connected yet — the file
            stays in your browser and results below are a frontend preview.
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
            Drag &amp; drop a file here
          </p>
          <p className="mt-1 text-xs text-muted-foreground">or</p>
          <div className="mt-3">
            <MeshButton variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              <FileText className="size-4" aria-hidden="true" />
              Choose File
            </MeshButton>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            className="sr-only"
            aria-label="Choose a file to analyze"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) validateAndSelect(picked);
            }}
          />
          <p className="mt-5 max-w-lg text-xs leading-relaxed text-muted-foreground">
            Supported: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, RTF, ZIP, RAR, 7Z, TAR, GZ,
            EXE, MSI, DLL, APK, JS
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Maximum file size: {MAX_FILE_SIZE_MB} MB
          </p>
        </div>

        {error ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5" aria-hidden="true" />
            {error}
          </p>
        ) : null}

        {file ? (
          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface/60 p-4 shadow-[var(--shadow-soft)] transition-shadow">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-accent">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {file.extension.toUpperCase()} · {file.type} · {formatFileSize(file.size)}
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
            </div>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove selected file"
              className="press-3d grid size-9 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-destructive"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {isAnalyzing ? (
          <div className="mt-5 overflow-hidden rounded-full bg-surface/70">
            <div className="animate-scan-sweep h-1.5 w-1/3 rounded-full bg-[image:var(--gradient-brand)]" />
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <MeshButton onClick={handleAnalyze} disabled={isAnalyzing} className="min-w-[10rem]">
            {isAnalyzing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ScanLine className="size-4" aria-hidden="true" />
            )}
            {isAnalyzing ? "Analyzing..." : "Analyze File"}
          </MeshButton>
          <MeshButton variant="outline" onClick={handleRemove} disabled={!file && !hasResult}>
            <X className="size-4" aria-hidden="true" />
            {hasResult ? "Analyze Another File" : "Clear"}
          </MeshButton>
        </div>
      </div>
    </section>
  );
}
