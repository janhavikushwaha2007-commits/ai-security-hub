import { useState } from "react";
import { BellRing, Info, Monitor } from "lucide-react";
import { ToggleSwitch } from "./ToggleSwitch";
import {
  demoDisplayPreferences,
  demoNotificationPreferences,
  type DisplayPreferences,
  type NotificationPreferences,
} from "./profile-settings-data";

export function PreferencesSection() {
  const [display, setDisplay] = useState<DisplayPreferences>(demoDisplayPreferences);
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    demoNotificationPreferences,
  );

  return (
    <section aria-labelledby="preferences-heading" className="scroll-mt-32">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl border border-border bg-surface/70 text-accent shadow-[var(--shadow-soft)]">
              <Monitor className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="preferences-heading" className="text-lg font-semibold sm:text-xl">
                Display preferences
              </h2>
              <p className="text-xs text-muted-foreground">How the interface presents results</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ToggleSwitch
              id="pref-colored-badges"
              checked={display.coloredRiskBadges}
              onChange={(next) => setDisplay((prev) => ({ ...prev, coloredRiskBadges: next }))}
              label="Colored risk badges"
              hint="Show Safe, Suspicious, and High Risk results with their status colors."
            />
            <ToggleSwitch
              id="pref-compact-rows"
              checked={display.compactRows}
              onChange={(next) => setDisplay((prev) => ({ ...prev, compactRows: next }))}
              label="Compact table rows"
              hint="Fit more scan history on screen by reducing row height."
            />
          </div>
        </div>

        <div className="surface-card p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl border border-border bg-surface/70 text-accent shadow-[var(--shadow-soft)]">
              <BellRing className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-semibold sm:text-xl">Notification preferences</h3>
              <p className="text-xs text-muted-foreground">
                Demo toggles — no emails or alerts are ever sent
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ToggleSwitch
              id="pref-threat-alerts"
              checked={notifications.threatAlerts}
              onChange={(next) =>
                setNotifications((prev) => ({ ...prev, threatAlerts: next }))
              }
              label="Threat alerts"
              hint="Preview of alerts for high-risk findings. No notifications are sent."
            />
            <ToggleSwitch
              id="pref-weekly-summary"
              checked={notifications.weeklySummary}
              onChange={(next) =>
                setNotifications((prev) => ({ ...prev, weeklySummary: next }))
              }
              label="Weekly security summary"
              hint="Preview of a weekly digest of your activity. No emails are sent."
            />
            <ToggleSwitch
              id="pref-product-updates"
              checked={notifications.productUpdates}
              onChange={(next) =>
                setNotifications((prev) => ({ ...prev, productUpdates: next }))
              }
              label="Product updates"
              hint="Preview of occasional product news. No emails are sent."
            />
          </div>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-surface/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
        <span>
          Preference toggles are kept in this preview session only. They are not saved to any
          account or browser storage, and they do not change other pages in this preview. Real
          preference persistence will be connected during the backend phase.
        </span>
      </p>
    </section>
  );
}
