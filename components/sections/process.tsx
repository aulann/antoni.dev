"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { processSteps } from "@/lib/content/process";
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperNav,
  StepperPanel,
  StepperContent,
} from "@/components/ui/stepper";
import { Check } from "lucide-react";

// Top of the wheel = index 3 in CSS circle coords, so rotate array so step01 lands there
const orderedSteps = [...processSteps.slice(1), processSteps[0]];

export function Process() {
  return (
    <section id="proces" className="border-t border-border/40 py-24 md:pt-32 md:pb-0">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Header />
      </div>

      {/* Mobile: stepper */}
      <div className="md:hidden mx-auto max-w-6xl px-5 mt-16">
        <MobileStepper />
      </div>

      {/* Desktop: radial scroll gallery */}
      <div className="hidden md:block">
        <RadialScrollGallery
          baseRadius={580}
          mobileRadius={580}
          scrollDuration={2000}
          visiblePercentage={48}
        >
          {(hoveredIndex) =>
            orderedSteps.map((item, index) => {
              const isActive = hoveredIndex === index;
              return (
                <div
                  key={item.number}
                  className={`
                    w-56 h-80 sm:w-64 sm:h-96
                    rounded-2xl border p-6 flex flex-col gap-4 items-start
                    transition-all duration-500
                    ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground shadow-2xl"
                        : "bg-card border-border text-card-foreground opacity-55 scale-90"
                    }
                  `}
                >
                  <div className="w-full flex justify-between items-center">
                    <span
                      className={`font-mono text-xs tracking-widest ${
                        isActive ? "text-primary-foreground/50" : "text-muted-foreground/50"
                      }`}
                    >
                      {item.number}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-primary-foreground/70" />}
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    <h3 className="text-2xl font-bold leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-primary-foreground/80" : "text-foreground/70"
                      }`}
                    >
                      {item.body}
                    </p>
                    <p
                      className={`text-xs leading-relaxed ${
                        isActive ? "text-primary-foreground/60" : "text-muted-foreground"
                      }`}
                    >
                      {item.detail}
                    </p>
                  </div>

                  <div
                    className={`h-0.5 w-full rounded-full ${
                      isActive ? "bg-primary-foreground/20" : "bg-border"
                    }`}
                  />
                </div>
              );
            })
          }
        </RadialScrollGallery>
      </div>
    </section>
  );
}

function MobileStepper() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <Stepper value={activeStep} onValueChange={setActiveStep} orientation="vertical">
      <div className="grid grid-cols-1 gap-8">
        <StepperNav className="flex-col gap-0">
          {processSteps.map((step, i) => (
            <StepperItem key={step.number} step={i + 1} className="flex-col items-stretch">
              <StepperTrigger className="group w-full rounded-xl px-4 py-5 text-left transition-colors hover:bg-muted/40 data-[state=active]:bg-muted/50">
                <div className="flex items-center gap-4">
                  <span className="font-heading tabular-nums text-xs font-semibold tracking-widest text-muted-foreground/40 transition-colors group-data-[state=active]:text-accent">
                    {step.number}
                  </span>
                  <span className="h-px flex-1 bg-border/40 transition-colors group-data-[state=active]:bg-accent/40" />
                  <span className="font-heading text-base font-medium tracking-tight text-muted-foreground transition-colors group-data-[state=active]:text-foreground">
                    {step.title}
                  </span>
                  <span className="ml-1 size-1.5 rounded-full bg-transparent transition-colors group-data-[state=active]:bg-accent" />
                </div>
              </StepperTrigger>
              {i < processSteps.length - 1 && (
                <div className="mx-4 h-px bg-border/30" />
              )}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel>
          {processSteps.map((step, i) => (
            <StepperContent key={step.number} value={i + 1}>
              <ContentCard step={step} index={i} />
            </StepperContent>
          ))}
        </StepperPanel>
      </div>
    </Stepper>
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

        <div className="mt-auto flex items-center gap-1.5 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-accent" : i < index ? "w-2 bg-accent/30" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
