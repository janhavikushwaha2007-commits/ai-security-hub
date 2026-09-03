import {
  MessageSquareWarning,
  Link2,
  Globe2,
  ImageUp,
  FileSearch2,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

export interface ScanCenterScanner {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  status: "Ready" | "Preview" | "Attention";
  guidance: string;
}

export const scanCenterScanners: ScanCenterScanner[] = [
  {
    id: "scam-message",
    title: "Scam Message Detection",
    description: "Review suspicious SMS, email, and chat messages for manipulation patterns.",
    icon: MessageSquareWarning,
    route: "/scan-message",
    status: "Ready",
    guidance: "Use this when you receive an unexpected message asking for money, passwords, or urgent action.",
  },
  {
    id: "phishing-url",
    title: "Phishing URL Detection",
    description: "Inspect a suspicious link before clicking to see if it shows phishing signals.",
    icon: Link2,
    route: "/scan-url",
    status: "Ready",
    guidance: "Use this for shortened links, unexpected login links, or URLs sent via email and chat.",
  },
  {
    id: "fake-website",
    title: "Fake Website Detection",
    description: "Compare page structure and reputation signals against legitimate sources.",
    icon: Globe2,
    route: "/fake-website",
    status: "Ready",
    guidance: "Use this when a website looks like a brand you trust but something feels off.",
  },
  {
    id: "screenshot",
    title: "Screenshot Analysis",
    description: "Review a screenshot of a suspicious message or login page for phishing signals.",
    icon: ImageUp,
    route: "/scan-screenshot",
    status: "Ready",
    guidance: "Use this when someone shares a screenshot of an offer, login page, or security warning.",
  },
  {
    id: "malicious-file",
    title: "Malicious File Detection",
    description: "Examine attachments for risky payload indicators before you open them.",
    icon: FileSearch2,
    route: "/scan-file",
    status: "Ready",
    guidance: "Use this for unexpected invoices, archives, executables, or documents from unknown senders.",
  },
  {
    id: "password",
    title: "Password Strength Checker",
    description: "Measure credential resilience and get plain-language guidance.",
    icon: KeyRound,
    route: "/password-check",
    status: "Ready",
    guidance: "Use this to test a password idea before using it for an important account.",
  },
];

export interface GuidanceItem {
  contentType: string;
  scanner: string;
  route: string;
}

export const scanGuidance: GuidanceItem[] = [
  { contentType: "Text message, email, or chat", scanner: "Scam Message Detection", route: "/scan-message" },
  { contentType: "Suspicious link or URL", scanner: "Phishing URL Detection", route: "/scan-url" },
  { contentType: "Website that mimics a real brand", scanner: "Fake Website Detection", route: "/fake-website" },
  { contentType: "Screenshot of a suspicious page", scanner: "Screenshot Analysis", route: "/scan-screenshot" },
  { contentType: "Unexpected attachment", scanner: "Malicious File Detection", route: "/scan-file" },
  { contentType: "New password or passphrase", scanner: "Password Strength Checker", route: "/password-check" },
];
