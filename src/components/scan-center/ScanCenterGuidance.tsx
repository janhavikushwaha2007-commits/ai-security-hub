import { Link } from "@tanstack/react-router";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Reveal } from "@/components/mesh/Reveal";
import { scanGuidance } from "./scan-center-data";

export function ScanCenterGuidance() {
  return (
    <section aria-labelledby="guidance-heading" className="scroll-mt-24">
      <Reveal>
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-accent" aria-hidden="true" />
          <h2 id="guidance-heading" className="text-xl font-semibold sm:text-2xl">
            Which scanner should I use?
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Match the suspicious content you received with the right tool. These are demo interfaces — no data leaves your browser.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/40 shadow-[var(--shadow-soft)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface/70 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">If you received...</th>
                  <th className="px-5 py-3 font-medium">Use this scanner</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scanGuidance.map((item) => (
                  <tr key={item.scanner} className="transition-colors hover:bg-surface/60">
                    <td className="px-5 py-3.5 text-foreground/90">{item.contentType}</td>
                    <td className="px-5 py-3.5 font-medium text-accent">{item.scanner}</td>
                    <td className="px-5 py-3.5">
                      <Link
                        to={item.route}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-accent hover:underline"
                      >
                        Open
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
