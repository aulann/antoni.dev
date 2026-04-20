"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SiCisco, SiComptia } from "@icons-pack/react-simple-icons";
import { aboutContent } from "@/lib/content/about";
import { CertBadge } from "@/components/ui/cert-badge";

export function About() {
  return (
    <section id="o-mnie" className="border-t border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <BioColumn />
          <ChipsColumn />
        </div>
      </div>
    </section>
  );
}

function BioColumn() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div ref={ref} className="flex flex-col gap-8">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
      >
        01 · O mnie
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-5xl"
      >
        Cześć,
        <br />
        jestem Antoni.
      </motion.h2>

      <div className="flex flex-col gap-4">
        {aboutContent.bio.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 + i * 0.1 }}
            className="text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {para}
          </motion.p>
        ))}
      </div>

      {/* Certifications */}
      <div className="flex flex-col gap-3">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xs tracking-[0.25em] text-muted-foreground/70 uppercase"
        >
          Certyfikaty
        </motion.p>
        <div className="flex flex-col gap-2">
          {aboutContent.certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.48 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <CertBadge
                code={cert.code}
                name={cert.name}
                issuer={cert.issuer}
                year={cert.year}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* In-progress certs */}
      <div className="flex flex-col gap-3">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-xs tracking-[0.25em] text-muted-foreground/70 uppercase"
        >
          W trakcie
        </motion.p>
        <div className="flex flex-col gap-2">
          {aboutContent.inProgressCerts.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.62 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/30 px-4 py-3"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/50">
                {cert.icon === "SiCisco" && <SiCisco size={28} className="text-[#1BA0D7]" />}
                {cert.icon === "SiComptia" && <SiComptia size={28} className="text-[#C8202F]" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading text-sm font-semibold tracking-wide text-foreground">
                    {cert.code}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 text-[0.7rem] font-medium tracking-widest text-accent uppercase">
                    w trakcie
                  </span>
                </div>
                <span className="truncate text-xs text-muted-foreground">{cert.name}</span>
                <span className="text-[0.72rem] tracking-wide text-muted-foreground/50 uppercase">{cert.issuer}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChipsColumn() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div ref={ref} className="flex flex-col gap-6 lg:pt-20">
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xs tracking-[0.25em] text-muted-foreground/70 uppercase"
      >
        Kilka ciekawostek
      </motion.p>
      <div className="flex flex-wrap gap-2.5">
        {aboutContent.chips.map((chip, i) => (
          <Chip key={chip.label} chip={chip} index={i} inView={inView} />
        ))}
      </div>
    </div>
  );
}

function Chip({
  chip,
  index,
  inView,
}: {
  chip: (typeof aboutContent.chips)[0];
  index: number;
  inView: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onTouchStart = (e: TouchEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [open]);

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.45,
        delay: 0.2 + index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex cursor-default items-center rounded-full border border-border/70 bg-muted/60 px-4 py-1.5 text-sm text-foreground transition-colors hover:border-accent/60 hover:bg-muted hover:text-accent"
        aria-describedby={open ? `chip-tip-${index}` : undefined}
        aria-expanded={open}
      >
        {chip.label}
      </button>

      <motion.div
        id={`chip-tip-${index}`}
        role="tooltip"
        initial={false}
        animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.96 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-[0.75rem] leading-snug text-muted-foreground shadow-md"
      >
        {chip.tooltip}
        <span
          aria-hidden
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border/60"
        />
      </motion.div>
    </motion.div>
  );
}
