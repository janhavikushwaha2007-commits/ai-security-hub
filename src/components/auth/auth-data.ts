// Frontend-only auth preview data and validation helpers.
// NOTE: No authentication exists in this project yet. Nothing here creates an
// account, signs anyone in, or stores credentials — passwords are never
// written to storage or logs. Real authentication will be connected during
// the backend phase.

export type AuthMode = "login" | "register";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_EMAIL_LENGTH = 255;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface AuthFieldErrors {
  email?: string | undefined;
  password?: string | undefined;
  confirmPassword?: string | undefined;
}

export function validateEmail(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return "Please enter your email address.";
  if (value.length > MAX_EMAIL_LENGTH)
    return `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`;
  if (!EMAIL_REGEX.test(value))
    return "Please enter a valid email address (e.g., you@example.com).";
  return undefined;
}

export function validatePassword(raw: string): string | undefined {
  if (!raw) return "Please enter your password.";
  if (raw.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | undefined {
  if (!confirm) return "Please confirm your password.";
  if (confirm !== password) return "Passwords do not match.";
  return undefined;
}

export function validateAuthForm(
  mode: AuthMode,
  email: string,
  password: string,
  confirmPassword: string,
): AuthFieldErrors {
  const errors: AuthFieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (mode === "register") {
    errors.confirmPassword = validateConfirmPassword(password, confirmPassword);
  }
  return errors;
}

/** True when every field passed validation. */
export function hasNoErrors(errors: AuthFieldErrors): boolean {
  return !errors.email && !errors.password && !errors.confirmPassword;
}

export const modeMeta: Record<
  AuthMode,
  { heading: string; subheading: string; submitLabel: string; loadingLabel: string }
> = {
  login: {
    heading: "Welcome back",
    subheading:
      "Sign in to preview your security dashboard. This is a frontend preview — real authentication is not connected yet.",
    submitLabel: "Sign In",
    loadingLabel: "Signing in...",
  },
  register: {
    heading: "Create your account",
    subheading:
      "Preview the registration flow. This is a frontend preview — no account is created.",
    submitLabel: "Create Account",
    loadingLabel: "Creating account...",
  },
};
