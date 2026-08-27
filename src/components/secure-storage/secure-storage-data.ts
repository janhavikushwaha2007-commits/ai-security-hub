import { CloudUpload, type LucideIcon } from "lucide-react";

/**
 * Frontend-only demo model for the Secure Cloud Storage module.
 * Everything here lives in browser memory. Swap these helpers for a real
 * storage client (e.g. Firebase Storage / S3 signed uploads) later — the
 * component layer only depends on the types below.
 */

export const STORAGE_QUOTA_MB = 500;
export const STORAGE_QUOTA_BYTES = STORAGE_QUOTA_MB * 1024 * 1024;

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const SUPPORTED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "csv",
  "rtf",
  "json",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "svg",
  "zip",
  "rar",
  "7z",
  "mp4",
  "mp3",
] as const;

export const ACCEPT_ATTRIBUTE = SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(",");

export type SecurityStatus = "Scanned / Safe" | "Scanning" | "Needs Review";

export interface StoredFile {
  id: string;
  name: string;
  extension: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: SecurityStatus;
  note: string;
}

export const statusMeta: Record<
  SecurityStatus,
  { border: string; bg: string; text: string; dot: string }
> = {
  "Scanned / Safe": {
    border: "border-accent/40",
    bg: "bg-accent/10",
    text: "text-accent",
    dot: "bg-accent",
  },
  Scanning: {
    border: "border-primary/40",
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
  },
  "Needs Review": {
    border: "border-destructive/40",
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
  },
};

export interface PrivacyPoint {
  label: string;
  description: string;
  icon: LucideIcon;
}

export const uploadIcon: LucideIcon = CloudUpload;

export function getExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatUploadDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function createId(): string {
  return `file_${Math.random().toString(36).slice(2, 10)}`;
}

/** Sample vault contents so the list has realistic demo data on first load. */
export const demoFiles: StoredFile[] = [
  {
    id: "file_demo_01",
    name: "security-policy-2026.pdf",
    extension: "pdf",
    type: "PDF document",
    size: 2_411_520,
    uploadedAt: "2026-08-24T09:12:00.000Z",
    status: "Scanned / Safe",
    note: "Demo record — malware scan cleared, no embedded scripts detected.",
  },
  {
    id: "file_demo_02",
    name: "team-access-matrix.xlsx",
    extension: "xlsx",
    type: "Spreadsheet",
    size: 684_032,
    uploadedAt: "2026-08-22T16:40:00.000Z",
    status: "Scanned / Safe",
    note: "Demo record — macro-free workbook, safe to open.",
  },
  {
    id: "file_demo_03",
    name: "incident-evidence.zip",
    extension: "zip",
    type: "Archive",
    size: 18_874_368,
    uploadedAt: "2026-08-20T11:05:00.000Z",
    status: "Needs Review",
    note: "Demo record — archive contains an executable; review before extracting.",
  },
  {
    id: "file_demo_04",
    name: "phishing-sample.png",
    extension: "png",
    type: "Image",
    size: 1_048_576,
    uploadedAt: "2026-08-18T08:20:00.000Z",
    status: "Scanned / Safe",
    note: "Demo record — screenshot evidence, no risk indicators.",
  },
];
