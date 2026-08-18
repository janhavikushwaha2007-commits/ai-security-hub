/**
 * Static demo content for the Malicious File Detection module preview.
 * Replace with real file analysis service output once the backend is connected.
 */

export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/** Supported extensions, shown to the user and enforced client-side. */
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
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "exe",
  "msi",
  "dll",
  "apk",
  "js",
] as const;

export const ACCEPT_ATTRIBUTE = SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(",");

export function getExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export interface SelectedFileInfo {
  name: string;
  extension: string;
  size: number;
  type: string;
}

export interface FileSignal {
  label: string;
  description: string;
}

export interface DemoFileResult {
  riskLevel: "Safe" | "Suspicious" | "High Risk";
  riskScore: number;
  indicators: string[];
  signals: FileSignal[];
  explanation: string;
  recommendation: string;
}

export const demoFileResult: DemoFileResult = {
  riskLevel: "High Risk",
  riskScore: 78,
  indicators: [
    "Double extension pattern",
    "Obfuscated payload markers",
    "Auto-run script entry",
    "Unsigned publisher",
  ],
  signals: [
    {
      label: "Deceptive file naming",
      description:
        "The file name mimics a harmless document while the real extension is executable or macro-enabled.",
    },
    {
      label: "Embedded auto-run behavior",
      description:
        "Sample analysis shows an entry point that would execute immediately when the file is opened.",
    },
    {
      label: "Obfuscated content blocks",
      description:
        "Sections of the file appear encoded or packed, a common technique for hiding malicious logic.",
    },
    {
      label: "Outbound connection attempt",
      description:
        "The simulated behavior profile includes contacting an unknown remote host after execution.",
    },
  ],
  explanation:
    "This file combines deceptive naming, obfuscated content, and auto-run behavior — a pattern typically associated with malware delivered through email attachments and download links.",
  recommendation:
    "Do not open or run this file. Delete it from your device and empty the trash, and report the sender if it arrived by email or chat. If you already opened it, disconnect from the network and run a full device security check.",
};

export const riskMeta: Record<
  DemoFileResult["riskLevel"],
  { border: string; bg: string; text: string; dot: string; label: string }
> = {
  Safe: {
    border: "border-accent/40",
    bg: "bg-accent/10",
    text: "text-accent",
    dot: "bg-accent",
    label: "Safe",
  },
  Suspicious: {
    border: "border-primary/40",
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    label: "Suspicious",
  },
  "High Risk": {
    border: "border-destructive/40",
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
    label: "High Risk",
  },
};
