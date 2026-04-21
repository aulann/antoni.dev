"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { MagneticDots } from "@/components/playground/magnetic-dots";
import { MorphingText } from "@/components/playground/morphing-text";
import { TiltCard } from "@/components/playground/tilt-card";
import { FakeTerminal } from "@/components/playground/fake-terminal";
import { ShakeBalloons } from "@/components/playground/shake-balloons";

export function Playground() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="lab" className="border-t border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">

        <div ref={ref} className="mb-16 flex flex-col gap-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
          >
            Lab
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading max-w-2xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-6xl"
          >
            Laboratorium.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm text-muted-foreground"
          >
            Interaktywne zabawki — klikaj, poruszaj, eksploruj.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4"
        >
          {/* Magnetic Dots — desktop only */}
          <div className="relative hidden overflow-hidden rounded-2xl border border-border/40 bg-card/60 md:block">
            <span className="absolute top-4 left-4 z-10 select-none text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground/50 uppercase">
              Magnetyczne kropki
            </span>
            <div className="h-80 w-full">
              <MagneticDots />
            </div>
          </div>

          {/* Morphing Text */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-card/60 py-16 px-8">
            <span className="absolute top-4 left-4 select-none text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground/50 uppercase">
              Morfing tekstu
            </span>
            <MorphingText className="w-full" />
            <span className="absolute bottom-4 right-5 select-none text-[0.6rem] text-muted-foreground/30">
              automatyczna pętla →
            </span>
          </div>

          {/* 3D Tilt — desktop only */}
          <div className="hidden h-80 md:block">
            <TiltCard className="h-full w-full" />
          </div>

          {/* Fake Terminal */}
          <FakeTerminal className="w-full" />

          {/* Shake Balloons — mobile only */}
          <ShakeBalloons />
        </motion.div>
      </div>
    </section>
  );
}
