import { BellRing, FileText, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/mesh/Reveal";
import { demoAlerts, demoReports } from "./reports-alerts-data";

const overview = [
  { label: "Reports available", value: demoReports.length, icon: FileText, tone: "text-accent" },
  {
    label: "High-risk reports",
    value: demoReports.filter((report) => report.riskLevel === "High Risk").length,
    icon: ShieldAlert,
    tone: "text-destructive",
  },
  { label: "Sample alerts", value: demoAlerts.length, icon: BellRing, tone: "text-primary" },
];

export function ReportsOverview() {
  return (
    <section aria-labelledby="reports-overview-heading">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="reports-overview-heading" className="text-xl font-semibold sm:text-2xl">
            Reports overview
          </h2>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            DEMO DATA
          </span>
        </div>
      </Reveal>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {overview.map((item, index) => (
          <Reveal key={item.label} delay={index * 70}>
            <article className="surface-card lift-hover h-full p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <item.icon className={`size-5 shrink-0 ${item.tone}`} aria-hidden="true" />
              </div>
              <p className="mt-4 font-display text-3xl font-semibold">{item.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">Fixed sample values for preview</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}