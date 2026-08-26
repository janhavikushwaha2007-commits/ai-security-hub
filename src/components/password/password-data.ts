/**
 * Client-side password strength analysis for the AI Security Mesh preview.
 * Everything runs locally in the browser — the password is never stored,
 * logged, or sent to any service. Replace/extend with a server-side breach
 * check once a backend is connected.
 */

export type StrengthLevel = "Very Weak" | "Weak" | "Medium" | "Strong" | "Very Strong";

export interface PasswordCheck {
  id: string;
  label: string;
  hint: string;
  passed: boolean;
}

export interface PasswordAnalysis {
  score: number; // 0 - 100
  level: StrengthLevel;
  checks: PasswordCheck[];
  suggestions: string[];
  isCommon: boolean;
}

/** Small local sample of widely leaked passwords (demo list, not exhaustive). */
export const COMMON_PASSWORDS = [
  "password",
  "password1",
  "password123",
  "123456",
  "1234567",
  "12345678",
  "123456789",
  "qwerty",
  "qwerty123",
  "abc123",
  "111111",
  "iloveyou",
  "admin",
  "admin123",
  "welcome",
  "welcome123",
  "letmein",
  "monkey",
  "dragon",
  "football",
  "sunshine",
  "princess",
  "master",
  "login",
  "passw0rd",
];

export const MIN_LENGTH = 12;

const SEQUENCES = ["abcdef", "qwerty", "asdfgh", "zxcvbn", "123456", "098765"];

export function analyzePassword(password: string): PasswordAnalysis {
  const lower = password.toLowerCase();
  const hasLength = password.length >= MIN_LENGTH;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isCommon =
    COMMON_PASSWORDS.includes(lower) ||
    COMMON_PASSWORDS.some((c) => c.length >= 6 && lower.includes(c));
  const hasRepeats = /(.)\1{2,}/.test(password);
  const hasSequence = SEQUENCES.some((seq) => lower.includes(seq));

  const checks: PasswordCheck[] = [
    {
      id: "length",
      label: `At least ${MIN_LENGTH} characters`,
      hint: "Length is the single biggest factor in resisting brute-force attacks.",
      passed: hasLength,
    },
    {
      id: "upper",
      label: "Contains uppercase letters",
      hint: "Mixing letter cases widens the character set an attacker must try.",
      passed: hasUpper,
    },
    {
      id: "lower",
      label: "Contains lowercase letters",
      hint: "Lowercase letters keep the password readable while adding variety.",
      passed: hasLower,
    },
    {
      id: "number",
      label: "Contains numbers",
      hint: "Digits placed inside the password (not only at the end) add entropy.",
      passed: hasNumber,
    },
    {
      id: "special",
      label: "Contains special characters",
      hint: "Symbols such as ! @ # $ % significantly increase complexity.",
      passed: hasSpecial,
    },
    {
      id: "common",
      label: "Not a common or leaked password",
      hint: "Attackers try known password lists first, before anything else.",
      passed: password.length > 0 && !isCommon,
    },
  ];

  let score = 0;
  score += Math.min(password.length, 20) * 2.5; // up to 50
  if (hasUpper) score += 10;
  if (hasLower) score += 8;
  if (hasNumber) score += 10;
  if (hasSpecial) score += 14;
  if (password.length >= 16) score += 8;
  if (isCommon) score -= 45;
  if (hasRepeats) score -= 10;
  if (hasSequence) score -= 12;
  score = Math.max(0, Math.min(100, Math.round(score)));

  let level: StrengthLevel;
  if (score < 25) level = "Very Weak";
  else if (score < 45) level = "Weak";
  else if (score < 65) level = "Medium";
  else if (score < 85) level = "Strong";
  else level = "Very Strong";

  const suggestions: string[] = [];
  if (!hasLength)
    suggestions.push(
      `Extend the password to at least ${MIN_LENGTH} characters — a short passphrase of 3-4 unrelated words works well.`,
    );
  if (!hasUpper || !hasLower)
    suggestions.push("Mix uppercase and lowercase letters throughout, not just at the start.");
  if (!hasNumber) suggestions.push("Add numbers somewhere in the middle of the password.");
  if (!hasSpecial) suggestions.push("Include special characters such as ! ? @ # % or -.");
  if (isCommon)
    suggestions.push("This resembles a widely leaked password. Choose something entirely different.");
  if (hasRepeats) suggestions.push("Avoid repeating the same character three or more times.");
  if (hasSequence)
    suggestions.push("Avoid keyboard or number sequences like 'qwerty' or '123456'.");
  if (suggestions.length === 0)
    suggestions.push(
      "This password looks strong. Store it in a password manager and enable two-factor authentication where possible.",
    );

  return { score, level, checks, suggestions, isCommon };
}

export const levelMeta: Record<
  StrengthLevel,
  { text: string; bg: string; border: string; bar: string; dot: string }
> = {
  "Very Weak": {
    text: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/40",
    bar: "bg-destructive",
    dot: "bg-destructive",
  },
  Weak: {
    text: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/40",
    bar: "bg-destructive",
    dot: "bg-destructive",
  },
  Medium: {
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/40",
    bar: "bg-primary",
    dot: "bg-primary",
  },
  Strong: {
    text: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/40",
    bar: "bg-accent",
    dot: "bg-accent",
  },
  "Very Strong": {
    text: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/40",
    bar: "bg-accent",
    dot: "bg-accent",
  },
};
