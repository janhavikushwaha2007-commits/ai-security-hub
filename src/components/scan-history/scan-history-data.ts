import {
  MessageSquareWarning,
  Link2,
  Globe2,
  ImageUp,
  FileSearch2,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

export type ScanType = "Message" | "URL" | "Website" | "Screenshot" | "File" | "Password";
export type RiskLevel = "Safe" | "Suspicious" | "High Risk";
export type ScanStatus = "Completed" | "Reviewed" | "Archived";

export interface ScanHistoryRecord {
  id: string;
  type: ScanType;
  /** Privacy-safe label only. Never store raw input, message bodies, or passwords. */
  label: string;
  riskLevel: RiskLevel;
  riskScore: number;
  /** ISO timestamp for sorting and date-range filtering. */
  timestamp: string;
  status: ScanStatus;
  signals: string[];
  explanation: string;
  recommendation: string;
}

export const scanTypeIcons: Record<ScanType, LucideIcon> = {
  Message: MessageSquareWarning,
  URL: Link2,
  Website: Globe2,
  Screenshot: ImageUp,
  File: FileSearch2,
  Password: KeyRound,
};

export const scanTypeRoutes: Record<ScanType, string> = {
  Message: "/scan-message",
  URL: "/scan-url",
  Website: "/fake-website",
  Screenshot: "/scan-screenshot",
  File: "/scan-file",
  Password: "/password-check",
};

export const scanTypes: ScanType[] = [
  "Message",
  "URL",
  "Website",
  "Screenshot",
  "File",
  "Password",
];

export const riskLevels: RiskLevel[] = ["Safe", "Suspicious", "High Risk"];

export type SortKey = "newest" | "oldest" | "highest" | "lowest";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest risk" },
  { value: "lowest", label: "Lowest risk" },
];

export type DateRangeKey = "all" | "24h" | "7d" | "30d";

export const dateRangeOptions: { value: DateRangeKey; label: string; days: number | null }[] = [
  { value: "all", label: "All time", days: null },
  { value: "24h", label: "Last 24 hours", days: 1 },
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
];

/**
 * DEMO DATA ONLY — static sample records used to preview the history interface.
 * These are not real scans and are never persisted. When a real backend is
 * connected later, replace this array with the fetched records; the record
 * shape above is the integration contract.
 */
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

