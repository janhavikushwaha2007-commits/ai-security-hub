import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  UserPlus,
  User,
} from "lucide-react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { cn } from "@/lib/utils";
import { ApiError, login, register, setAuthToken } from "@/lib/api";
import {
  hasNoErrors,
  modeMeta,
  validateAuthForm,
  type AuthFieldErrors,
  type AuthMode,
} from "./auth-data";

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const meta = modeMeta[mode];

  const switchMode = (next: AuthMode) => {
    if (next === mode) return;
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setErrors({});
    setApiError(null);
    setMode(next);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setApiError(null);
    const nextErrors = validateAuthForm(mode, email, password, confirmPassword);
    setErrors(nextErrors);
    if (!hasNoErrors(nextErrors)) return;
    setSubmitting(true);
    try {
      if (mode === "register") {
        const res = await register(name.trim(), email.trim(), password);
        setAuthToken(res.token);
      } else {
        const res = await login(email.trim(), password);
        setAuthToken(res.token);
      }
      setSubmitting(false);
      setSuccess(true);
    } catch (err) {
      setSubmitting(false);
      setApiError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  const resetDemo = () => {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setErrors({});
    setApiError(null);
    setSubmitting(false);
    setSuccess(false);
  };

  const fieldClasses = (hasError: boolean) =>
    cn(
      "w-full rounded-xl border bg-surface/60 py-3 pl-11 pr-11 text-sm text-foreground shadow-[var(--shadow-soft)] transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/20",
      hasError
        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
        : "border-border focus:border-accent",
    );

  if (success) {
    return (
      <section aria-labelledby="auth-success-heading" className="surface-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] shadow-[var(--shadow-glow)]">
            <ShieldCheck className="size-7 text-primary-foreground" aria-hidden="true" />
          </span>
          <div>
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Success
            </span>
            <h2 id="auth-success-heading" className="mt-3 text-xl font-semibold sm:text-2xl">
              {mode === "register" ? "Account created" : "Signed in"}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {mode === "register"
                ? "Your account is ready and you are now signed in. Your scan history will be saved to your account."
                : "Welcome back! You are now signed in and your scan history is available."}
            </p>
          </div>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <MeshButton asChild className="w-full sm:w-auto">
              <Link to="/dashboard">
                Open Dashboard
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </MeshButton>
            <MeshButton variant="outline" onClick={resetDemo} className="w-full sm:w-auto">
              Switch Account
            </MeshButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="auth-form-heading" className="surface-card p-6 sm:p-8">
      {/* Mode switch */}
      <div
        role="tablist"
        aria-label="Choose login or register"
        className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface/60 p-1 shadow-[var(--shadow-soft)]"
      >
        {(["login", "register"] as const).map((value) => {
          const active = mode === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => switchMode(value)}
              className={cn(
                "press-3d flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[image:var(--gradient-brand)] text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {value === "login" ? (
                <Lock className="size-4" aria-hidden="true" />
              ) : (
                <UserPlus className="size-4" aria-hidden="true" />
              )}
              {value === "login" ? "Sign In" : "Register"}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <h2 id="auth-form-heading" className="text-xl font-semibold sm:text-2xl">
          {meta.heading}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{meta.subheading}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {/* Name — Register only */}
        {mode === "register" ? (
          <div>
            <label htmlFor="auth-name" className="mb-1.5 block text-sm font-medium">
              Full name
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              >
                <User className="size-4" />
              </span>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={fieldClasses(false)}
              />
            </div>
          </div>
        ) : null}

        {/* Email */}
        <div>
          <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium">
            Email address
          </label>
          <div className="relative">
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              <AtSign className="size-4" />
            </span>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "auth-email-error" : undefined}
              placeholder="you@example.com"
              className={fieldClasses(Boolean(errors.email))}
            />
          </div>
          {errors.email ? (
            <p
              id="auth-email-error"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-destructive"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.email}
            </p>
          ) : null}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              <KeyRound className="size-4" />
            </span>
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "auth-password-error" : undefined}
              placeholder="At least 8 characters"
              className={fieldClasses(Boolean(errors.password))}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="press-3d absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p
              id="auth-password-error"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-destructive"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.password}
            </p>
          ) : null}
        </div>

        {/* Confirm password — Register only */}
        {mode === "register" ? (
          <div>
            <label htmlFor="auth-confirm" className="mb-1.5 block text-sm font-medium">
              Confirm password
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              >
                <KeyRound className="size-4" />
              </span>
              <input
                id="auth-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? "auth-confirm-error" : undefined}
                placeholder="Repeat your password"
                className={fieldClasses(Boolean(errors.confirmPassword))}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password confirmation" : "Show password confirmation"}
                className="press-3d absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p
                id="auth-confirm-error"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-destructive"
              >
                <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>
        ) : null}

        <MeshButton
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full min-h-[3rem]"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {meta.loadingLabel}
            </>
          ) : (
            <>
              {mode === "login" ? (
                <Lock className="size-4" aria-hidden="true" />
              ) : (
                <UserPlus className="size-4" aria-hidden="true" />
              )}
              {meta.submitLabel}
            </>
          )}
        </MeshButton>

        {apiError ? (
          <p
            role="alert"
            className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"
          >
            <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
            {apiError}
          </p>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="font-medium text-accent underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {mode === "login" ? "Register" : "Sign In"}
          </button>
        </p>
      </form>
    </section>
  );
}
