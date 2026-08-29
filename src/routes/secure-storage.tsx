import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SecureStorageHeader } from "@/components/secure-storage/SecureStorageHeader";
import { StorageUsage } from "@/components/secure-storage/StorageUsage";
import {
  SecureStorageUploader,
  type PendingUpload,
} from "@/components/secure-storage/SecureStorageUploader";
import { SecureStorageList } from "@/components/secure-storage/SecureStorageList";
import { SecureStorageEmpty } from "@/components/secure-storage/SecureStorageEmpty";
import { createId, demoFiles, type StoredFile } from "@/components/secure-storage/secure-storage-data";

const title = "Secure Cloud Storage — Protected File Vault | AI Security Mesh";
const description =
  "Preview the AI Security Mesh secure storage vault: drag-and-drop uploads, animated storage meter, per-file security status, search, and file details — a frontend demo.";

export const Route = createFileRoute("/secure-storage")({
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
  component: SecureStoragePage,
});

function SecureStoragePage() {
  const [files, setFiles] = useState<StoredFile[]>(demoFiles);
  const [progress, setProgress] = useState(0);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearInterval(id));
  }, []);

  const handleUpload = (pending: PendingUpload) => {
    setSuccessName(null);
    setUploadingName(pending.name);
    setProgress(0);

    let current = 0;
    const interval = window.setInterval(() => {
      current = Math.min(100, current + Math.round(8 + Math.random() * 14));
      setProgress(current);
      if (current >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setFiles((prev) => [
            {
              id: createId(),
              name: pending.name,
              extension: pending.extension,
              size: pending.size,
              type: pending.type,
              uploadedAt: new Date().toISOString(),
              status: "Scanned / Safe",
              note: "Demo record — this file is held in your browser session only and was not sent to any server.",
            },
            ...prev,
          ]);
          setUploadingName(null);
          setSuccessName(pending.name);
          setProgress(0);
        }, 350);
      }
    }, 180);
    timers.current.push(interval);
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <SecureStorageHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-4xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Secure Cloud Storage</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A protected vault for your sensitive documents, with a security status on every file.
              This is a frontend preview — uploads are simulated in your browser and no cloud
              storage backend is connected yet.
            </p>
          </div>

          <StorageUsage files={files} />

          <SecureStorageUploader
            onUpload={handleUpload}
            isUploading={uploadingName !== null}
            progress={progress}
            uploadingName={uploadingName}
            successName={successName}
          />

          {files.length > 0 ? (
            <SecureStorageList files={files} onDelete={handleDelete} />
          ) : (
            <SecureStorageEmpty />
          )}
        </div>
      </main>
    </div>
  );
}