export const demoScanHistory: ScanHistoryRecord[] = [
  {
    id: "sh-001",
    type: "Message",
    label: "SMS from +91 ••• ••42 — delivery notice",
    riskLevel: "High Risk",
    riskScore: 87,
    timestamp: hoursAgo(2),
    status: "Completed",
    signals: [
      "Urgency and deadline pressure",
      "Unexpected payment request",
      "Shortened link to unknown domain",
    ],
    explanation:
      "The sample message combines a fake delivery problem with a small fee request, a pattern commonly used to harvest card details.",
    recommendation: "Do not pay or tap the link. Check delivery status directly with the courier.",
  },
  {
    id: "sh-002",
    type: "URL",
    label: "secure-login-verify••••.co/account",
    riskLevel: "High Risk",
    riskScore: 92,
    timestamp: hoursAgo(6),
    status: "Completed",
    signals: [
      "Look-alike domain spelling",
      "Recently registered domain",
      "Login form on a non-brand host",
    ],
    explanation:
      "The sample link imitates a bank sign-in page on a domain unrelated to the real institution.",
    recommendation: "Avoid opening the link and report it to the impersonated brand.",
  },
  {
    id: "sh-003",
    type: "Website",
    label: "shop-clearance-outlet••••.store",
    riskLevel: "Suspicious",
    riskScore: 61,
    timestamp: hoursAgo(20),
    status: "Reviewed",
    signals: ["No verifiable business details", "Unusual checkout flow", "Very low domain age"],
    explanation:
      "The sample storefront shows several trust gaps typical of short-lived scam shops.",
    recommendation: "Avoid entering card details; prefer an established retailer.",
  },
  {
    id: "sh-004",
    type: "File",
    label: "invoice_march.zip (2.4 MB)",
    riskLevel: "High Risk",
    riskScore: 78,
    timestamp: hoursAgo(30),
    status: "Completed",
    signals: [
      "Executable hidden inside archive",
      "Double file extension",
      "Unknown sender attachment",
    ],
    explanation:
      "The sample archive hides a runnable file behind a document-style name — a common malware delivery trick.",
    recommendation: "Delete the attachment and confirm the invoice with the sender by phone.",
  },
  {
    id: "sh-005",
    type: "Screenshot",
    label: "Screenshot — bank login page capture",
    riskLevel: "Suspicious",
    riskScore: 58,
    timestamp: hoursAgo(46),
    status: "Reviewed",
    signals: ["Credential request visible", "Mismatched brand styling"],
    explanation:
      "The sample capture shows a login prompt whose layout does not match the official brand template.",
    recommendation: "Open the bank app directly rather than the page in the screenshot.",
  },
  {
    id: "sh-006",
    type: "Password",
    label: "Password check — value never stored",
    riskLevel: "Suspicious",
    riskScore: 45,
    timestamp: hoursAgo(52),
    status: "Completed",
    signals: ["Below recommended length", "No special characters"],
    explanation:
      "The sample credential met only part of the strength checks. The password itself is never displayed or retained.",
    recommendation: "Use a longer passphrase with mixed character types.",
  },
  {
    id: "sh-007",
    type: "Message",
    label: "Email from ••••@newsletter.example",
    riskLevel: "Safe",
    riskScore: 12,
    timestamp: hoursAgo(72),
    status: "Completed",
    signals: ["No credential request", "Verified sender pattern"],
    explanation: "The sample newsletter shows no manipulation or credential-harvesting signals.",
    recommendation: "No action needed.",
  },
  {
    id: "sh-008",
    type: "URL",
    label: "docs.example-vendor.com/guide",
    riskLevel: "Safe",
    riskScore: 8,
    timestamp: hoursAgo(96),
    status: "Archived",
    signals: ["HTTPS with valid certificate", "Established domain age"],
    explanation: "The sample link points to a long-standing documentation host.",
    recommendation: "Safe to open in the demo scenario.",
  },
  {
    id: "sh-009",
    type: "File",
    label: "quarterly_report.pdf (860 KB)",
    riskLevel: "Safe",
    riskScore: 15,
    timestamp: hoursAgo(120),
    status: "Archived",
    signals: ["No embedded scripts", "Expected file type"],
    explanation: "The sample document contains no active content indicators.",
    recommendation: "No action needed.",
  },
  {
    id: "sh-010",
    type: "Website",
    label: "portal-account-update••••.net",
    riskLevel: "High Risk",
    riskScore: 84,
    timestamp: hoursAgo(150),
    status: "Reviewed",
    signals: ["Brand impersonation", "Insecure form submission", "Poor domain reputation"],
    explanation: "The sample site copies a service portal while sending form data insecurely.",
    recommendation: "Do not enter any account details and report the domain.",
  },
  {
    id: "sh-011",
    type: "Screenshot",
    label: "Screenshot — prize claim popup",
    riskLevel: "High Risk",
    riskScore: 81,
    timestamp: hoursAgo(180),
    status: "Completed",
    signals: ["Too-good-to-be-true offer", "Countdown pressure", "Sensitive info request"],
    explanation: "The sample capture shows a classic prize-bait screen requesting personal data.",
    recommendation: "Close the page and never submit personal details to prize popups.",
  },
  {
    id: "sh-012",
    type: "Password",
    label: "Password check — value never stored",
    riskLevel: "Safe",
    riskScore: 10,
    timestamp: hoursAgo(220),
    status: "Archived",
    signals: ["Long passphrase", "Mixed character types", "Not in common-password list"],
    explanation: "The sample credential passed every strength check in the demo scenario.",
    recommendation: "Keep using a password manager to store it.",
  },
  {
    id: "sh-013",
    type: "Message",
    label: "WhatsApp from ••• ••17 — job offer",
    riskLevel: "Suspicious",
    riskScore: 64,
    timestamp: hoursAgo(260),
    status: "Reviewed",
    signals: ["Unsolicited job offer", "Off-platform contact request"],
    explanation: "The sample message uses recruitment framing to move the chat off-platform.",
    recommendation: "Verify the recruiter through the company's official channel.",
  },
  {
    id: "sh-014",
    type: "File",
    label: "setup_tool.exe (5.1 MB)",
    riskLevel: "Suspicious",
    riskScore: 69,
    timestamp: hoursAgo(300),
    status: "Completed",
    signals: ["Unsigned executable", "Requests elevated permissions"],
    explanation: "The sample installer is unsigned and asks for administrator rights.",
    recommendation: "Only install software from the vendor's official download page.",
  },
  {
    id: "sh-015",
    type: "URL",
    label: "bit.••/x9Kd2",
    riskLevel: "Suspicious",
    riskScore: 55,
    timestamp: hoursAgo(340),
    status: "Archived",
    signals: ["Shortened link hides destination", "Redirect chain detected"],
    explanation: "The sample short link masks its final destination behind several redirects.",
    recommendation: "Expand the link before opening it.",
  },
];

export const riskBadgeClass: Record<RiskLevel, string> = {
  Safe: "border-accent/40 text-accent",
  Suspicious: "border-primary/40 text-primary",
  "High Risk": "border-destructive/50 text-destructive",
};

export const riskDotClass: Record<RiskLevel, string> = {
  Safe: "bg-accent",
  Suspicious: "bg-primary",
  "High Risk": "bg-destructive",
};

export const statusBadgeClass: Record<ScanStatus, string> = {
  Completed: "border-accent/30 text-accent",
  Reviewed: "border-primary/30 text-primary",
  Archived: "border-border text-muted-foreground",
};

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
