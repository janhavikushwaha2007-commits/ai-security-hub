// Frontend-only profile & settings preview data and validation helpers.
// NOTE: Nothing on this page is persisted to any backend. Every value is fixed
// demo data for interface preview only. Real account storage will be connected
// during the backend phase.

export const MAX_NAME_LENGTH = 60;
export const MIN_NAME_LENGTH = 2;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface DemoProfile {
  name: string;
  email: string;
}

/** Fixed demo profile used to seed the profile form. */
export const demoProfile: DemoProfile = {
  name: "Demo User",
  email: "demo.user@example.com",
};

export interface ProfileFieldErrors {
  name?: string | undefined;
  email?: string | undefined;
}

export function validateName(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return "Please enter a display name.";
  if (value.length < MIN_NAME_LENGTH)
    return `Display name must be at least ${MIN_NAME_LENGTH} characters long.`;
  if (value.length > MAX_NAME_LENGTH)
    return `Display name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  return undefined;
}

export function validateProfileEmail(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return "Please enter an email address.";
  if (!EMAIL_REGEX.test(value))
    return "Please enter a valid email address (e.g., you@example.com).";
  return undefined;
}

export function validateProfile(name: string, email: string): ProfileFieldErrors {
  return {
    name: validateName(name),
    email: validateProfileEmail(email),
  };
}

/** True when every profile field passed validation. */
export function profileHasNoErrors(errors: ProfileFieldErrors): boolean {
  return !errors.name && !errors.email;
}

export interface DisplayPreferences {
  coloredRiskBadges: boolean;
  compactRows: boolean;
}

export interface NotificationPreferences {
  threatAlerts: boolean;
  weeklySummary: boolean;
  productUpdates: boolean;
}

export const demoDisplayPreferences: DisplayPreferences = {
  coloredRiskBadges: true,
  compactRows: false,
};

export const demoNotificationPreferences: NotificationPreferences = {
  threatAlerts: true,
  weeklySummary: true,
  productUpdates: false,
};
