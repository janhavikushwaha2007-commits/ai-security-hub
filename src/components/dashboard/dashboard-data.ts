import {
  MessageSquareWarning,
  Globe2,
  FileSearch2,
  KeyRound,
  CloudUpload,
  ImageUp,
  ShieldCheck,
  LayoutGrid,
  History,
  AlertTriangle,
  ScanLine,
  Clock3,
  Gauge,
  FileText,
  UserRound,
  Bot,
  type LucideIcon,
} from "lucide-react";

/**
 * Static demo content for the dashboard preview.
 * Replace with real service data once detection services are connected.
 */

export interface OverviewStat {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: "accent" | "violet" | "primary" | "muted";
}

export const overviewStats: OverviewStat[] = [
  {
    label: "Overall Security Score",
    value: "82 / 100",
    hint: "Good — 2 items need attention",
    icon: ShieldCheck,
    tone: "accent",
  },
  {
    label: "Threats Detected",
    value: "7",
    hint: "Across the last 30 days (demo)",
    icon: AlertTriangle,
    tone: "violet",
  },
  {
    label: "Scans Completed",
    value: "148",
    hint: "Messages, links, files & passwords",
    icon: ScanLine,
    tone: "primary",
  },
  {
    label: "Last Scan",
    value: "12 min ago",
    hint: "Phishing URL check — Safe",
    icon: Clock3,
    tone: "muted",
  },
];

export interface DashboardModule {
  title: string;
  description: string;
  status: "Ready" | "Preview" | "Attention";
  action: string;
  icon: LucideIcon;
}

export const dashboardModules: DashboardModule[] = [
  {
    title: "Scam Message Detection",
    description: "Review suspicious SMS, email, and chat messages for manipulation patterns.",
    status: "Ready",
    action: "Open Scanner",
    icon: MessageSquareWarning,
  },
  {
    title: "Fake Website Detection",
    description: "Compare page structure and reputation signals against legitimate sources.",
    status: "Ready",
    action: "Check Now",
    icon: Globe2,
  },
  {
    title: "Malicious File Detection",
    description: "Examine attachments for risky payload indicators before you open them.",
    status: "Ready",
    action: "Open Scanner",
    icon: FileSearch2,
  },
  {
    title: "Password Strength Checker",
    description: "Measure credential resilience and get plain-language guidance.",
    status: "Attention",
    action: "Check Now",
    icon: KeyRound,
  },
  {
    title: "Screenshot Analysis",
    description: "Review a screenshot of a suspicious message or login page for phishing signals.",
    status: "Ready",
    action: "Open Analyzer",
    icon: ImageUp,
  },
  {
    title: "Secure Cloud Storage",
    description: "Keep sensitive documents in a protected vault with a security status per file.",
    status: "Preview",
    action: "Open Vault",
    icon: CloudUpload,
  },
];

export interface ActivityItem {
  title: string;
  detail: string;
  time: string;
  verdict: "Safe" | "Suspicious" | "High Risk";
}

export const recentActivity: ActivityItem[] = [
  {
    title: "Suspicious link analyzed",
    detail: "secure-login-verify.example.net",
    time: "12 min ago",
    verdict: "Suspicious",
  },
  {
    title: "Password strength checked",
    detail: "Personal email account",
    time: "1 hr ago",
    verdict: "Safe",
  },
  {
    title: "File scan completed",
    detail: "invoice_march.pdf.exe",
    time: "3 hrs ago",
    verdict: "High Risk",
  },
  {
    title: "Scam message reviewed",
    detail: "\"Your parcel is on hold — pay ₹35\"",
    time: "Yesterday",
    verdict: "Suspicious",
  },
  {
    title: "Website reputation check",
    detail: "shop.trusted-brand.com",
    time: "Yesterday",
    verdict: "Safe",
  },
];

export interface ThreatSlice {
  label: "Safe" | "Suspicious" | "High Risk";
  value: number;
  className: string;
}

export const threatBreakdown: ThreatSlice[] = [
  { label: "Safe", value: 112, className: "bg-accent" },
  { label: "Suspicious", value: 27, className: "bg-primary" },
  { label: "High Risk", value: 9, className: "bg-destructive" },
];

export const quickActions = [
  { label: "Scan Center", icon: LayoutGrid },
  { label: "Scan History", icon: History },
  { label: "Security Score", icon: Gauge },
  { label: "Reports & Alerts", icon: FileText },
  { label: "Scan Message", icon: MessageSquareWarning },
  { label: "Check Website", icon: Globe2 },
  { label: "Scan File", icon: FileSearch2 },
  { label: "Check Password", icon: KeyRound },
  { label: "Secure Storage", icon: CloudUpload },
  { label: "Scan Screenshot", icon: ImageUp },
  { label: "Check Now", icon: ShieldCheck },
  { label: "Profile & Settings", icon: UserRound },
  { label: "Security Assistant", icon: Bot },
];
