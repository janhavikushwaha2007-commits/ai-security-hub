import { useMemo, useState } from "react";
import { ChevronRight, FileSearch2, FileText, Globe2, MessageSquareWarning, Search, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/mesh/Reveal";
import { MeshButton } from "@/components/mesh/MeshButton";
import { cn } from "@/lib/utils";
import {
  demoReports,
  formatReportDate,
  reportRiskClass,
  reportRisks,
  reportTypes,
  type ReportRecord,
  type ReportRisk,
  type ReportType,
} from "./reports-alerts-data";

const selectClass =
  "h-11 w-full rounded-xl border border-border bg-surface/70 px-3 text-sm text-foreground shadow-[var(--shadow-soft)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const reportIcons = {
  "Message Analysis": MessageSquareWarning,
  "Website Review": Globe2,
  "File Inspection": FileSearch2,
  "Security Summary": ShieldCheck,
} satisfies Record<ReportType, typeof FileText>;

interface Props {
  loading: boolean;
  onViewDetails: (report: ReportRecord) => void;
}

export function ReportsList({ loading, onViewDetails }: Props) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ReportType | "all">("all");
  const [risk, setRisk] = useState<ReportRisk | "all">("all");

  const reports = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return demoReports.filter((report) => {
      if (type !== "all" && report.type !== type) return false;
      if (risk !== "all" && report.riskLevel !== risk) return false;
      return (
        !normalized ||
        `${report.title} ${report.type} ${report.riskLevel} ${report.status}`
          .toLowerCase()
          .includes(normalized)
      );
    });
  }, [query, type, risk]);
  const filtersActive = Boolean(query.trim()) || type !== "all" || risk !== "all";

  return (
    <section aria-labelledby="report-list-heading" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="report-list-heading" className="text-xl font-semibold sm:text-2xl">
            Reports
          </h2>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">DEMO DATA</span>
        </div>
      </Reveal>

      <Reveal delay={70} className="mt-5">
        <div className="surface-card p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="reports-search" className="sr-only">
                Search reports
              </label>
              <input
                id="reports-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search reports…"
                className="h-11 w-full rounded-xl border border-border bg-surface/70 pl-9 pr-3 text-sm shadow-[var(--shadow-soft)] transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="reports-type" className="sr-only">Filter by report type</label>
              <select
                id="reports-type"
                value={type}
                onChange={(event) => setType(event.target.value as ReportType | "all")}
                className={selectClass}
              >
                <option value="all">All report types</option>
                {reportTypes.map((reportType) => <option key={reportType} value={reportType}>{reportType}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="reports-risk" className="sr-only">Filter by risk level</label>
              <select
                id="reports-risk"
                value={risk}
                onChange={(event) => setRisk(event.target.value as ReportRisk | "all")}
                className={selectClass}
              >
                <option value="all">All risk levels</option>
                {reportRisks.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-5" aria-live="polite">
        {loading ? (
          <div className="surface-card flex flex-col items-center px-6 py-14 text-center" aria-busy="true">
            <div className="size-6 animate-spin rounded-full border-2 border-border border-t-accent" aria-hidden="true" />
            <p className="mt-4 text-sm text-muted-foreground">Loading sample reports…</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="surface-card flex flex-col items-center px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{filtersActive ? "No matching reports" : "No reports available"}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {filtersActive ? "Try a different search or change the selected filters." : "There are no sample reports to show right now."}
            </p>
            {filtersActive ? (
              <MeshButton variant="outline" size="sm" className="mt-5" onClick={() => { setQuery(""); setType("all"); setRisk("all"); }}>
                Clear filters
              </MeshButton>
            ) : null}
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-muted-foreground">Showing {reports.length} of {demoReports.length} sample reports</p>
            <div className="surface-card overflow-hidden p-2 sm:p-3">
              <div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(140px,1fr)_150px_120px_120px] gap-3 border-b border-border px-4 pb-3 pt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground lg:grid">
                <span>Report</span><span>Type</span><span>Date</span><span>Risk</span><span className="text-right">Details</span>
              </div>
              <ul>
                {reports.map((report) => {
                  const Icon = reportIcons[report.type];
                  return (
                    <li key={report.id}>
                      <article className="grid gap-3 rounded-xl px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface/70 hover:shadow-[var(--shadow-soft)] lg:grid-cols-[minmax(0,1.7fr)_minmax(140px,1fr)_150px_120px_120px] lg:items-center">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface/70 text-accent">
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium">{report.title}</p>
                            <p className="text-xs text-muted-foreground lg:hidden">{report.type} · {formatReportDate(report.date)}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Status: {report.status}</p>
                          </div>
                        </div>
                        <span className="hidden text-sm text-muted-foreground lg:block">{report.type}</span>
                        <time dateTime={report.date} className="hidden text-xs text-muted-foreground lg:block">{formatReportDate(report.date)}</time>
                        <span className="flex items-center gap-2">
                          <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", reportRiskClass[report.riskLevel])}>{report.riskLevel}</span>
                          <span className="text-xs text-muted-foreground">{report.riskScore}/100</span>
                        </span>
                        <div className="lg:text-right">
                          <MeshButton variant="outline" size="sm" className="w-full justify-between lg:w-auto" onClick={() => onViewDetails(report)}>
                            View details <ChevronRight className="size-3.5" aria-hidden="true" />
                          </MeshButton>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  );
}