"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { navLinks, brand } from "@/lib/content/nav";
import { ThemeToggle } from "./theme-toggle";
import { Monogram } from "@/components/brand/monogram";
import { cn } from "@/lib/utils";

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-[padding,background,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/80 py-3 backdrop-blur-md"
            : "border-b border-transparent bg-transparent py-5",
        )}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8">
          <a
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label={`${brand.name} — strona główna`}
          >
            <Monogram className="size-8 transition-transform group-hover:-rotate-6" />
            <span className="font-heading text-lg font-medium tracking-tight">
              {brand.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent lg:hidden"
              aria-label="Otwórz menu"
            >
              <List size={18} weight="bold" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full flex-col px-5 pt-5 pb-8"
            >
              <div className="mb-12 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Monogram className="size-8" />
                  <span className="font-heading text-lg font-medium">
                    {brand.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 text-foreground transition-colors hover:border-accent hover:text-accent"
                  aria-label="Zamknij menu"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
              <ul className="flex flex-1 flex-col justify-center gap-2">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-3 font-heading text-4xl font-medium transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">Code is craft.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
