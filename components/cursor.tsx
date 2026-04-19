"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40, mass: 0.4 });
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 14, mass: 0.8 });
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 14, mass: 0.8 });
  const lastMovedAt = useRef(0);

  useEffect(() => {
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supportsHover || reduceMotion) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      lastMovedAt.current = performance.now();
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]',
      );
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          className="size-2 -translate-1/2 rounded-full bg-white"
          animate={{ scale: hovering ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="size-10 -translate-1/2 rounded-full border border-foreground/30 backdrop-blur-[1px]"
          animate={{
            scale: hovering ? 1.8 : 1,
            borderColor: hovering
              ? "color-mix(in srgb, var(--accent) 90%, transparent)"
              : "color-mix(in srgb, var(--foreground) 30%, transparent)",
          }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        />
      </motion.div>
    </>
  );
}
