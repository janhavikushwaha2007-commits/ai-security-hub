/**
 * Static demo content for the Screenshot / Image Analysis module preview.
 *
 * FRONTEND ONLY: nothing here performs OCR, AI, or any real image inspection.
 * The selected image never leaves the browser. Replace `getDemoScreenshotResult`
 * with a real analysis service response once a backend is connected.
 */

export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const SUPPORTED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;

export const IMAGE_ACCEPT_ATTRIBUTE = "image/png,image/jpeg,image/webp";

export function getExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export interface SelectedImageInfo {
  name: string;
  extension: string;
  size: number;
  type: string;
  /** Object URL used only for the local preview; revoked when replaced. */
  previewUrl: string;
}

export type ScreenshotRiskLevel = "Safe" | "Suspicious" | "High Risk";

export interface ScreenshotSignal {
  label: string;
  description: string;
  /** Whether this signal counts against the screenshot. */
  detected: boolean;
}

export interface ScreenshotAnalysis {
  scenario: ScreenshotScenarioId;
  riskLevel: ScreenshotRiskLevel;
  riskScore: number;
  signals: ScreenshotSignal[];
  explanation: string;
  recommendations: string[];
}

export type ScreenshotScenarioId = "safe" | "suspicious" | "high-risk";

export interface ScreenshotScenario {
  id: ScreenshotScenarioId;
  label: string;
  hint: string;
}

export const screenshotScenarios: ScreenshotScenario[] = [
  { id: "safe", label: "Safe demo", hint: "Legitimate app screen" },
  { id: "suspicious", label: "Suspicious demo", hint: "Pressure language" },
  { id: "high-risk", label: "High risk demo", hint: "Credential phishing" },
];

const demoResults: Record<ScreenshotScenarioId, ScreenshotAnalysis> = {
  safe: {
    scenario: "safe",
    riskLevel: "Safe",
    riskScore: 12,
    explanation:
      "In this demo scenario the screenshot resembles an ordinary application screen: no credential prompt, no urgency wording, and no payment request. Nothing in the sample pattern set matches a known social-engineering layout.",
    signals: [
      {
        label: "Suspicious login / credential request",
        description: "No password, OTP, or recovery-code field appears in this demo layout.",
        detected: false,
      },
      {
        label: "Urgency or pressure language",
        description: "No countdowns, threats of account closure, or 'act now' phrasing.",
        detected: false,
      },
      {
        label: "Brand impersonation indicators",
        description: "Logo, spacing, and typography match the expected brand presentation.",
        detected: false,
      },
      {
        label: "Suspicious URL / domain visible",
        description: "The visible address bar shows a normal domain over HTTPS.",
        detected: false,
      },
      {
        label: "Payment or sensitive-information request",
        description: "No card, UPI, or identity-document request is present.",
        detected: false,
      },
    ],
    recommendations: [
      "No action needed for this demo scenario.",
      "Still confirm the sender through an official channel before acting on any screen you were sent.",
      "Keep two-factor authentication enabled on important accounts.",
    ],
  },
  suspicious: {
    scenario: "suspicious",
    riskLevel: "Suspicious",
    riskScore: 56,
    explanation:
      "This demo scenario mixes normal-looking branding with pressure wording and an unusual link. That combination is common in messages that try to move you quickly before you verify the source.",
    signals: [
      {
        label: "Suspicious login / credential request",
        description: "A sign-in prompt appears, but without an obvious credential-harvesting form.",
        detected: false,
      },
      {
        label: "Urgency or pressure language",
        description: "Wording such as 'expires in 15 minutes' pushes for an immediate decision.",
        detected: true,
      },
      {
        label: "Brand impersonation indicators",
        description: "The logo is close to a known brand but the wordmark spacing looks off.",
        detected: true,
      },
      {
        label: "Suspicious URL / domain visible",
        description: "A shortened link is visible instead of the brand's real domain.",
        detected: true,
      },
      {
        label: "Payment or sensitive-information request",
        description: "No direct payment request appears in this demo layout.",
        detected: false,
      },
    ],
    recommendations: [
      "Do not tap links inside the screenshot — open the service from your own bookmark or app.",
      "Verify the request with the company using a phone number or address you already trust.",
      "Ignore the deadline; genuine services do not require action within minutes.",
    ],
  },
  "high-risk": {
    scenario: "high-risk",
    riskLevel: "High Risk",
    riskScore: 88,
    explanation:
      "This demo scenario shows a classic credential-phishing screen: a copied brand header, a password and OTP form, an unrelated domain, and a payment step. Screens like this are built to capture logins and money in a single flow.",
    signals: [
      {
        label: "Suspicious login / credential request",
        description: "Password and one-time-code fields are shown on a non-official page.",
        detected: true,
      },
      {
        label: "Urgency or pressure language",
        description: "'Account will be suspended today' is used to prevent verification.",
        detected: true,
      },
      {
        label: "Brand impersonation indicators",
        description: "A well-known brand header is reused on an unrelated page layout.",
        detected: true,
      },
      {
        label: "Suspicious URL / domain visible",
        description: "The visible address uses a look-alike domain with extra hyphens.",
        detected: true,
      },
      {
        label: "Payment or sensitive-information request",
        description: "A card number and CVV are requested to 'reactivate' the account.",
        detected: true,
      },
    ],
    recommendations: [
      "Do not enter any credentials, OTP, or payment details on this screen.",
      "If you already submitted details, change the password immediately and revoke active sessions.",
      "Contact your bank to block the card if payment information was shared.",
      "Report the message to the impersonated brand and delete it.",
    ],
  },
};

/** Returns a clearly-labelled demo analysis. No image data is inspected. */
export function getDemoScreenshotResult(scenario: ScreenshotScenarioId): ScreenshotAnalysis {
  return demoResults[scenario];
}

export const riskMeta: Record<
  ScreenshotRiskLevel,
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
