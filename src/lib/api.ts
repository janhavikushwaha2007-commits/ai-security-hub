/**
 * API client for the AI Security Mesh backend.
 *
 * All scanner and auth calls go through this module. The backend base URL is
 * configurable via the VITE_API_BASE_URL env var, defaulting to the local
 * development server at http://localhost:8000.
 */

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8000";

const TOKEN_KEY = "mesh_auth_token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...authHeaders(),
    ...(options.headers as Record<string, string> | undefined),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = body?.error;
    const message =
      error?.message ??
      (res.status === 401
        ? "Authentication failed. Please sign in again."
        : "Something went wrong. Please try again.");
    if (res.status === 401) clearAuthToken();
    throw new ApiError(res.status, message, error?.code);
  }
  return body as T;
}

/* ---------- Auth ---------- */

export interface AuthResponse {
  user_id: string;
  name: string;
  email: string;
  token: string;
}

export function register(name: string, email: string, password: string) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

/* ---------- Scanners ---------- */

export interface ScanResult {
  risk_score: number;
  risk_level: "Safe" | "Suspicious" | "High Risk";
  reasons: string[];
  mode: string;
}

interface ScanResponse {
  data: ScanResult;
}

export function scanUrl(url: string) {
  return request<ScanResponse>("/api/scan/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export function scanMessage(message: string) {
  return request<ScanResponse>("/api/scan/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
}

export function scanWebsite(url: string) {
  return request<ScanResponse>("/api/scan/website", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export function scanFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  return request<ScanResponse>("/api/scan/file", {
    method: "POST",
    body: form,
  });
}

export interface PasswordResult {
  score: number;
  level: "Very Weak" | "Weak" | "Medium" | "Strong" | "Very Strong";
  checks: { id: string; label: string; passed: boolean }[];
  suggestions: string[];
  is_common: boolean;
}

interface PasswordResponse {
  data: PasswordResult;
}

export function scanPassword(password: string) {
  return request<PasswordResponse>("/api/scan/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}
