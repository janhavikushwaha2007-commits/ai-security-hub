/**
 * Frontend-only demo model for the Fake Website Detection module.
 *
 * Nothing here contacts a live threat-intelligence service. `analyzeWebsite`
 * runs simple, transparent heuristics in the browser so the interface can be
 * exercised end to end. To connect a real URL reputation / phishing API later,
 * replace the body of `analyzeWebsite` with a server-function call that returns
 * the same `WebsiteAnalysis` shape — the UI needs no other change. API keys must
 * stay on the server side and never appear in this file.
 */

export type RiskLevel = "Safe" | "Suspicious" | "High Risk";
export type CheckStatus = "pass" | "warn" | "fail";

export const MAX_CHARS = 2048;

export interface WebsiteCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface PhishingSignal {
  label: string;
  description: string;
}

export interface WebsiteAnalysis {
  url: string;
  riskLevel: RiskLevel;
  riskScore: number;
  reputation: {
    label: string;
    detail: string;
    score: number;
  };
  checks: WebsiteCheck[];
  signals: PhishingSignal[];
  explanation: string;
  recommendations: string[];
}

export const riskMeta: Record<
  RiskLevel,
  { border: string; bg: string; text: string; dot: string; ring: string }
> = {
  Safe: {
    border: "border-accent/40",
    bg: "bg-accent/10",
    text: "text-accent",
    dot: "bg-accent",
    ring: "stroke-accent",
  },
  Suspicious: {
    border: "border-primary/40",
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    ring: "stroke-primary",
  },
  "High Risk": {
    border: "border-destructive/40",
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
    ring: "stroke-destructive",
  },
};

export const checkMeta: Record<CheckStatus, { text: string; border: string; bg: string }> = {
  pass: { text: "text-accent", border: "border-accent/40", bg: "bg-accent/10" },
  warn: { text: "text-primary", border: "border-primary/40", bg: "bg-primary/10" },
  fail: { text: "text-destructive", border: "border-destructive/40", bg: "bg-destructive/10" },
};

export interface DemoScenario {
  id: string;
  label: string;
  url: string;
  hint: string;
}

/** Preset URLs so every result state can be tried from the UI. */
export const demoScenarios: DemoScenario[] = [
  {
    id: "safe",
    label: "Safe example",
    url: "https://www.wikipedia.org/",
    hint: "Well-formed HTTPS domain",
  },
  {
    id: "suspicious",
    label: "Suspicious example",
    url: "http://account-update.shop-deals.co/login?ref=email",
    hint: "No HTTPS, login path",
  },
  {
    id: "high-risk",
    label: "High risk example",
    url: "http://secure-verify-paypa1.account-login.support-help.tk/verify?session=expired",
    hint: "Lookalike brand domain",
  },
];

const SUSPICIOUS_KEYWORDS = [
  "verify",
  "login",
  "signin",
  "secure",
  "account",
  "update",
  "confirm",
  "password",
  "wallet",
  "gift",
  "bonus",
  "unlock",
  "billing",
  "support-help",
];

const LOOKALIKE_BRANDS = [
  "paypa1",
  "paypaI",
  "g00gle",
  "faceb00k",
  "arnazon",
  "app1e",
  "netfl1x",
  "micros0ft",
  "whatsap",
  "1nstagram",
];

const RISKY_TLDS = ["tk", "ml", "ga", "cf", "gq", "zip", "top", "xyz", "click", "work"];

