/**
 * Static demo content for the Scan URL module preview.
 * Replace with real URL analysis service output once the backend is connected.
 */

export const EXAMPLE_URL = "https://secure-login-verify.example.net/account/verify?session=expired";

export const MAX_CHARS = 2048;

export interface UrlSignal {
  label: string;
  description: string;
}

export interface DemoUrlResult {
  riskLevel: "Safe" | "Suspicious" | "High Risk";
  riskScore: number;
  signals: UrlSignal[];
  explanation: string;
  recommendation: string;
}

export const demoUrlResult: DemoUrlResult = {
  riskLevel: "High Risk",
  riskScore: 72,
  signals: [
    {
      label: "Lookalike domain",
      description: "The domain impersonates a trusted login portal using a misleading name.",
    },
    {
      label: "Suspicious path",
      description: "The URL path asks for account verification with an urgent-sounding parameter.",
    },
    {
      label: "No reputable host match",
      description: "The registered domain does not match known official service infrastructure.",
    },
    {
      label: "Urgency framing",
      description: "Query parameters like 'session=expired' are commonly used to pressure users.",
    },
  ],
  explanation:
    "This URL combines several red flags: a lookalike domain, a suspicious verification path, and urgency parameters. These patterns are commonly used in phishing campaigns to steal credentials.",
  recommendation:
    "Do not enter any credentials or personal information. Navigate to the official website directly by typing its known address in your browser. Report the link if possible and delete the message.",
};

export const riskMeta: Record<
  DemoUrlResult["riskLevel"],
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
