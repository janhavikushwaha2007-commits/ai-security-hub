import { useRef, useState, type DragEvent } from "react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { AlertCircle, CheckCircle2, CloudUpload, FileUp, Loader2, ShieldCheck } from "lucide-react";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  SUPPORTED_EXTENSIONS,
  formatFileSize,
  getExtension,
} from "./secure-storage-data";
import { cn } from "@/lib/utils";

export interface PendingUpload {
  name: string;
  extension: string;
  size: number;
  type: string;
}

interface SecureStorageUploaderProps {
  onUpload: (file: PendingUpload) => void;
  isUploading: boolean;
  progress: number;
  uploadingName: string | null;
  successName: string | null;
}

export function SecureStorageUploader({
  onUpload,
  isUploading,
  progress,
  uploadingName,
  successName,
}: SecureStorageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndUpload = (picked: File) => {
    const extension = getExtension(picked.name);
    if (!extension || !(SUPPORTED_EXTENSIONS as readonly string[]).includes(extension)) {
      setError(
        `Unsupported file type${extension ? ` (.${extension})` : ""}. Choose a supported document, image, or archive.`,
      );
      return;
    }
    if (picked.size > MAX_FILE_SIZE_BYTES) {
      setError(
        `File is too large (${formatFileSize(picked.size)}). Maximum size is ${MAX_FILE_SIZE_MB} MB.`,
      );
      return;
    }
    setError(null);
    onUpload({
      name: picked.name,
      extension,
      size: picked.size,
      type: picked.type || `${extension.toUpperCase()} file`,
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndUpload(dropped);
  };

  return (
    <section aria-labelledby="secure-upload-heading" className="scroll-mt-24">
      <div className="surface-card p-5 sm:p-7">
        <div>
          <h2 id="secure-upload-heading" className="text-lg font-semibold sm:text-xl">
            Upload to your secure vault
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Add important documents to a protected space with a security status for every file. This
            is a frontend preview — files stay in your browser session and no cloud storage service
            is connected yet.
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
            <CloudUpload className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-medium text-foreground">Drag &amp; drop a file here</p>
          <p className="mt-1 text-xs text-muted-foreground">or</p>
          <div className="mt-3">
            <MeshButton
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              <FileUp className="size-4" aria-hidden="true" />
              Choose File
            </MeshButton>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            className="sr-only"
            aria-label="Choose a file to store securely"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) validateAndUpload(picked);
              e.target.value = "";
            }}
          />
          <p className="mt-5 max-w-lg text-xs leading-relaxed text-muted-foreground">
            Supported: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, RTF, JSON, PNG, JPG, JPEG,
            WEBP, SVG, ZIP, RAR, 7Z, MP4, MP3
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Maximum file size: {MAX_FILE_SIZE_MB} MB
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

        {isUploading ? (
          <div className="mt-5 rounded-2xl border border-border bg-surface/60 p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="inline-flex min-w-0 items-center gap-2 font-medium text-primary">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                <span className="truncate">Encrypting &amp; uploading {uploadingName}</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">{progress}%</span>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-surface/80"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Upload progress"
            >
              <div
                className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}

        {!isUploading && successName ? (
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {successName} added to your vault — demo security scan cleared.
          </p>
        ) : null}

        <p className="mt-6 inline-flex items-start gap-2 rounded-xl border border-border bg-surface/50 p-3 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
          Privacy: files never leave your device in this preview. When a real storage backend is
          connected, uploads will be encrypted in transit and at rest, and access will be limited to
          your account.
        </p>
      </div>
    </section>
  );
}
