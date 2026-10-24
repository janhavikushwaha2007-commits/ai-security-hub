import { useEffect, useState } from "react";
import { Menu, ShieldHalf, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MeshButton } from "./MeshButton";
import { navLinks } from "./landing-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8 lg:grid-cols-[auto_1fr_auto]"
      >
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-brand)] shadow-[var(--shadow-glow)]">
            <ShieldHalf className="size-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-sm font-semibold uppercase tracking-[0.16em]">
            AI Security Mesh
          </span>
        </a>

        <ul className="hidden items-center justify-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative text-sm text-muted-foreground transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:text-foreground hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <MeshButton variant="ghost" size="sm" asChild>
            <Link to="/auth">Login</Link>
          </MeshButton>
          <MeshButton asChild size="sm">
            <Link to="/dashboard">Get Started</Link>
          </MeshButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="press-3d grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-3 flex gap-2">
              <MeshButton variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </MeshButton>
              <MeshButton asChild size="sm" className="flex-1">
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </MeshButton>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
