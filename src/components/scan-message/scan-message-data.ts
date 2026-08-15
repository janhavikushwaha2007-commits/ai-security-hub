/**
 * Static demo content for the Scan Message module preview.
 * Replace with real detection service output once the backend is connected.
 */

export const EXAMPLE_MESSAGE = `URGENT: Your parcel delivery failed. Pay ₹35 re-delivery fee now to avoid returning to sender. Click here: secure-login-verify.example.net`;

export const MAX_CHARS = 2000;

export interface WarningSignal {
  label: string;
  description: string;
}

export interface DemoResult {
  riskLevel: "Safe" | "Suspicious" | "High Risk";
  riskScore: number;
  signals: WarningSignal[];
  explanation: string;
  recommendation: string;
}

export const demoResult: DemoResult = {
  riskLevel: "Suspicious",
  riskScore: 68,
  signals: [
    {
      label: "Urgency pressure",
      description: "Uses words like \"URGENT\" and \"now\" to push quick action.",
    },
    {
      label: "Unexpected fee request",
      description: "Asks for a small payment to release a parcel or package.",
    },
    {
      label: "Lookalike link",
      description: "The URL resembles a login portal but uses an unrelated domain.",
    },
    {
      label: "Impersonation pattern",
      description: "Claims to be from a delivery or logistics service without proof.",
    },
  ],
  explanation:
    "This message shows several common scam patterns: it creates urgency, asks for an unexpected payment, and includes a suspicious link. The wording is designed to make you act before thinking.",
  recommendation:
    "Do not click the link or make any payment. Contact the delivery company directly through its official website or app. Delete the message once confirmed as suspicious.",
};

export const riskMeta: Record<
  DemoResult["riskLevel"],
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
