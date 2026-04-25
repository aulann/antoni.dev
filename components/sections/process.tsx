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
import { Clock } from "@phosphor-icons/react";
import * as PhosphorIcons from "@phosphor-icons/react";

function getIcon(name: string) {
  const key = name as keyof typeof PhosphorIcons;
  return (PhosphorIcons[key] ?? PhosphorIcons.Question) as React.ElementType;
}

// Top of the wheel = index 3 in CSS circle coords, and rotation direction means
// the next "top" card comes from a higher index. Reverse the tail so order goes 01 → 02 → 03 → 04.
const orderedSteps = [...processSteps.slice(1).reverse(), processSteps[0]];

export function Process() {
  return (
    <section id="proces" className="dot-grid relative border-t border-border/40 py-24 md:pt-28 md:pb-0">
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
          baseRadius={640}
          mobileRadius={640}
          scrollDuration={2000}
          visiblePercentage={48}
          maxRotation={270}
        >
          {(hoveredIndex) =>
            orderedSteps.map((item, index) => {
              const isActive = hoveredIndex === index;
              const Icon = getIcon(item.icon);

              return (
                <div
                  key={item.number}
                  className={`
                    w-72 h-[26rem] sm:w-80 sm:h-[28rem]
                    rounded-2xl border p-7 flex flex-col gap-4 items-start
                    transition-all duration-500
                    ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground shadow-2xl"
                        : "bg-card border-border text-card-foreground opacity-55 scale-90"
                    }
                  `}
                >
                  {/* Header row: number + duration */}
                  <div className="w-full flex justify-between items-center">
                    <span
                      className={`font-mono text-xs tracking-widest ${
                        isActive ? "text-primary-foreground/60" : "text-muted-foreground/60"
                      }`}
                    >
                      {item.number}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-mono ${
                        isActive
                          ? "border-primary-foreground/30 text-primary-foreground/80"
                          : "border-border/70 bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <Clock size={10} weight="regular" />
                      {item.duration}
                    </span>
                  </div>

                  {/* Icon box */}
                  <div
                    className={`flex size-12 items-center justify-center rounded-md border ${
                      isActive
                        ? "border-primary-foreground/25 bg-primary-foreground/10"
                        : "border-border/60 bg-card/60"
                    }`}
                  >
                    <Icon
                      size={24}
                      weight="regular"
                      className={isActive ? "text-primary-foreground" : "text-accent"}
                    />
                  </div>

                  {/* Title + body + detail */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-2xl font-medium leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-primary-foreground/85" : "text-foreground/75"
                      }`}
                    >
                      {item.body}
                    </p>
                    <p
                      className={`text-xs leading-relaxed ${
                        isActive ? "text-primary-foreground/65" : "text-muted-foreground"
                      }`}
                    >
                      {item.detail}
                    </p>
                  </div>

                  {/* Spacer + separator */}
                  <div className="mt-auto w-full">
                    <div
                      className={`mb-3 h-px w-full ${
                        isActive ? "bg-primary-foreground/15" : "bg-border"
                      }`}
                    />

                    {/* Deliverables */}
                    <span
                      className={`font-mono text-[0.6rem] tracking-[0.18em] uppercase ${
                        isActive ? "text-primary-foreground/55" : "text-muted-foreground/70"
                      }`}
                    >
                      Dostajesz
                    </span>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {item.deliverables.map((d) => (
                        <li
                          key={d}
                          className={`flex items-start gap-2 text-xs leading-snug ${
                            isActive ? "text-primary-foreground/85" : "text-foreground/80"
                          }`}
                        >
                          <Check
                            className={`mt-[3px] size-3 shrink-0 ${
                              isActive ? "text-primary-foreground/70" : "text-accent"
                            }`}
                            strokeWidth={3}
                          />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
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
        Proces
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading max-w-2xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-6xl"
      >
        Jak pracuję.
      </motion.h2>
    </div>
  );
}

function ContentCard({ step, index }: { step: (typeof processSteps)[0]; index: number }) {
  const Icon = getIcon(step.icon);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.number}
        initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-border/40 bg-muted/20 p-8 md:p-10"
      >
        <span className="pointer-events-none absolute top-4 right-6 font-heading text-7xl font-semibold leading-none tracking-tight text-muted-foreground/10 select-none">
          {step.number}
        </span>

        <div className="flex flex-col gap-4">
          {/* Icon + duration */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-border/60 bg-card">
              <Icon size={20} weight="regular" className="text-accent" />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-2.5 py-1 text-[0.7rem] font-mono text-muted-foreground">
              <Clock size={11} weight="regular" />
              {step.duration}
            </span>
          </div>

          <h3 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
            {step.body}{" "}
            <span className="text-muted-foreground/40">{step.title}.</span>
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            {step.detail}
          </p>
        </div>

        {/* Separator + deliverables */}
        <div>
          <div className="mb-3 h-px w-full bg-border/50" />
          <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground/70">
            Dostajesz
          </span>
          <ul className="mt-2 flex flex-col gap-1.5">
            {step.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-foreground/85">
                <Check className="mt-[5px] size-3 shrink-0 text-accent" strokeWidth={3} />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Progress */}
        <div className="mt-auto flex items-center gap-1.5 pt-2">
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
