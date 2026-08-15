import {
  MessageSquareWarning,
  Link2Off,
  Globe2,
  FileSearch2,
  KeyRound,
  Bot,
  Gauge,
  BellRing,
  Layers,
  Lightbulb,
  ShieldCheck,
  History,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

/**
 * Static demo content for the landing page.
 * Replace with data from real services when the backend is connected.
 */

export interface SecurityModule {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const securityModules: SecurityModule[] = [
  {
    title: "Scam Message Detection",
    description:
      "Review suspicious SMS, email, and chat messages for manipulation patterns and urgency cues.",
    icon: MessageSquareWarning,
  },
  {
    title: "Phishing URL Detection",
    description:
      "Inspect links for lookalike domains, redirects, and structural signals commonly used in phishing.",
    icon: Link2Off,
  },
  {
    title: "Fake Website Identification",
    description:
      "Compare page structure, branding, and reputation signals against known legitimate sources.",
    icon: Globe2,
  },
  {
    title: "Malicious File Analysis",
    description:
      "Examine attachments and documents for risky payload indicators before you open them.",
    icon: FileSearch2,
  },
  {
    title: "Password Strength Analysis",
    description: "Measure credential resilience and get plain-language guidance to strengthen it.",
    icon: KeyRound,
  },
  {
    title: "AI Cybersecurity Assistant",
    description:
      "Ask questions about a threat and receive clear, jargon-free explanations and next steps.",
    icon: Bot,
  },
  {
    title: "Personal Security Score",
    description:
      "Track a single score summarising your exposure across every check you have performed.",
    icon: Gauge,
  },
  {
    title: "Security Reports & Alerts",
    description:
      "Keep a readable history of findings with alerts for the issues that need attention first.",
    icon: BellRing,
  },
];

export interface Step {
  label: string;
  description: string;
}

export const howItWorksSteps: Step[] = [
  { label: "Input", description: "Submit a message, link, file, or password you want reviewed." },
  { label: "Analysis", description: "Multiple detection layers examine the content in parallel." },
  { label: "Risk Assessment", description: "Signals are fused into a single, calibrated score." },
  { label: "Recommendations", description: "You get clear guidance on what to do next." },
];

export interface Benefit {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const benefits: Benefit[] = [
  {
    title: "Multi-layer threat analysis",
    description: "Independent checks cross-validate each other instead of relying on one signal.",
    icon: Layers,
  },
  {
    title: "Understandable results",
    description: "Findings are written in plain language, not raw security jargon.",
    icon: Lightbulb,
  },
  {
    title: "Risk scoring",
    description: "A consistent score makes it easy to compare threats and prioritise.",
    icon: ShieldCheck,
  },
  {
    title: "Security history",
    description: "Every review is stored so you can revisit patterns over time.",
    icon: History,
  },
  {
    title: "Actionable recommendations",
    description: "Each result ends with concrete steps you can take right away.",
    icon: ListChecks,
  },
];

export const architectureStages = [
  "User Input",
  "Preprocessing",
  "AI Analysis",
  "Risk Fusion",
  "Recommendation",
  "Dashboard",
];

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "About", href: "#about" },
];

export const footerColumns = [
  { title: "Product", links: ["Features", "Security Modules", "How It Works", "Roadmap"] },
  { title: "Security", links: ["Security Architecture", "Responsible Disclosure", "Status"] },
  { title: "Resources", links: ["Documentation", "Guides", "Threat Glossary"] },
  { title: "Company", links: ["About", "Contact", "Privacy", "Terms"] },
];
