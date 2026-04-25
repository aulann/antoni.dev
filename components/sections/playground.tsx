"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { FakeTerminal } from "@/components/playground/fake-terminal";

export function Playground() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="lab" className="border-t border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">

        <div ref={ref} className="mb-12 flex flex-col gap-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
          >
            Terminal
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading max-w-2xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-6xl"
          >
            Wypróbuj <span className="text-accent">sam.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm text-muted-foreground"
          >
            Wpisz <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-foreground">help</code> żeby zobaczyć wszystkie komendy.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <FakeTerminal className="w-full" />
        </motion.div>
      </div>
    </section>
  );
}
