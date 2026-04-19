"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { splashContent } from "@/lib/content/hero";

const STORAGE_KEY = "antoni-splash-seen";

export function Splash() {
  const [phase, setPhase] = useState<"typing" | "hold" | "leaving" | "gone">(
    "typing",
  );
  const [visibleChars, setVisibleChars] = useState(0);
  const [skipFast, setSkipFast] = useState<boolean | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const seen =
      typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY);
    setSkipFast(reduceMotion || Boolean(seen));
  }, []);

  useEffect(() => {
    if (skipFast === null) return;
    if (skipFast) {
      setPhase("leaving");
      const t = setTimeout(() => setPhase("gone"), 200);
      return () => clearTimeout(t);
    }

    const text = splashContent.text;
    const delay = splashContent.typingDelayMs;
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i += 1;
      setVisibleChars(i);
      if (i < text.length) {
        setTimeout(tick, delay);
      } else {
        setTimeout(() => setPhase("hold"), splashContent.holdMs);
      }
    };
    const initialDelay = setTimeout(tick, 320);

    return () => {
      cancelled = true;
      clearTimeout(initialDelay);
    };
  }, [skipFast]);

  useEffect(() => {
    if (phase === "hold") {
      const t = setTimeout(() => setPhase("leaving"), 350);
      return () => clearTimeout(t);
    }
    if (phase === "leaving") {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      const t = setTimeout(() => setPhase("gone"), splashContent.fadeMs);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    const skip = (e: KeyboardEvent | MouseEvent) => {
      if ("key" in e && e.key !== "Escape" && e.key !== " " && e.key !== "Enter")
        return;
      setPhase((current) => {
        if (current === "typing" || current === "hold") return "leaving";
        return current;
      });
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, []);

  const text = splashContent.text;
  const shown = text.slice(0, visibleChars);

  return (
    <AnimatePresence>
      {phase !== "gone" && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "leaving" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: splashContent.fadeMs / 1000, ease: "easeOut" }}
          className="fixed inset-0 z-80 flex items-center justify-center bg-background noise-overlay"
          aria-hidden={phase === "leaving"}
          role="status"
          aria-live="polite"
        >
          <div className="relative flex flex-col items-center gap-6">
            <span className="font-heading text-4xl tracking-tight text-foreground md:text-6xl">
              {skipFast ? text : shown}
              {!skipFast && phase === "typing" && (
                <motion.span
                  className="ml-1 inline-block h-[1em] w-0.5 translate-y-[0.1em] bg-accent align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              )}
            </span>
            <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Antoni · 2026
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
