import { useRef, useState } from "react";
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
  Info,
} from "lucide-react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { cn } from "@/lib/utils";
import {
  hasNoErrors,
  modeMeta,
  validateAuthForm,
  type AuthFieldErrors,
  type AuthMode,
} from "./auth-data";

const SIMULATED_DELAY_MS = 1100;

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<number | null>(null);

  const meta = modeMeta[mode];

  const switchMode = (next: AuthMode) => {
    if (next === mode) return;
    // Never carry passwords across modes.
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setErrors({});
    setMode(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const nextErrors = validateAuthForm(mode, email, password, confirmPassword);
    setErrors(nextErrors);
    if (!hasNoErrors(nextErrors)) return;
    setSubmitting(true);
    // Simulated preview only: this delay stands in for a future real
    // authentication call. No credentials leave this component, no network
    // request is made, and nothing is stored or logged.
    timerRef.current = window.setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, SIMULATED_DELAY_MS);
  };

  const resetDemo = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setErrors({});
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
            <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Demo only
            </span>
            <h2 id="auth-success-heading" className="mt-3 text-xl font-semibold sm:text-2xl">
              Simulated success — {meta.submitLabel.toLowerCase()} form validated
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              This preview stops here. No account was created, nobody is signed in, and your email
              and password were not sent anywhere, stored, or logged. Real authentication will be
              connected during the backend phase.
            </p>
          </div>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <MeshButton asChild className="w-full sm:w-auto">
              <Link to="/dashboard">
                Open Dashboard (Demo Navigation)
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </MeshButton>
            <MeshButton variant="outline" onClick={resetDemo} className="w-full sm:w-auto">
              Try Again
            </MeshButton>
          </div>
          <p className="text-xs text-muted-foreground">
            The Dashboard link above is a demo navigation option only — it does not imply you are
            authenticated.
          </p>
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

        <p className="flex items-start gap-2 rounded-xl border border-border bg-surface/40 p-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
          <span>
            Frontend preview only. Submitting this form does not create an account, sign you in, or
            send any data — your password is never stored or logged. Real authentication will be
            connected during the backend phase.
          </span>
        </p>

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
