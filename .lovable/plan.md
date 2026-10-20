# Reports & Alerts

## Build
- Add `/reports-alerts` with static, clearly labelled DEMO DATA for report summaries, filterable/searchable report rows, report details, and sample alerts.
- Match existing dashboard/history patterns, with loading, empty, and recoverable error states, responsive layouts, accessible controls, and restrained motion.
- Add a dashboard Quick Action that navigates to the new page and include a Back to Dashboard action.

## Technical details
- Keep report/alert demo data and feature UI isolated in `src/components/reports-alerts/`; compose them from a thin TanStack route with unique metadata.
- Reuse existing design tokens, `MeshButton`, `Reveal`, and `Footer`; no backend, integrations, exports, or changes to existing module behavior.
- Run TypeScript/build checks and Playwright checks for dashboard navigation, search/filters, details, and responsive presentation.
