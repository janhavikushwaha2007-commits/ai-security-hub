export type ReportType = "Message Analysis" | "Website Review" | "File Inspection" | "Security Summary";
export type ReportRisk = "Safe" | "Suspicious" | "High Risk";
export type ReportStatus = "Ready" | "Reviewed" | "Archived";
export type AlertSeverity = "Critical" | "High" | "Medium";

export interface ReportRecord {
  id: string;
  type: ReportType;
  title: string;
  date: string;
  riskLevel: ReportRisk;
  riskScore: number;
  status: ReportStatus;
  findings: string[];
  explanation: string;
  recommendedActions: string[];
}

export interface SecurityAlert {
  id: string;
  severity: AlertSeverity;
  date: string;
  description: string;
  recommendedAction: string;
}

/** Static examples for the frontend preview only; these are not real reports or alerts. */
export const demoReports: ReportRecord[] = [
  {
    id: "report-001",
    type: "Message Analysis",
    title: "Delivery-fee message review",
    date: "2026-10-19T14:35:00.000Z",
    riskLevel: "High Risk",
    riskScore: 86,
    status: "Ready",
    findings: ["Urgency and deadline pressure", "Unexpected payment request", "Unknown shortened link"],
    explanation:
      "This sample message combines a delivery problem with a fee request, a pattern often used to collect payment details.",
    recommendedActions: [
      "Do not pay or open the link.",
      "Check delivery status through the courier's official app or website.",
    ],
  },
  {
    id: "report-002",
    type: "Website Review",
    title: "Account portal domain review",
    date: "2026-10-18T10:10:00.000Z",
    riskLevel: "High Risk",
    riskScore: 92,
    status: "Reviewed",
    findings: ["Look-alike domain spelling", "Login form on an unrelated host", "Insecure form destination"],
    explanation:
      "The sample page imitates a familiar sign-in experience while using a domain unrelated to the service.",
    recommendedActions: [
      "Avoid entering account details.",
      "Open the service from its official app and report the suspicious domain.",
    ],
  },
  {
    id: "report-003",
    type: "File Inspection",
    title: "Archive attachment review",
    date: "2026-10-17T16:25:00.000Z",
    riskLevel: "High Risk",
    riskScore: 78,
    status: "Ready",
    findings: ["Executable inside an archive", "Double file extension", "Unknown sender"],
    explanation:
      "The sample archive contains a runnable-file indicator behind a document-style name, a common delivery trick.",
    recommendedActions: [
      "Do not extract or open the attachment.",
      "Confirm the file with its sender through a separate trusted channel.",
    ],
  },
  {
    id: "report-004",
    type: "Security Summary",
    title: "Weekly security snapshot",
    date: "2026-10-16T09:00:00.000Z",
    riskLevel: "Suspicious",
    riskScore: 54,
    status: "Reviewed",
    findings: ["Two sample items need review", "Password guidance not completed", "No real account settings connected"],
    explanation:
      "This illustrative summary combines fixed sample findings; it does not describe a real user or account.",
    recommendedActions: [
      "Review the suspicious sample items.",
      "Use the password checker for general guidance and enable stronger account security where available.",
    ],
  },
  {
    id: "report-005",
    type: "Website Review",
    title: "Retail storefront review",
    date: "2026-10-14T12:40:00.000Z",
    riskLevel: "Suspicious",
    riskScore: 61,
    status: "Archived",
    findings: ["Business details could not be verified", "Unusual checkout flow", "Very low sample domain age"],
    explanation:
      "The demo storefront contains trust gaps that warrant checking with the seller before sharing payment details.",
    recommendedActions: [
      "Avoid entering card details until the seller is independently verified.",
      "Prefer an established retailer with a known support channel.",
    ],
  },
  {
    id: "report-006",
    type: "Message Analysis",
    title: "Newsletter message review",
    date: "2026-10-12T08:15:00.000Z",
    riskLevel: "Safe",
    riskScore: 12,
    status: "Archived",
    findings: ["No credential request in sample", "No urgent payment language", "Sender pattern appears consistent"],
    explanation:
      "The sample newsletter contains no obvious manipulation or credential-request signals in this offline scenario.",
    recommendedActions: ["No action is needed for this sample. Continue to verify unexpected links before opening."],
  },
];

export const demoAlerts: SecurityAlert[] = [
  {
    id: "alert-001",
    severity: "Critical",
    date: "2026-10-19T14:35:00.000Z",
    description: "Sample delivery message requests an unexpected fee through an unfamiliar link.",
    recommendedAction: "Do not pay; verify delivery details with the courier directly.",
  },
  {
    id: "alert-002",
    severity: "High",
    date: "2026-10-18T10:10:00.000Z",
    description: "Sample account page uses a look-alike domain and requests sign-in details.",
    recommendedAction: "Close the page and visit the service through its official app.",
  },
  {
    id: "alert-003",
    severity: "High",
    date: "2026-10-17T16:25:00.000Z",
    description: "Sample archive attachment includes an executable-file warning signal.",
    recommendedAction: "Do not extract the archive; confirm the file with its sender.",
  },
  {
    id: "alert-004",
    severity: "Medium",
    date: "2026-10-14T12:40:00.000Z",
    description: "Sample storefront has unverified business details and an unusual checkout flow.",
    recommendedAction: "Verify the retailer independently before sharing payment information.",
  },
];

export const reportTypes: ReportType[] = [
  "Message Analysis",
  "Website Review",
  "File Inspection",
  "Security Summary",
];

export const reportRisks: ReportRisk[] = ["Safe", "Suspicious", "High Risk"];

export function formatReportDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const reportRiskClass: Record<ReportRisk, string> = {
  Safe: "border-accent/40 text-accent",
  Suspicious: "border-primary/40 text-primary",
  "High Risk": "border-destructive/50 text-destructive",
};

export const alertSeverityClass: Record<AlertSeverity, string> = {
  Critical: "border-destructive/50 text-destructive",
  High: "border-primary/40 text-primary",
  Medium: "border-violet/40 text-violet",
};