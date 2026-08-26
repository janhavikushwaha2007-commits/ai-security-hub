import { useState } from "react";
import { Eye, EyeOff, KeyRound, Lock, X } from "lucide-react";
import { MeshButton } from "@/components/mesh/MeshButton";
import { cn } from "@/lib/utils";

interface PasswordFormProps {
  password: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function PasswordForm({ password, onChange, onClear }: PasswordFormProps) {
  const [visible, setVisible] = useState(false);

  return (
    <section aria-labelledby="password-form-heading" className="scroll-mt-24">
      <div className="surface-card p-5 sm:p-7">
        <div>
          <h2 id="password-form-heading" className="text-lg font-semibold sm:text-xl">
            Check a password
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This checker measures length, character variety, and common-password patterns in real
            time. The analysis runs locally in your browser — the password is never stored,
            transmitted, or logged.
          </p>
        </div>

        <div className="mt-6">
          <label htmlFor="password-input" className="sr-only">
            Password to check
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <KeyRound className="size-4" aria-hidden="true" />
            </span>
            <input
              id="password-input"
              type={visible ? "text" : "password"}
              value={password}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter a password to analyze"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              data-1p-ignore
              className={cn(
                "w-full rounded-2xl border border-border bg-surface/60 py-4 pl-11 pr-14 text-sm leading-relaxed text-foreground shadow-[var(--shadow-soft)] transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
              )}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              className="press-3d absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground"
            >
              {visible ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5 text-accent" aria-hidden="true" />
              Analyzed locally — never stored or sent
            </span>
            <span className="text-xs text-muted-foreground">
              {password.length} character{password.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <MeshButton variant="outline" onClick={onClear} disabled={!password}>
            <X className="size-4" aria-hidden="true" />
            Clear
          </MeshButton>
        </div>
      </div>
    </section>
  );
}
