"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useSpring } from "motion/react";
import { Star } from "@phosphor-icons/react";
import * as PhosphorIcons from "@phosphor-icons/react";
import * as SimpleIcons from "@icons-pack/react-simple-icons";
import type { TechItem } from "@/lib/content/tech";

function StarRating({ level, color }: { level: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const full = level >= i + 1;
        const half = !full && level >= i + 0.5;
        return (
          <span key={i} className="relative" style={{ width: 11, height: 11 }}>
            <Star size={11} weight="regular" className="absolute inset-0 text-border" />
            {(full || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: full ? "100%" : "52%" }}
              >
                <Star size={11} weight="fill" style={{ color }} />
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

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }, []);

  // Close tooltip on scroll or outside tap (touch only)
  useEffect(() => {
    if (!isTouch || !showBar) return;

    const close = () => setShowBar(false);

    const onTouchStart = (e: TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };

    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("touchmove", close);
      window.removeEventListener("touchstart", onTouchStart);
    };
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
    setShowBar((prev) => !prev);
  };

  const ringColor = item.brandColor ?? "var(--accent)";
  const SimIcon = item.simpleIcon ? getSimpleIcon(item.simpleIcon) : null;
  const PhosIcon = getPhosphorIcon(item.phosphorIcon ?? "Question");

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center gap-2"
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
          animate={hovered || showBar ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
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

      {/* Tooltip — hover on desktop, tap on mobile */}
      <motion.div
        className="absolute -bottom-12 left-1/2 z-30 w-40 -translate-x-1/2 overflow-hidden rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-md"
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
    </div>
  );
}