const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(:\d+)?([/?#][^\s]*)?$/i;

export function isValidUrl(value: string): boolean {
  return URL_PATTERN.test(value.trim());
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
}

function scoreToLevel(score: number): RiskLevel {
  if (score >= 65) return "High Risk";
  if (score >= 30) return "Suspicious";
  return "Safe";
}

/**
 * Demo heuristic analysis. Deterministic, offline, and intentionally simple —
 * swap for a real reputation API response later.
 */
export function analyzeWebsite(rawUrl: string): WebsiteAnalysis {
  const normalized = normalizeUrl(rawUrl);
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    parsed = new URL("http://invalid.example");
  }

  const host = parsed.hostname.toLowerCase();
  const path = `${parsed.pathname}${parsed.search}`.toLowerCase();
  const labels = host.split(".");
  const tld = labels[labels.length - 1] ?? "";
  const subdomainDepth = Math.max(0, labels.length - 2);

  const isHttps = parsed.protocol === "https:";
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(
    (word) => host.includes(word) || path.includes(word),
  );
  const matchedLookalikes = LOOKALIKE_BRANDS.filter((brand) => host.includes(brand.toLowerCase()));
  const hasIpHost = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
  const hasHyphenNoise = (host.match(/-/g) ?? []).length >= 2;
  const isRiskyTld = RISKY_TLDS.includes(tld);
  const isLongUrl = normalized.length > 90;

  let score = 0;
  if (!isHttps) score += 18;
  if (hasIpHost) score += 25;
  if (subdomainDepth >= 3) score += 15;
  else if (subdomainDepth === 2) score += 8;
  if (hasHyphenNoise) score += 12;
  if (isRiskyTld) score += 14;
  if (matchedLookalikes.length) score += 30;
  score += Math.min(18, matchedKeywords.length * 6);
  if (isLongUrl) score += 6;
  score = Math.max(4, Math.min(97, score));

  const riskLevel = scoreToLevel(score);

  const checks: WebsiteCheck[] = [
    {
      id: "https",
      label: "HTTPS / secure connection",
      status: isHttps ? "pass" : "fail",
      detail: isHttps
        ? "The address uses HTTPS, so traffic to this site would be encrypted."
        : "The address uses plain HTTP. Anything you submit could be read in transit.",
    },
    {
      id: "structure",
      label: "Domain & URL structure",
      status: hasIpHost || subdomainDepth >= 3 ? "fail" : hasHyphenNoise || isLongUrl ? "warn" : "pass",
      detail: hasIpHost
        ? "The host is a raw IP address instead of a registered domain name."
        : subdomainDepth >= 3
          ? `Deeply nested subdomains (${host}) are often used to hide the real domain.`
          : hasHyphenNoise
            ? "Multiple hyphens in the domain are a common lookalike technique."
            : isLongUrl
              ? "The URL is unusually long, which can hide the real destination."
              : "The domain structure looks ordinary for a legitimate site.",
    },
    {
      id: "keywords",
      label: "Suspicious keywords",
      status: matchedKeywords.length >= 3 ? "fail" : matchedKeywords.length > 0 ? "warn" : "pass",
      detail: matchedKeywords.length
        ? `Found ${matchedKeywords.length} sensitive term${matchedKeywords.length === 1 ? "" : "s"}: ${matchedKeywords.slice(0, 5).join(", ")}.`
        : "No credential-harvesting or urgency keywords found in the domain or path.",
    },
    {
      id: "tld",
      label: "Top-level domain",
      status: isRiskyTld ? "fail" : "pass",
      detail: isRiskyTld
        ? `.${tld} is frequently abused for short-lived scam sites.`
        : `.${tld || "unknown"} is a commonly used, unremarkable extension.`,
    },
    {
      id: "brand",
      label: "Brand impersonation",
      status: matchedLookalikes.length ? "fail" : "pass",
      detail: matchedLookalikes.length
        ? `The host contains a lookalike brand string: ${matchedLookalikes.join(", ")}.`
        : "No character-swapped brand names detected in the host.",
    },
  ];

  const reputationScore = Math.max(3, 100 - score);
  const reputation = {
    score: reputationScore,
    label:
      reputationScore >= 70 ? "Established" : reputationScore >= 40 ? "Unclear" : "Poor / unknown",
    detail:
      reputationScore >= 70
        ? "Demo reputation model finds no pattern-based concerns for this host."
        : reputationScore >= 40
          ? "Demo reputation model finds mixed signals — treat this host with caution."
          : "Demo reputation model flags this host as matching common scam patterns.",
  };

  const signals: PhishingSignal[] = [];
  if (matchedLookalikes.length)
    signals.push({
      label: "Lookalike brand domain",
      description:
        "The host imitates a well-known brand with substituted characters — a hallmark of credential phishing.",
    });
  if (!isHttps)
    signals.push({
      label: "Unencrypted connection",
      description:
        "Legitimate sign-in pages use HTTPS. Submitting data over HTTP exposes it to interception.",
    });
  if (matchedKeywords.length)
    signals.push({
      label: "Credential / urgency wording",
      description:
        "The address includes verification, login, or billing terms typically used to pressure a quick action.",
    });
  if (subdomainDepth >= 2 || hasHyphenNoise || hasIpHost)
    signals.push({
      label: "Obscured real destination",
      description:
        "Extra subdomains, hyphens, or a raw IP make it hard to tell which domain actually owns the page.",
    });
  if (isRiskyTld)
    signals.push({
      label: "High-abuse domain extension",
      description:
        "The extension is cheap or free to register and is heavily used for disposable phishing sites.",
    });
  if (!signals.length)
    signals.push({
      label: "No pattern-based red flags",
      description:
        "None of the demo heuristics matched. Still confirm the address is the one you expect before signing in.",
    });

  const explanation =
    riskLevel === "High Risk"
      ? "Several strong phishing indicators appear together in this address. Sites matching this pattern usually exist to capture logins or payment details."
      : riskLevel === "Suspicious"
        ? "This address shows some warning patterns. It may be legitimate, but it shares traits with pages used in scam campaigns."
        : "This address does not match the demo phishing patterns. It looks structurally consistent with a genuine site.";

  const recommendations =
    riskLevel === "High Risk"
      ? [
          "Do not open the link or enter any credentials, card, or personal details.",
          "Reach the service by typing its official address directly in your browser.",
          "Report the link to the impersonated brand and delete the message that contained it.",
          "If you already entered details, change that password now and enable two-factor authentication.",
        ]
      : riskLevel === "Suspicious"
        ? [
            "Avoid signing in until you can confirm the domain belongs to the real organisation.",
            "Check the address character by character against the brand's known domain.",
            "Open the service from a bookmark or search result instead of this link.",
            "Never approve a login prompt or one-time code you did not initiate.",
          ]
        : [
            "No action needed, but confirm the domain matches the organisation you expect.",
            "Keep two-factor authentication enabled on any account you sign into.",
            "Re-check any link that arrives with urgent or unexpected wording.",
          ];

  return {
    url: normalized,
    riskLevel,
    riskScore: score,
    reputation,
    checks,
    signals,
    explanation,
    recommendations,
  };
}
