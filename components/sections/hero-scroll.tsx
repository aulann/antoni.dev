"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, PaperPlaneTilt } from "@phosphor-icons/react";
import { heroContent } from "@/lib/content/hero";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { useBackNav } from "@/components/providers/back-nav-provider";

const SPLASH_TEXT = "\u201eCode is craft.\u201d";

// Per-character delays — burst at start, pause after "Cod", natural rhythm after
const CHAR_DELAYS: number[] = [
  60,  // "
  45,  // C
  42,  // o
  40,  // d
  190, // e  ← pause after burst
  85,  // (space)
  65,  // i
  60,  // s
  220, // (space) ← pause before "craft"
  55,  // c
  45,  // r
  42,  // a
  40,  // f
  55,  // t
  280, // .  ← dramatic pause before final dot
  55,  // "
];


function TypingTitle({ onDone }: { onDone: () => void }) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [cursorDone, setCursorDone] = useState(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisibleChars(SPLASH_TEXT.length);
      setCursorDone(true);
      onDone();
      return;
    }

    let i = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setVisibleChars(i);
      if (i < SPLASH_TEXT.length) {
        setTimeout(tick, CHAR_DELAYS[i] ?? 60);
      } else {
        // Blink cursor briefly, then signal done
        setTimeout(() => {
          if (!cancelled) {
            setCursorDone(true);
            onDoneRef.current();
          }
        }, 600);
      }
    };

    const initial = setTimeout(tick, 350);
    return () => {
      cancelled = true;
      clearTimeout(initial);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="font-heading text-4xl tracking-tight text-foreground md:text-6xl select-none">
        {SPLASH_TEXT.slice(0, visibleChars)}
        <motion.span
          className="ml-1 inline-block h-[1em] w-0.5 translate-y-[0.1em] bg-accent align-middle"
          animate={cursorDone ? { opacity: 0 } : { opacity: [1, 0, 1] }}
          transition={cursorDone ? { duration: 0.15 } : { duration: 0.8, repeat: Infinity }}
        />
      </span>
    </div>
  );
}

function HeroCardContent({ visible }: { visible: boolean }) {
  return (
    <div className="relative flex h-full items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dot-grid mask-[radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-80 -translate-1/2 rounded-full bg-accent/5 blur-3xl md:size-175"
      />

      {/* Always in DOM — only opacity/transform change, never mount/unmount (prevents layout shift) */}
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        aria-hidden={!visible}
        className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 md:px-10 md:py-10"
      >
        <h1 className="font-heading text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] font-medium tracking-[-0.02em] select-none">
          {heroContent.verbs.map((verb, i) => (
            <motion.span
              key={verb}
              className="block mb-1.25 md:mb-0"
              animate={visible
                ? { y: 0, opacity: 1 }
                : { y: "110%", opacity: 0 }}
              transition={visible
                ? { delay: 0.15 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0 }}
            >
              <span className="inline-block overflow-hidden">
                {verb}
                {i === heroContent.verbs.length - 1 && (
                  <motion.span
                    className="ml-1 inline-block text-accent"
                    animate={visible
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.4 }}
                    transition={visible
                      ? { delay: 0.15 + i * 0.12 + 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                      : { duration: 0 }}
                  >
                    _
                  </motion.span>
                )}
              </span>
            </motion.span>
          ))}
        </h1>

        <motion.p
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={visible ? { delay: 0.75, duration: 0.7 } : { duration: 0 }}
          className="max-w-xl text-base text-muted-foreground md:text-lg"
        >
          {heroContent.tagline}
        </motion.p>

        <motion.div
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={visible ? { delay: 0.9, duration: 0.7 } : { duration: 0 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <a
            href={heroContent.primaryCta.href}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {heroContent.primaryCta.label}
            <ArrowRight
              size={16}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
          <a
            href={heroContent.secondaryCta.href}
            className="group inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            <PaperPlaneTilt size={16} weight="fill" />
            {heroContent.secondaryCta.label}
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function HeroScroll() {
  const isBackNav = useBackNav();
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    if (isBackNav) setCardVisible(true);
  }, [isBackNav]);

  return (
    <section id="top">
      <ContainerScroll
        titleComponent={<TypingTitle onDone={() => setCardVisible(true)} />}
      >
        <HeroCardContent visible={cardVisible} />
      </ContainerScroll>
    </section>
  );
}
