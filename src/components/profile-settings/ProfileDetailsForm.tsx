import { useRef, useState } from "react";
import { AlertCircle, Check, Loader2, Lock, Save } from "lucide-react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { cn } from "@/lib/utils";
import {
  demoProfile,
  profileHasNoErrors,
  validateProfile,
  type ProfileFieldErrors,
} from "./profile-settings-data";

const SIMULATED_DELAY_MS = 700;

type SaveStatus = "idle" | "saving" | "saved";

export function ProfileDetailsForm() {
  const [name, setName] = useState(demoProfile.name);
  const [email, setEmail] = useState(demoProfile.email);
  const [errors, setErrors] = useState<ProfileFieldErrors>({});
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<number | null>(null);

  const fieldClasses = (hasError: boolean) =>
    cn(
      "w-full rounded-xl border bg-surface/60 py-3 pl-11 pr-4 text-sm text-foreground shadow-[var(--shadow-soft)] transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/20",
      hasError
        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
        : "border-border focus:border-accent",
    );

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "saving") return;
    const nextErrors = validateProfile(name, email);
    setErrors(nextErrors);
    if (!profileHasNoErrors(nextErrors)) return;
    setStatus("saving");
    // Simulated preview only: no request is made and nothing is persisted.
    timerRef.current = window.setTimeout(() => {
      setStatus("saved");
    }, SIMULATED_DELAY_MS);
  };

  const handleCancel = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setName(demoProfile.name);
    setEmail(demoProfile.email);
    setErrors({});
    setStatus("idle");
  };

  return (
    <section aria-labelledby="profile-details-heading" className="scroll-mt-32">
      <div className="surface-card p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="profile-details-heading" className="text-lg font-semibold sm:text-xl">
              Profile details
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Preview how account details will look and validate. The values below are
              demo data seeded for this page.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-[var(--shadow-soft)]">
            <Lock className="size-3" aria-hidden="true" />
            Demo data
          </span>
        </div>

        <form onSubmit={handleSave} noValidate className="mt-6 space-y-5">
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium">
              Display name
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="profile-name"
                type="text"
                autoComplete="off"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "profile-name-error" : undefined}
                placeholder="Your display name"
                className={fieldClasses(Boolean(errors.name))}
              />
            </div>
            {errors.name ? (
              <p
                id="profile-name-error"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-destructive"
              >
                <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium">
              Email address
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                id="profile-email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "profile-email-error" : undefined}
                placeholder="you@example.com"
                className={fieldClasses(Boolean(errors.email))}
              />
            </div>
            {errors.email ? (
              <p
                id="profile-email-error"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-destructive"
              >
                <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MeshButton type="submit" disabled={status === "saving"}>
              {status === "saving" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" aria-hidden="true" />
                  Save changes
                </>
              )}
            </MeshButton>
            <MeshButton
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={status === "saving"}
            >
              Cancel
            </MeshButton>
          </div>

          <p
            aria-live="polite"
            className="flex items-start gap-2 rounded-xl border border-border bg-surface/40 p-3 text-xs leading-relaxed text-muted-foreground"
          >
            {status === "saved" ? (
              <>
                <Check className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <span className="font-medium text-foreground">Demo only.</span> Your edits are
                  kept on this page for the current preview session. Nothing is saved to a server,
                  account, or browser storage — the demo profile stays unchanged.
                </span>
              </>
            ) : (
              <>
                <Lock className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  Save is a simulated interaction for this preview. No data leaves this page, and
                  nothing is stored permanently. Real profile persistence will be connected during
                  the backend phase.
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
