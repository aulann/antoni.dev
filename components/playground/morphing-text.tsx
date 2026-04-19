"use client";

import { useEffect, useState, useRef } from "react";

const PHRASES = [
  "Frontend.",
  "Backend.",
  "AI & LLM.",
  "Automatyzacje.",
  "Hardware.",
  "Networking.",
  "Code is craft.",
];

const MORPH_MS = 550;
const HOLD_MS = 2400;

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function MorphingText({ className }: { className?: string }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [morphing, setMorphing] = useState(false);
  const nextIdx = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf = useRef<number>(0);
  const startTs = useRef(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const schedule = () => {
      timer.current = setTimeout(() => {
        if (reduceMotion.current) {
          setCurrent(nextIdx.current);
          nextIdx.current = (nextIdx.current + 1) % PHRASES.length;
          schedule();
          return;
        }
        setMorphing(true);
        startTs.current = performance.now();

        const animate = (now: number) => {
          const t = Math.min(1, (now - startTs.current) / MORPH_MS);
          setProgress(t);
          if (t < 1) {
            raf.current = requestAnimationFrame(animate);
          } else {
            setCurrent(nextIdx.current);
            nextIdx.current = (nextIdx.current + 1) % PHRASES.length;
            setMorphing(false);
            setProgress(0);
            schedule();
          }
        };
        raf.current = requestAnimationFrame(animate);
      }, HOLD_MS);
    };

    schedule();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const e = ease(progress);
  const outBlur = morphing ? e * 14 : 0;
  const outOpacity = morphing ? 1 - e : 1;
  const inBlur = morphing ? (1 - e) * 14 : 14;
  const inOpacity = morphing ? e : 0;

  return (
    <div
      className={`relative flex items-center justify-center ${className ?? ""}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className="absolute font-heading text-5xl font-semibold tracking-tight text-foreground md:text-7xl"
        style={{ filter: `blur(${outBlur}px)`, opacity: outOpacity }}
      >
        {PHRASES[current]}
      </span>
      <span
        aria-hidden="true"
        className="absolute font-heading text-5xl font-semibold tracking-tight text-accent md:text-7xl"
        style={{ filter: `blur(${inBlur}px)`, opacity: inOpacity }}
      >
        {PHRASES[nextIdx.current]}
      </span>
      {/* invisible spacer keeps height stable */}
      <span className="invisible font-heading text-5xl font-semibold tracking-tight md:text-7xl">
        Automatyzacje.
      </span>
    </div>
  );
}
