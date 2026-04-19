"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import * as Ph from "@phosphor-icons/react";
import { services } from "@/lib/content/services";
import { Radar, IconContainer } from "@/components/ui/radar-effect";

const ACCENT: Record<string, string> = {
  landing:     "#38bdf8",
  webapp:      "#818cf8",
  portfolio:   "#c084fc",
  consulting:  "#34d399",
  hardware:    "#fb923c",
  maintenance: "#94a3b8",
};

const COL_SPAN: Record<string, string> = {
  landing:     "md:col-span-2",
  maintenance: "md:col-span-3",
};

function rgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ── Radar tile view ────────────────────────────────────────────────
function RadarServiceIcon({ id, delay, onSelect }: { id: string; delay: number; onSelect: (id: string) => void }) {
  const svc = services.find((s) => s.id === id)!;
  const color = ACCENT[id] ?? "#38bdf8";
  const Icon = (Ph[svc.icon as keyof typeof Ph] ?? Ph.Question) as React.ElementType;
  return (
    <IconContainer
      text={svc.title.split(" ")[0]}
      delay={delay}
      onClick={() => onSelect(id)}
      accent={color}
      icon={<Icon size={22} weight="duotone" style={{ color }} />}
    />
  );
}

// Absolute positions (% from top/left of container) — matching screenshot scatter
const POSITIONS: Record<string, { top: string; left?: string; right?: string }> = {
  landing:     { top: "22%", left: "8%" },
  webapp:      { top: "4%",  left: "41%" },
  portfolio:   { top: "22%", right: "8%" },
  consulting:  { top: "50%", left: "18%" },
  hardware:    { top: "50%", right: "18%" },
  maintenance: { top: "68%", left: "40%" },
};

