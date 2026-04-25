"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Minus, Plus } from "@phosphor-icons/react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { services, type Service } from "@/lib/content/services";

function getIcon(name: string) {
  const key = name as keyof typeof PhosphorIcons;
  return (PhosphorIcons[key] ?? PhosphorIcons.Question) as React.ElementType;
}

function ServiceRow({
  service,
  index,
  open,
  onToggle,
  inView,
}: {
  service: Service;
  index: number;
  open: boolean;
  onToggle: () => void;
  inView: boolean;
}) {
  const Icon = getIcon(service.icon);
  const eyebrow = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative border-b border-border/40 last:border-0"
    >
      {/* Left accent line */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="accent"
            className="absolute top-0 bottom-0 left-0 w-0.5 bg-accent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            style={{ originY: "top" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <button
        onClick={onToggle}
        className="group flex w-full items-center gap-4 py-5 pl-4 text-left transition-colors md:py-7"
        aria-expanded={open}
      >
        <span className={`w-7 shrink-0 font-mono text-[0.72rem] tracking-[0.2em] transition-colors ${open ? "text-accent" : "text-muted-foreground/60"}`}>
          {eyebrow}
        </span>

        <span className={`font-heading flex-1 text-lg font-medium tracking-tight transition-colors md:text-2xl ${open ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"}`}>
          {service.title}
        </span>

        <span className="hidden shrink-0 rounded-full border border-border/70 bg-muted px-2.5 py-0.5 text-[0.65rem] font-medium tracking-widest text-muted-foreground uppercase sm:inline-block">
          {service.badge}
        </span>

        <span className={`shrink-0 transition-colors ${open ? "text-accent" : "text-muted-foreground/50 group-hover:text-muted-foreground"}`}>
          {open ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-4">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10">

                {/* Icon + description */}
                <div className="flex items-start gap-4 md:flex-1">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card">
                    <Icon size={20} weight="regular" className="text-accent" aria-hidden />
                  </div>
                  <p className="pt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                {/* Deliverables as pill tags */}
                <div className="flex flex-wrap gap-1.5 md:max-w-xs md:justify-end">
                  {service.deliverables.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-[0.73rem] text-muted-foreground"
                    >
                      {d}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [openId, setOpenId] = useState<string>("landing");

  return (
    <section id="uslugi" className="border-t border-border/40 py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div ref={ref} className="mb-16 flex flex-col gap-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
          >
            Usługi
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading max-w-2xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-6xl"
          >
            Co mogę
            <br />
            <span className="text-accent">dla ciebie zrobić?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="max-w-lg text-sm text-muted-foreground md:text-base"
          >
            Kliknij w usługę żeby zobaczyć szczegóły.
          </motion.p>
        </div>

        <div>
          {services.map((service, i) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={i}
              open={openId === service.id}
              onToggle={() => setOpenId((prev) => (prev === service.id ? "" : service.id))}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
