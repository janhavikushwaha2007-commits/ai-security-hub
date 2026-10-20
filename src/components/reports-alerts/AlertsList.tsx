import { BellRing, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/mesh/Reveal";
import { cn } from "@/lib/utils";
import { alertSeverityClass, demoAlerts, formatReportDate } from "./reports-alerts-data";

export function AlertsList() {
  return (
    <section aria-labelledby="alerts-heading" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="alerts-heading" className="text-xl font-semibold sm:text-2xl">Alerts</h2>
            <p className="mt-2 text-sm text-muted-foreground">Sample notifications with practical next steps.</p>
          </div>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">DEMO DATA</span>
        </div>
      </Reveal>
      <div className="mt-5 space-y-3">
        {demoAlerts.map((alert, index) => (
          <Reveal key={alert.id} delay={index * 55}>
            <article className="surface-card lift-hover grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(250px,0.75fr)] sm:items-center sm:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 text-primary">
                  <BellRing className="size-4.5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", alertSeverityClass[alert.severity])}>
                      <ShieldAlert className="size-3.5" aria-hidden="true" />{alert.severity} severity
                    </span>
                    <time dateTime={alert.date} className="text-xs text-muted-foreground">{formatReportDate(alert.date)}</time>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">{alert.description}</p>
                </div>
              </div>
              <div className="border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Recommended action</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{alert.recommendedAction}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}