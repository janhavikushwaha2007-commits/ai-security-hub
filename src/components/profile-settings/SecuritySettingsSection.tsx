import { useState } from "react";
import { EyeOff, KeyRound, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { ToggleSwitch } from "./ToggleSwitch";

/**
 * Security settings are a UI preview only. The password-change fields are
 * intentionally disabled: they never accept input, so the user's real password
 * is never requested, transmitted, or stored. Two-factor authentication is a
 * display toggle that enables nothing. Both become real during the backend phase.
 */
export function SecuritySettingsSection() {
  const [twoFactor, setTwoFactor] = useState(false);

  const previewField =
    "w-full rounded-xl border border-border bg-surface/40 py-3 pl-11 pr-4 text-sm text-muted-foreground shadow-[var(--shadow-soft)] cursor-not-allowed";

  return (
    <section aria-labelledby="security-settings-heading" className="scroll-mt-32">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl border border-border bg-surface/70 text-accent shadow-[var(--shadow-soft)]">
                <KeyRound className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <h2 id="security-settings-heading" className="text-lg font-semibold sm:text-xl">
                  Change password
                </h2>
                <p className="text-xs text-muted-foreground">Layout preview — not functional</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-[var(--shadow-soft)]">
              <Lock className="size-3" aria-hidden="true" />
              UI preview
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="security-current-password"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Current password
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                >
                  <Lock className="size-4" />
                </span>
                <input
                  id="security-current-password"
                  type="password"
                  disabled
                  autoComplete="off"
                  placeholder="Available in the backend phase"
                  className={previewField}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="security-new-password"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                New password
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                >
                  <Lock className="size-4" />
                </span>
                <input
                  id="security-new-password"
                  type="password"
                  disabled
                  autoComplete="off"
                  placeholder="Available in the backend phase"
                  className={previewField}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="security-confirm-password"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Confirm new password
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                >
                  <EyeOff className="size-4" />
                </span>
                <input
                  id="security-confirm-password"
                  type="password"
                  disabled
                  autoComplete="off"
                  placeholder="Available in the backend phase"
                  className={previewField}
                />
              </div>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-surface/40 p-3 text-xs leading-relaxed text-muted-foreground">
            <Lock className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
            <span>
              These fields are intentionally disabled. No password is requested, transmitted, or
              stored anywhere. Password changes will become functional when real authentication is
              connected during the backend phase.
            </span>
          </p>
        </div>

        <div className="surface-card p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl border border-border bg-surface/70 text-accent shadow-[var(--shadow-soft)]">
                <Smartphone className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">Two-factor authentication</h3>
                <p className="text-xs text-muted-foreground">Layout preview — enables nothing</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-[var(--shadow-soft)]">
              <Lock className="size-3" aria-hidden="true" />
              UI preview
            </span>
          </div>

          <div className="mt-5">
            <ToggleSwitch
              id="security-two-factor"
              checked={twoFactor}
              onChange={setTwoFactor}
              label="Authenticator app (preview)"
              hint="Toggling this switch only changes this preview screen. No authenticator is enrolled and no account setting changes."
            />
          </div>

          <div className="mt-5 rounded-xl border border-border bg-surface/40 p-4 shadow-[var(--shadow-soft)]">
            <p className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="size-4 text-accent" aria-hidden="true" />
              What 2FA will add
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              When real authentication is connected during the backend phase, this section will let
              you enroll an authenticator app, add recovery codes, and require a second factor at
              sign-in.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
