import {
  MessageSquareWarning,
  Globe2,
  FileSearch2,
  KeyRound,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

/**
 * DEMO SCORING MODEL — frontend preview only.
 *
 * Every value in this file is a fixed sample constant, not a measurement of a
 * real user's security posture. The score is computed deterministically from
 * these constants, so the same numbers appear on every render / reload.
 *
 * Future integration boundary:
 *   Replace `demoFactors` with authenticated user data from the real scoring
 *   engine and keep `computeSecurityScore()` (or swap it for the server-side
 *   score) — the UI components read only the returned shape.
 */

export type FactorStatus = "Strong" | "Good" | "Needs Attention" | "At Risk";

export interface ScoreFactor {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Weight of this factor in the overall demo score (weights sum to 100). */
  weight: number;
  /** Fixed demo performance for this factor, 0–100. */
  rating: number;
  status: FactorStatus;
  explanation: string;
  suggestion: string;
  /** Where the user can act on this factor. */
  actionLabel: string;
  actionTo:
    | "/scan-history"
    | "/password-check"
    | "/fake-website"
    | "/scan-file"
    | "/scan-center";
}

export const demoFactors: ScoreFactor[] = [
  {
    id: "recent-scans",
    label: "Recent scan results",
    icon: MessageSquareWarning,
    weight: 25,
    rating: 84,
    status: "Good",
    explanation:
      "Sample data shows 148 scans in the last 30 days with 7 flagged items, 2 of which were never reviewed.",
    suggestion: "Open the flagged sample scans and confirm you took action on each one.",
    actionLabel: "Review scans",
    actionTo: "/scan-history",
  },
  {
    id: "password-strength",
    label: "Password strength",
    icon: KeyRound,
    weight: 25,
    rating: 62,
    status: "Needs Attention",
    explanation:
      "In this demo profile, 2 of 8 saved accounts use short passwords that reuse a common word pattern.",
    suggestion: "Run those passwords through the checker and switch to long, unique passphrases.",
    actionLabel: "Check a password",
    actionTo: "/password-check",
  },
  {
    id: "phishing",
    label: "Phishing & website findings",
    icon: Globe2,
    weight: 20,
    rating: 78,
    status: "Good",
    explanation:
      "One sample link was rated Suspicious this week; look-alike domains are the most common demo finding.",
    suggestion: "Check any unfamiliar login page before entering credentials.",
    actionLabel: "Check a website",
    actionTo: "/fake-website",
  },
  {
    id: "file-findings",
    label: "File scan findings",
    icon: FileSearch2,
    weight: 15,
    rating: 70,
    status: "Needs Attention",
    explanation:
      "A sample attachment with a double extension (invoice_march.pdf.exe) was rated High Risk and is still stored.",
    suggestion: "Delete high-risk sample attachments instead of keeping them on the device.",
    actionLabel: "Scan a file",
    actionTo: "/scan-file",
  },
  {
    id: "settings",
    label: "Security settings",
    icon: SlidersHorizontal,
    weight: 15,
    rating: 90,
    status: "Strong",
    explanation:
      "Demo profile has alerts, automatic scan prompts, and protected mode switched on.",
    suggestion: "Keep two-step verification enabled on every important account.",
    actionLabel: "Open Scan Center",
    actionTo: "/scan-center",
  },
];

export type ScoreBand = "Excellent" | "Good" | "Needs Attention" | "At Risk";

export interface ScoreResult {
  score: number;
  band: ScoreBand;
  factors: ScoreFactor[];
}

/** Deterministic weighted average — no randomness. */
export function computeSecurityScore(factors: ScoreFactor[] = demoFactors): ScoreResult {
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0) || 1;
  const weighted = factors.reduce((sum, f) => sum + f.rating * f.weight, 0);
  const score = Math.round(weighted / totalWeight);
  return { score, band: bandForScore(score), factors };
}

export function bandForScore(score: number): ScoreBand {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "At Risk";
}

export const bandMeta: Record<
  ScoreBand,
  { text: string; bg: string; border: string; dot: string; stroke: string; summary: string }
> = {
  Excellent: {
    text: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/40",
    dot: "bg-accent",
    stroke: "text-accent",
    summary: "Sample posture is well protected with only minor housekeeping left.",
  },
  Good: {
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/40",
    dot: "bg-primary",
    stroke: "text-primary",
    summary: "Sample posture is solid, with a few items worth tightening this week.",
  },
  "Needs Attention": {
    text: "text-violet",
    bg: "bg-violet/10",
    border: "border-violet/40",
    dot: "bg-violet",
    stroke: "text-violet",
    summary: "Several sample factors are dragging the score down and should be reviewed.",
  },
  "At Risk": {
    text: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/40",
    dot: "bg-destructive",
    stroke: "text-destructive",
    summary: "Sample posture shows serious gaps that need immediate attention.",
  },
};

export const factorStatusMeta: Record<FactorStatus, { text: string; bg: string; border: string }> =
  {
    Strong: { text: "text-accent", bg: "bg-accent/10", border: "border-accent/40" },
    Good: { text: "text-primary", bg: "bg-primary/10", border: "border-primary/40" },
    "Needs Attention": {
      text: "text-violet",
      bg: "bg-violet/10",
      border: "border-violet/40",
    },
    "At Risk": {
      text: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/40",
    },
  };

export interface TrendPoint {
  label: string;
  score: number;
}

/** Fixed 7-day sample trend — illustrative values only. */
export const demoTrend: TrendPoint[] = [
  { label: "Mon", score: 71 },
  { label: "Tue", score: 73 },
  { label: "Wed", score: 70 },
  { label: "Thu", score: 74 },
  { label: "Fri", score: 76 },
  { label: "Sat", score: 75 },
  { label: "Sun", score: 77 },
];

export interface Recommendation {
  title: string;
  detail: string;
  impact: string;
  actionLabel: string;
  actionTo: "/scan-history" | "/password-check" | "/scan-center" | "/fake-website";
}

export const demoRecommendations: Recommendation[] = [
  {
    title: "Review suspicious sample scans",
    detail: "Two flagged entries in the sample history have no follow-up recorded.",
    impact: "+4 points",
    actionLabel: "Open Scan History",
    actionTo: "/scan-history",
  },
  {
    title: "Improve weak passwords",
    detail: "Replace short, reused passwords with long unique passphrases.",
    impact: "+9 points",
    actionLabel: "Open Password Checker",
    actionTo: "/password-check",
  },
  {
    title: "Enable stronger account security",
    detail:
      "Turn on two-step verification for email, banking, and cloud accounts outside this preview.",
    impact: "+5 points",
    actionLabel: "Open Scan Center",
    actionTo: "/scan-center",
  },
  {
    title: "Verify unfamiliar login pages",
    detail: "Check look-alike domains before entering credentials anywhere.",
    impact: "+3 points",
    actionLabel: "Check a website",
    actionTo: "/fake-website",
  },
];

export const scoringSteps = [
  {
    title: "Each area gets a rating",
    detail:
      "Five security areas are rated out of 100 based on what the scanners found in the sample data.",
  },
  {
    title: "Areas are weighted",
    detail:
      "Scan results and passwords count the most (25% each), then website findings (20%), file findings (15%), and settings (15%).",
  },
  {
    title: "Ratings are combined",
    detail:
      "The weighted average becomes one number between 0 and 100, then maps to a label: 85+ Excellent, 70+ Good, 50+ Needs Attention, below 50 At Risk.",
  },
];
