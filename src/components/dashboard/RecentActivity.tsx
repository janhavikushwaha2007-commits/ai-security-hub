import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/mesh/Reveal";
import { recentActivity } from "./dashboard-data";
import { cn } from "@/lib/utils";

const verdictClass: Record<string, string> = {
  Safe: "border-accent/40 text-accent",
  Suspicious: "border-primary/40 text-primary",
  "High Risk": "border-destructive/50 text-destructive",
};

const dotClass: Record<string, string> = {
  Safe: "bg-accent",
  Suspicious: "bg-primary",
  "High Risk": "bg-destructive",
};

export function RecentActivity() {
  return (
    <section aria-labelledby="activity-heading" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="activity-heading" className="text-xl font-semibold sm:text-2xl">
            Recent Activity
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Demo activity
            </span>
            <Link
              to="/scan-history"
              className="press-3d inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-foreground shadow-[var(--shadow-soft)] transition-colors hover:border-accent/50 hover:text-accent"
            >
              View All History
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80} className="mt-6">
        <div className="surface-card p-2 sm:p-4">
          <ol className="relative">
            {recentActivity.map((item, i) => (
              <li
                key={item.title + item.time}
                className="relative flex flex-wrap items-start gap-x-4 gap-y-2 rounded-xl px-3 py-4 transition-colors hover:bg-surface/70 sm:flex-nowrap sm:items-center"
              >
                <span className="mt-1.5 flex flex-col items-center self-stretch sm:mt-0">
                  <span
                    aria-hidden="true"
                    className={cn("size-2.5 shrink-0 rounded-full", dotClass[item.verdict])}
                  />
                  {i < recentActivity.length - 1 ? (
                    <span aria-hidden="true" className="mt-1 w-px flex-1 bg-border" />
                  ) : null}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                </div>

                <span
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                    verdictClass[item.verdict],
                  )}
                >
                  {item.verdict}
                </span>
                <time className="w-full shrink-0 text-xs text-muted-foreground sm:w-24 sm:text-right">
                  {item.time}
                </time>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
