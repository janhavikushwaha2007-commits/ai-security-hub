import { useMemo, useState } from "react";
import { Search, ChevronRight, Loader2 } from "lucide-react";
import { Reveal } from "@/components/mesh/Reveal";
import { MeshButton } from "@/components/mesh/MeshButton";
import { cn } from "@/lib/utils";
import { ScanHistoryEmpty } from "./ScanHistoryEmpty";
import {
  dateRangeOptions,
  demoScanHistory,
  formatTimestamp,
  riskBadgeClass,
  riskDotClass,
  riskLevels,
  scanTypeIcons,
  scanTypes,
  sortOptions,
  statusBadgeClass,
  type DateRangeKey,
  type RiskLevel,
  type ScanHistoryRecord,
  type ScanType,
  type SortKey,
} from "./scan-history-data";

const PAGE_SIZE = 6;
const riskOrder: Record<RiskLevel, number> = { Safe: 0, Suspicious: 1, "High Risk": 2 };

const selectClass =
  "h-11 w-full rounded-xl border border-border bg-surface/70 px-3 text-sm text-foreground shadow-[var(--shadow-soft)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface Props {
  loading: boolean;
  onViewDetails: (record: ScanHistoryRecord) => void;
}

export function ScanHistoryTable({ loading, onViewDetails }: Props) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ScanType | "all">("all");
  const [risk, setRisk] = useState<RiskLevel | "all">("all");
  const [range, setRange] = useState<DateRangeKey>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const records = useMemo(() => {
    const days = dateRangeOptions.find((o) => o.value === range)?.days ?? null;
    const cutoff = days === null ? null : Date.now() - days * 24 * 60 * 60 * 1000;
    const q = query.trim().toLowerCase();

    const filtered = demoScanHistory.filter((r) => {
      if (type !== "all" && r.type !== type) return false;
      if (risk !== "all" && r.riskLevel !== risk) return false;
      if (cutoff !== null && new Date(r.timestamp).getTime() < cutoff) return false;
      if (q && !`${r.label} ${r.type} ${r.riskLevel} ${r.status}`.toLowerCase().includes(q))
        return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return +new Date(a.timestamp) - +new Date(b.timestamp);
        case "highest":
          return b.riskScore - a.riskScore || riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        case "lowest":
          return a.riskScore - b.riskScore || riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        default:
          return +new Date(b.timestamp) - +new Date(a.timestamp);
      }
    });
  }, [query, type, risk, range, sort]);

  const shown = records.slice(0, visible);
  const filtersActive = Boolean(query.trim()) || type !== "all" || risk !== "all" || range !== "all";

  const resetPaging = () => setVisible(PAGE_SIZE);

  return (
    <section aria-labelledby="history-heading" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="history-heading" className="text-xl font-semibold sm:text-2xl">
            Scan records
          </h2>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Demo data
          </span>
        </div>
      </Reveal>

      <Reveal delay={70} className="mt-6">
        <div className="surface-card p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="history-search" className="sr-only">
                Search scan records
              </label>
              <input
                id="history-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPaging();
                }}
                placeholder="Search records…"
                className="h-11 w-full rounded-xl border border-border bg-surface/70 pl-9 pr-3 text-sm shadow-[var(--shadow-soft)] transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="history-type" className="sr-only">
                Filter by scan type
              </label>
              <select
                id="history-type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as ScanType | "all");
                  resetPaging();
                }}
                className={selectClass}
              >
                <option value="all">All scan types</option>
                {scanTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="history-risk" className="sr-only">
                Filter by risk level
              </label>
              <select
                id="history-risk"
                value={risk}
                onChange={(e) => {
                  setRisk(e.target.value as RiskLevel | "all");
                  resetPaging();
                }}
                className={selectClass}
              >
                <option value="all">All risk levels</option>
                {riskLevels.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="history-range" className="sr-only">
                Filter by date range
              </label>
              <select
                id="history-range"
                value={range}
                onChange={(e) => {
                  setRange(e.target.value as DateRangeKey);
                  resetPaging();
                }}
                className={selectClass}
              >
                {dateRangeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="history-sort" className="sr-only">
                Sort records
              </label>
              <select
                id="history-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className={selectClass}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-6">
        {loading ? (
          <div className="surface-card flex flex-col items-center px-6 py-14 text-center">
            <Loader2 className="size-6 animate-spin text-accent" aria-hidden="true" />
            <p className="mt-4 text-sm text-muted-foreground">Loading sample scan records…</p>
          </div>
        ) : shown.length === 0 ? (
          <ScanHistoryEmpty filtered={filtersActive} />
        ) : (
          <>
            <p className="mb-3 text-xs text-muted-foreground" aria-live="polite">
              Showing {shown.length} of {records.length} sample records
            </p>

            <div className="surface-card overflow-hidden p-2 sm:p-3">
              <div className="hidden grid-cols-[minmax(0,2fr)_120px_120px_170px_120px_110px] gap-3 border-b border-border px-4 pb-3 pt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground lg:grid">
                <span>Item</span>
                <span>Type</span>
                <span>Risk</span>
                <span>Date &amp; time</span>
                <span>Status</span>
                <span className="text-right">Details</span>
              </div>

              <ul>
                {shown.map((record) => {
                  const Icon = scanTypeIcons[record.type];
                  return (
                    <li key={record.id}>
                      <div className="grid gap-3 rounded-xl px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface/70 hover:shadow-[var(--shadow-soft)] lg:grid-cols-[minmax(0,2fr)_120px_120px_170px_120px_110px] lg:items-center">
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-1.5 size-2.5 shrink-0 rounded-full",
                              riskDotClass[record.riskLevel],
                            )}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{record.label}</p>
                            <p className="text-xs text-muted-foreground lg:hidden">
                              {record.type} · {formatTimestamp(record.timestamp)}
                            </p>
                          </div>
                        </div>

                        <span className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
                          <Icon className="size-4 shrink-0 text-accent" aria-hidden="true" />
                          {record.type}
                        </span>

                        <span className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                              riskBadgeClass[record.riskLevel],
                            )}
                          >
                            {record.riskLevel}
                          </span>
                          <span className="text-xs text-muted-foreground">{record.riskScore}/100</span>
                        </span>

                        <time className="hidden text-xs text-muted-foreground lg:block">
                          {formatTimestamp(record.timestamp)}
                        </time>

                        <span
                          className={cn(
                            "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs",
                            statusBadgeClass[record.status],
                          )}
                        >
                          {record.status}
                        </span>

                        <div className="lg:text-right">
                          <button
                            type="button"
                            onClick={() => onViewDetails(record)}
                            className="press-3d inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-foreground shadow-[var(--shadow-soft)] transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            View Details
                            <ChevronRight className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {visible < records.length ? (
              <div className="mt-6 flex justify-center">
                <MeshButton variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load more records
                </MeshButton>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