function RadarView({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="relative h-120 w-full overflow-hidden">
      {services.map((svc, i) => {
        const pos = POSITIONS[svc.id];
        const color = ACCENT[svc.id] ?? "#38bdf8";
        const Icon = (Ph[svc.icon as keyof typeof Ph] ?? Ph.Question) as React.ElementType;
        return (
          <div
            key={svc.id}
            className="absolute"
            style={{ top: pos.top, left: pos.left, right: pos.right }}
          >
            <IconContainer
              text={svc.title.split(" ")[0]}
              delay={i * 0.1}
              onClick={() => onSelect(svc.id)}
              accent={color}
              icon={<Icon size={22} weight="duotone" style={{ color }} />}
            />
          </div>
        );
      })}

      <Radar className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-30" />
      <div className="absolute bottom-0 z-41 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

// ── Detail card ────────────────────────────────────────────────────
function ServiceCard({
  service,
  idx,
  selected,
  onToggle,
}: {
  service: (typeof services)[0];
  idx: number;
  selected: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const color = ACCENT[service.id] ?? "#38bdf8";
  const isFeatured = service.id === "landing";
  const isWide = service.id === "maintenance";
  const Icon = (Ph[service.icon as keyof typeof Ph] ?? Ph.Question) as React.ElementType;
  const num = String(idx + 1).padStart(2, "0");

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  const tilt = hovered && !isWide
    ? `perspective(700px) rotateX(${((mouse.y - 50) / 50) * -5}deg) rotateY(${((mouse.x - 50) / 50) * 5}deg) scale(1.015)`
    : "perspective(700px) rotateX(0) rotateY(0) scale(1)";

  return (
    <div
      ref={ref}
      onClick={onToggle}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMouse({ x: 50, y: 50 }); }}
      className={`relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card/60 ${COL_SPAN[service.id] ?? ""}`}
      style={{
        transform: tilt,
        transition: "transform 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        borderColor: selected ? color : hovered ? rgba(color, 0.45) : "hsl(var(--border) / 0.4)",
        boxShadow: selected ? `0 0 0 1px ${rgba(color, 0.25)}, 0 8px 30px ${rgba(color, 0.1)}` : "none",
      }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: rgba(color, 0.03) }} />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, ${rgba(color, 0.16)}, transparent 58%)`,
        }}
      />

      <div className={`relative flex flex-1 flex-col gap-4 p-6 ${isFeatured ? "md:p-8" : ""} ${isWide ? "md:flex-row md:flex-wrap md:items-start md:gap-6 md:p-7" : ""}`}>
        <div className={`flex items-start justify-between ${isWide ? "md:w-full" : ""}`}>
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border"
            style={{ borderColor: rgba(color, 0.3), background: rgba(color, 0.1) }}
          >
            <Icon size={18} weight={hovered || selected ? "fill" : "duotone"} style={{ color }} />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-[0.15em] uppercase"
              style={{ color, background: rgba(color, 0.1), border: `1px solid ${rgba(color, 0.25)}` }}
            >
              {service.badge}
            </span>
            <motion.div
              className="flex size-5 items-center justify-center rounded-full border-2"
              animate={{
                borderColor: selected ? color : rgba(color, 0.35),
                background: selected ? color : "transparent",
              }}
              transition={{ duration: 0.18 }}
            >
              <AnimatePresence>
                {selected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <Ph.Check size={10} weight="bold" className="text-black" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className={`flex flex-col gap-1.5 ${isWide ? "md:flex-1 md:min-w-45" : ""}`}>
          <h3 className="font-heading text-lg font-medium leading-snug tracking-tight">
            {service.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </div>

        {isFeatured && (
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {service.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <Ph.CheckCircle size={13} weight="fill" className="mt-0.5 shrink-0" style={{ color }} />
                <span className="text-xs text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        )}

        {isWide && (
          <ul className="grid w-full grid-cols-2 gap-1.5 md:grid-cols-4">
            {service.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <Ph.CheckCircle size={13} weight="fill" className="mt-0.5 shrink-0" style={{ color }} />
                <span className="text-xs text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        )}

        {!isFeatured && !isWide && (
          <ul className="mt-auto grid gap-1.5">
            {service.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <Ph.CheckCircle size={13} weight="fill" className="mt-0.5 shrink-0" style={{ color }} />
                <span className="text-xs text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <span className="pointer-events-none absolute bottom-3 right-5 select-none font-heading text-8xl font-black leading-none opacity-[0.035]">
        {num}
      </span>
    </div>
  );
}

// ── Brief bar ──────────────────────────────────────────────────────
function BriefBar({ selected, onClear }: { selected: string[]; onClear: () => void }) {
  const picked = services.filter((s) => selected.includes(s.id));
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 48, opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="whitespace-nowrap text-xs text-muted-foreground">Wybrałeś:</span>
          {picked.map((s) => (
            <span
              key={s.id}
              className="whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                color: ACCENT[s.id],
                background: rgba(ACCENT[s.id], 0.12),
                border: `1px solid ${rgba(ACCENT[s.id], 0.3)}`,
              }}
            >
              {s.title.split(" ")[0]}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 border-l border-border/40 pl-3">
          <a
            href="#kontakt"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-80"
          >
            Napisz do mnie <Ph.ArrowRight size={12} weight="bold" />
          </a>
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <Ph.X size={14} weight="bold" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main section ───────────────────────────────────────────────────
export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [selected, setSelected] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggle = useCallback(
    (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]),
    [],
  );

  const activeService = services.find((s) => s.id === activeId);
  const activeIdx = services.findIndex((s) => s.id === activeId);

  return (
    <section id="uslugi" className="border-t border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">

        <div ref={ref} className="mb-16 flex flex-col gap-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
          >
            04 · Usługi
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading max-w-2xl text-4xl leading-tight font-medium tracking-tight md:text-6xl"
          >
            Co dla Ciebie
            <br />
            <span className="text-accent">zbuduję.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm text-muted-foreground"
          >
            {activeId ? (
              <button
                onClick={() => setActiveId(null)}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Ph.ArrowLeft size={13} weight="bold" />
                Wróć do usług
              </button>
            ) : (
              "Kliknij usługę, aby zobaczyć szczegóły →"
            )}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {activeId && activeService ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 gap-3 md:grid-cols-3"
            >
              <ServiceCard
                service={activeService}
                idx={activeIdx}
                selected={selected.includes(activeId)}
                onToggle={() => toggle(activeId)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="radar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <RadarView onSelect={setActiveId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected.length > 0 && (
          <BriefBar selected={selected} onClear={() => setSelected([])} />
        )}
      </AnimatePresence>
    </section>
  );
}
