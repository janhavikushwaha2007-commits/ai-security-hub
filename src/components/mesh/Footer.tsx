import { ShieldHalf } from "lucide-react";
import { footerColumns } from "./landing-data";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-brand)]">
                <ShieldHalf className="size-5 text-primary-foreground" aria-hidden="true" />
              </span>
              <span className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
                AI Security Mesh
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              An AI-assisted security layer for everyday digital decisions. Currently a frontend
              preview — no live detection services are connected.
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AI Security Mesh. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#top" className="transition-colors hover:text-accent">
              Privacy
            </a>
            <a href="#top" className="transition-colors hover:text-accent">
              Terms
            </a>
            <a href="#top" className="transition-colors hover:text-accent">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
