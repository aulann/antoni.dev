"use client";

import { GithubLogo, EnvelopeSimple, ArrowUp } from "@phosphor-icons/react";
import { Monogram } from "@/components/brand/monogram";
import { navLinks } from "@/lib/content/nav";

const socials = [
  { label: "Email", href: "mailto:ulanantek11@gmail.com", Icon: EnvelopeSimple },
  { label: "GitHub", href: "https://github.com/aulann", Icon: GithubLogo },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">

        {/* Top: brand + nav */}
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr] md:gap-16">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Monogram className="size-9" />
              <span className="font-heading text-xl font-medium tracking-tight">
                Antoni
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Programuję, uczę się, bawię się AI. Próbuję wszystkiego.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socials.map(({ label, href, Icon }) => {
                const isExternal = href.startsWith("http");
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                  >
                    <Icon size={15} weight="regular" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground/60">
              Nawigacja
            </span>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground/60">
              Kontakt
            </span>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:ulanantek11@gmail.com"
                className="text-sm text-foreground transition-colors hover:text-accent"
              >
                ulanantek11@gmail.com
              </a>
              <span className="text-xs text-muted-foreground leading-relaxed">
                Odpiszę najszybciej jak mogę.
              </span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-6 md:flex-row md:items-center">
          <span suppressHydrationWarning className="text-xs text-muted-foreground/70">
            © {year} — Antoni Ułan
          </span>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Wróć na górę
            <ArrowUp size={12} weight="bold" />
          </a>
        </div>

      </div>
    </footer>
  );
}
