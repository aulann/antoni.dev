"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SiCisco, SiComptia } from "@icons-pack/react-simple-icons";
import { Network, Browser } from "@phosphor-icons/react";
import { aboutContent } from "@/lib/content/about";
import { CertBadge } from "@/components/ui/cert-badge";

export function About() {
  return (
    <section id="o-mnie" className="border-t border-border/40 py-24 md:pb-32 md:pt-12">
      <div className="mx-auto max-w-5xl px-5 md:px-8 flex flex-col gap-20 md:gap-28">
        <BioBlock />
        <TimelineBlock />
        <CertsBlock />
      </div>
    </section>
  );
}

function BioBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div ref={ref} className="flex flex-col items-center gap-6 text-center">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
      >
        O mnie
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-5xl"
      >
        Jestem Antoni.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.18 }}
        className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
      >
        {aboutContent.bio[0]}
      </motion.p>
    </div>
  );
}

function TimelineBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const items = aboutContent.timeline;
  const activeCount = items.filter((it) => it.year !== "2026").length;
  const activePercent = ((activeCount - 1) / (items.length - 1)) * 100;

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center text-xs tracking-[0.25em] text-muted-foreground/70 uppercase"
      >
        Historia
      </motion.p>

      {/* Desktop: horizontal — grid-cols-5 guarantees perfect alignment */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="hidden md:grid md:grid-cols-5 md:gap-y-3.5"
      >
        {/* Row 1 — year labels */}
        {items.map((item, i) => (
          <motion.span
            key={`label-${item.year}`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
            className="text-center text-[0.6rem] uppercase tracking-widest font-light text-muted-foreground"
          >
            {item.year}
          </motion.span>
        ))}

        {/* Row 2 — rail segments + dots */}
        {items.map((item, i) => {
          const isActive = i <= activeCount - 1;
          const leftActive = i > 0 && i <= activeCount - 1;
          const rightActive = i < activeCount - 1;
          return (
            <div key={`dot-${item.year}`} className="relative flex items-center justify-center">
              {/* left half rail */}
              {i > 0 && (
                <div
                  aria-hidden
                  className={`absolute right-1/2 left-0 top-1/2 h-0.5 -translate-y-1/2 ${leftActive ? "bg-foreground/40" : "bg-border/60"}`}
                />
              )}
              {/* right half rail */}
              {i < items.length - 1 && (
                <div
                  aria-hidden
                  className={`absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 ${rightActive ? "bg-foreground/40" : "bg-border/60"}`}
                />
              )}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="size-4.5 shrink-0 rounded-full ring-2 ring-black/5 z-10"
                style={{
                  backgroundColor: item.color,
                  opacity: isActive ? 0.65 : 0.35,
                }}
              />
            </div>
          );
        })}

        {/* Row 3 — titles */}
        {items.map((item, i) => (
          <motion.p
            key={`title-${item.year}`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            className="px-1 text-center text-xs font-normal text-foreground leading-snug"
          >
            {item.title}
          </motion.p>
        ))}
      </motion.div>

      {/* Mobile: vertical */}
      <div className="flex flex-col relative md:hidden">
        <div aria-hidden className="absolute left-2 top-2 bottom-2 w-0.5 rounded-full bg-border/60" />
        <div
          aria-hidden
          className="absolute left-2 top-2 w-0.5 rounded-full bg-foreground/50"
          style={{ height: `calc(${activePercent}% - 1rem)` }}
        />
        {items.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-5 pb-7 last:pb-0"
          >
            <div className="relative mt-1 shrink-0 z-10">
              <div
                className="size-4.5 rounded-full ring-2 ring-black/5"
                style={{
                  backgroundColor: item.color,
                  opacity: item.year === "2026" ? 0.35 : 0.65,
                }}
              />
            </div>
            <div className="flex flex-col gap-0.5 -mt-0.5">
              <span className="text-[0.6rem] uppercase tracking-widest font-light text-muted-foreground">
                {item.year}
              </span>
              <p className="text-sm font-normal text-foreground leading-snug">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CertsBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className="flex flex-col gap-10">
      {/* INF.02 — full width, prominent */}
      <div className="flex flex-col gap-3">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] text-muted-foreground/70 uppercase"
        >
          Certyfikaty
        </motion.p>
        {aboutContent.certifications.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <CertBadge
              code={cert.code}
              name={cert.name}
              issuer={cert.issuer}
              year={cert.year}
              icon={<Network size={22} weight="duotone" className="text-amber-500" />}
              large
            />
          </motion.div>
        ))}
      </div>

      {/* In-progress — 3 in a row on desktop */}
      <div className="flex flex-col gap-3">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs tracking-[0.25em] text-muted-foreground/70 uppercase"
        >
          Wkrótce
        </motion.p>
        <div className="grid gap-2 sm:grid-cols-3">
          {aboutContent.inProgressCerts.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.18 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 overflow-hidden rounded-xl border border-border/50 bg-muted/30 px-4 py-3 md:px-5 md:py-4"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/50 md:size-14">
                {cert.icon === "SiCisco" && <SiCisco size={28} className="text-[#1BA0D7]" />}
                {cert.icon === "SiComptia" && <SiComptia size={28} className="text-[#C8202F]" />}
                {cert.icon === "Browser" && <Browser size={26} weight="duotone" className="text-amber-500" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-heading text-sm font-semibold tracking-wide text-foreground md:text-base">
                  {cert.code}
                </span>
                <span className="text-xs text-muted-foreground md:text-sm">{cert.name}</span>
                <span className="text-[0.72rem] tracking-wide text-muted-foreground/50 uppercase md:text-xs">
                  {cert.issuer}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
