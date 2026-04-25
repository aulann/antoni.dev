"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useSpring } from "motion/react";
import { Star, X } from "@phosphor-icons/react";
import * as PhosphorIcons from "@phosphor-icons/react";
import * as SimpleIcons from "@icons-pack/react-simple-icons";
import type { TechItem } from "@/lib/content/tech";

function StarRating({ level, color, size = 11 }: { level: number; color: string; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const full = level >= i + 1;
        const half = !full && level >= i + 0.5;
        return (
          <span key={i} className="relative" style={{ width: size, height: size }}>
            <Star size={size} weight="regular" className="absolute inset-0 text-border" />
            {(full || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: full ? "100%" : "52%" }}
              >
                <Star size={size} weight="fill" style={{ color }} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}


type Props = {
  item: TechItem;
  index: number;
};

function getPhosphorIcon(name: string) {
  const key = name as keyof typeof PhosphorIcons;
  return (PhosphorIcons[key] ?? PhosphorIcons.Question) as React.ElementType;
}

function getSimpleIcon(name: string) {
  const key = name as keyof typeof SimpleIcons;
  return (SimpleIcons[key] ?? null) as React.ElementType | null;
}

export function TechIcon({ item, index }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }, []);

  // Close desktop tooltip on scroll
  useEffect(() => {
    if (isTouch || !showBar) return;
    const close = () => setShowBar(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [isTouch, showBar]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (!isTouch || !showBar) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isTouch, showBar]);

  const floatY = useMotionValue(0);
  const floatPhase = useMemo(() => (index * 137.508) % (Math.PI * 2), [index]);
  const floatAmp = useMemo(() => 2 + (index % 3) * 0.8, [index]);
  const floatPeriod = useMemo(() => 3200 + (index % 5) * 700, [index]);

  useAnimationFrame((t) => {
    if (reduceMotion || hovered) return;
    floatY.set(Math.sin((t / floatPeriod) * Math.PI * 2 + floatPhase) * floatAmp);
  });

  const magX = useSpring(0, { stiffness: 260, damping: 18 });
  const magY = useSpring(0, { stiffness: 260, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || isTouch) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    magX.set(((e.clientX - cx) / (rect.width / 2)) * 8);
    magY.set(((e.clientY - cy) / (rect.height / 2)) * 8);
  };

  const handleMouseEnter = () => {
    if (isTouch) return;
    setHovered(true);
    setShowBar(true);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    setHovered(false);
    setShowBar(false);
    magX.set(0);
    magY.set(0);
  };

  const handleClick = () => {
    if (!isTouch) return;
    setShowBar(true);
  };

  const ringColor = item.brandColor ?? "var(--accent)";
  const SimIcon = item.simpleIcon ? getSimpleIcon(item.simpleIcon) : null;
  const PhosIcon = getPhosphorIcon(item.phosphorIcon ?? "Question");

  const IconEl = SimIcon ?? PhosIcon;

  return (
    <>
      <div
        ref={containerRef}
        className="relative flex w-20 flex-col items-center gap-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <motion.div
          style={{
            y: floatY,
            x: magX,
            boxShadow: hovered
              ? `0 0 18px 2px color-mix(in srgb, ${ringColor} 30%, transparent)`
              : undefined,
          }}
          className="relative flex size-16 cursor-pointer items-center justify-center rounded-2xl border border-border/60 bg-card transition-shadow duration-200"
          data-cursor="interactive"
          animate={hovered && !reduceMotion ? { scale: 1.12 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: ringColor }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={hovered || (showBar && !isTouch) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          />

          {SimIcon ? (
            <SimIcon
              size={30}
              style={{ color: item.brandColor }}
              className="relative z-10"
              aria-hidden
            />
          ) : (
            <PhosIcon
              size={30}
              weight={hovered ? "fill" : "regular"}
              className="relative z-10 text-accent"
              aria-hidden
            />
          )}
        </motion.div>

        <motion.span
          style={{ x: magX }}
          className="max-w-22 text-center text-[0.73rem] leading-tight text-muted-foreground"
        >
          {item.name}
        </motion.span>

        {/* Desktop tooltip — hover only */}
        {!isTouch && (
          <motion.div
            className="absolute -bottom-12 left-1/2 z-30 w-44 -translate-x-1/2 overflow-hidden rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-md"
            initial={false}
            animate={
              showBar
                ? { opacity: 1, y: 0, scale: 1, pointerEvents: "none" }
                : { opacity: 0, y: 4, scale: 0.97, pointerEvents: "none" }
            }
            transition={{ duration: 0.18, ease: "easeOut" }}
            aria-hidden
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="truncate text-xs font-medium text-foreground">
                {item.name}
              </span>
              <StarRating level={item.level} color={ringColor} />
            </div>
            <p className="mt-2 text-[0.73rem] leading-snug text-muted-foreground">
              {item.note}
            </p>
          </motion.div>
        )}
      </div>

      {/* Mobile bottom sheet — portal to body */}
      {mounted && isTouch && createPortal(
        <AnimatePresence>
          {showBar && (
            <>
              {/* Overlay */}
              <motion.div
                key="overlay"
                className="fixed inset-0 z-200 bg-black/50 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={() => setShowBar(false)}
                aria-hidden
              />

              {/* Sheet */}
              <motion.div
                key="sheet"
                role="dialog"
                aria-modal="true"
                aria-label={item.name}
                className="dot-grid fixed right-0 bottom-0 left-0 z-201 rounded-t-3xl border-t border-border/50 bg-background"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 340, damping: 34, mass: 0.9 }
                }
              >
                {/* Drag handle */}
                <div className="flex justify-center pb-2 pt-3">
                  <div className="h-1 w-10 rounded-full bg-border/60" />
                </div>

                <div className="px-6 pt-2 pb-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
                  {/* Icon + close */}
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex size-20 items-center justify-center rounded-2xl border border-border/60 bg-card">
                      {SimIcon ? (
                        <SimIcon size={40} style={{ color: ringColor }} aria-hidden />
                      ) : (
                        <PhosIcon size={40} weight="regular" style={{ color: ringColor }} aria-hidden />
                      )}
                    </div>

                    <button
                      onClick={() => setShowBar(false)}
                      className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground"
                      aria-label="Zamknij"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>

                  {/* Name */}
                  <h3 className="mb-4 font-heading text-2xl font-semibold tracking-tight text-foreground">
                    {item.name}
                  </h3>

                  {/* Segmented level bar — 5 segments, supports 0.5 steps */}
                  <div className="mb-5 flex gap-2">
                    {Array.from({ length: 5 }, (_, i) => {
                      const fill = Math.min(1, Math.max(0, item.level - i));
                      return (
                        <div
                          key={i}
                          className="relative h-2 flex-1 overflow-hidden rounded-full"
                          style={{ backgroundColor: "var(--border)" }}
                        >
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ backgroundColor: "var(--accent)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${fill * 100}%` }}
                            transition={{
                              delay: reduceMotion ? 0 : 0.08 + i * 0.06,
                              duration: 0.32,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
