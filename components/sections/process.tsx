"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { processSteps } from "@/lib/content/process";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperNav,
  StepperPanel,
  StepperContent,
} from "@/components/ui/stepper";

export function Process() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section
      id="proces"
      className="border-t border-border/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Header />

        <div className="mt-16 md:mt-24">
          <Stepper
            value={activeStep}
            onValueChange={setActiveStep}
            orientation="vertical"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
              {/* Left — step nav */}
              <StepperNav className="flex-col gap-0">
                {processSteps.map((step, i) => (
                  <StepperItem key={step.number} step={i + 1} className="flex-col items-stretch">
                    <StepperTrigger className="group w-full rounded-xl px-4 py-5 text-left transition-colors hover:bg-muted/40 data-[state=active]:bg-muted/50">
                      <div className="flex items-center gap-4">
                        {/* Number badge */}
                        <span className="font-heading tabular-nums text-xs font-semibold tracking-widest text-muted-foreground/40 transition-colors group-data-[state=active]:text-accent">
                          {step.number}
                        </span>

                        {/* Separator line */}
                        <span className="h-px flex-1 bg-border/40 transition-colors group-data-[state=active]:bg-accent/40" />

                        {/* Title */}
                        <span className="font-heading text-base font-medium tracking-tight text-muted-foreground transition-colors group-data-[state=active]:text-foreground">
                          {step.title}
                        </span>

                        {/* Active dot */}
                        <span className="ml-1 size-1.5 rounded-full bg-transparent transition-colors group-data-[state=active]:bg-accent" />
                      </div>
                    </StepperTrigger>

                    {/* Connector between items */}
                    {i < processSteps.length - 1 && (
                      <div className="mx-4 h-px bg-border/30" />
                    )}
                  </StepperItem>
                ))}
              </StepperNav>

              {/* Right — content */}
              <StepperPanel>
                {processSteps.map((step, i) => (
                  <StepperContent key={step.number} value={i + 1}>
                    <ContentCard step={step} index={i} />
                  </StepperContent>
                ))}
              </StepperPanel>
            </div>
          </Stepper>
        </div>
      </div>
    </section>
  );
}

function Header() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
      >
        05 · Proces
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading max-w-2xl text-4xl leading-tight font-medium tracking-tight md:text-6xl"
      >
        Jak pracuję.
      </motion.h2>
    </div>
  );
}

function ContentCard({ step, index }: { step: (typeof processSteps)[0]; index: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.number}
        initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full flex-col gap-6 rounded-2xl border border-border/40 bg-muted/20 p-8 md:p-10"
      >
        {/* Step number — large */}
        <span className="font-heading text-7xl font-semibold leading-none tracking-tight text-muted-foreground/10 select-none">
          {step.number}
        </span>

        <div className="flex flex-col gap-4">
          <h3 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
            {step.body}{" "}
            <span className="text-muted-foreground/40">{step.title}.</span>
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            {step.detail}
          </p>
        </div>

        {/* Progress dots */}
        <div className="mt-auto flex items-center gap-1.5 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-accent"
                  : i < index
                  ? "w-2 bg-accent/30"
                  : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
