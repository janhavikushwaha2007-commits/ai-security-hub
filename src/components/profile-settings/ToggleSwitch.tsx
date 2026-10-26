import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint: string;
  disabled?: boolean | undefined;
}

/** Accessible switch toggle used for demo preference controls. */
export function ToggleSwitch({
  id,
  checked,
  onChange,
  label,
  hint,
  disabled,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface/40 p-4 shadow-[var(--shadow-soft)] transition-colors duration-200 hover:bg-surface/60">
      <div className="min-w-0">
        <label
          htmlFor={id}
          className={cn(
            "block text-sm font-medium",
            disabled && "text-muted-foreground",
          )}
        >
          {label}
        </label>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "press-3d relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-200",
          checked
            ? "border-transparent bg-[image:var(--gradient-brand)] shadow-[var(--shadow-glow)]"
            : "border-border bg-surface",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0.5 size-4.5 rounded-full bg-primary-foreground shadow-sm transition-all duration-200",
            checked ? "left-[1.4rem]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}
