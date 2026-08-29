import { useMemo, useState } from "react";
import { ChevronDown, FileText, Search, Trash2 } from "lucide-react";
import { MeshButton } from "@/components/mesh/MeshButton";
import {
  formatFileSize,
  formatUploadDate,
  statusMeta,
  type StoredFile,
} from "./secure-storage-data";
import { cn } from "@/lib/utils";

interface SecureStorageListProps {
  files: StoredFile[];
  onDelete: (id: string) => void;
}

export function SecureStorageList({ files, onDelete }: SecureStorageListProps) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(q) ||
        file.extension.includes(q) ||
        file.status.toLowerCase().includes(q),
    );
  }, [files, query]);

  return (
    <section aria-labelledby="stored-files-heading" className="surface-card p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="stored-files-heading" className="text-lg font-semibold sm:text-xl">
            Stored files
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {files.length} file{files.length === 1 ? "" : "s"} in your demo vault
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, type, or status"
            aria-label="Search stored files"
            className="h-11 w-full rounded-xl border border-border bg-surface/60 pl-9 pr-3 text-sm shadow-[var(--shadow-soft)] outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/60"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border bg-surface/40 p-8 text-center text-sm text-muted-foreground">
          No files match “{query}”. Try a different search term.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((file) => {
            const meta = statusMeta[file.status];
            const isOpen = openId === file.id;
            return (
              <li
                key={file.id}
                className="rounded-2xl border border-border bg-surface/60 shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-accent/40 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="flex flex-wrap items-center gap-4 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-accent">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {file.extension.toUpperCase()} · {file.type} · {formatFileSize(file.size)} ·{" "}
                      {formatUploadDate(file.uploadedAt)}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
                      meta.border,
                      meta.bg,
                      meta.text,
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden="true" />
                    {file.status}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : file.id)}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Hide" : "Show"} details for ${file.name}`}
                      className="press-3d grid size-9 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground"
                    >
                      <ChevronDown
                        className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(file.id)}
                      aria-label={`Delete ${file.name}`}
                      className="press-3d grid size-9 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:border-destructive/50 hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {isOpen ? (
                  <div className="border-t border-border px-4 py-4">
                    <dl className="grid gap-3 text-xs sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">File type</dt>
                        <dd className="mt-0.5 font-medium text-foreground">{file.type}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Size</dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {formatFileSize(file.size)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Uploaded</dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {formatUploadDate(file.uploadedAt)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Security status</dt>
                        <dd className={cn("mt-0.5 font-medium", meta.text)}>{file.status}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {file.note}
                    </p>
                    <div className="mt-4">
                      <MeshButton
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(file.id)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Remove from vault
                      </MeshButton>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
