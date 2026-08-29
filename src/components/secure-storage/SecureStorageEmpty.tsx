import { FolderLock, CloudUpload } from "lucide-react";

export function SecureStorageEmpty() {
  return (
    <section
      aria-labelledby="storage-empty-heading"
      className="surface-card flex flex-col items-center justify-center p-8 text-center sm:p-12"
    >
      <span className="grid size-16 place-items-center rounded-2xl border border-border bg-surface/70 shadow-[var(--shadow-soft)]">
        <FolderLock className="size-7 text-muted-foreground" aria-hidden="true" />
      </span>
      <h2 id="storage-empty-heading" className="mt-5 text-lg font-semibold sm:text-xl">
        Your secure vault is empty
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Add a file with{" "}
        <span className="inline-flex items-center gap-1 font-medium text-accent">
          <CloudUpload className="size-3.5" aria-hidden="true" />
          Choose File
        </span>{" "}
        or drag one into the upload area above. In this frontend preview files are kept in browser
        memory only — nothing is sent anywhere.
      </p>
    </section>
  );
}
