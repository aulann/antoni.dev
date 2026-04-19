"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent"
      aria-label={isDark ? "Włącz motyw jasny" : "Włącz motyw ciemny"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Moon size={18} weight="fill" />
            ) : (
              <Sun size={18} weight="fill" />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
