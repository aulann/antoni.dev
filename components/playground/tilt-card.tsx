"use client";

import { useRef, useState, useCallback } from "react";
import { Code, Database, Robot, Cpu } from "@phosphor-icons/react";

const ICONS = [Code, Database, Robot, Cpu];

export function TiltCard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const rx = active ? ((mouse.y - 50) / 50) * -16 : 0;
  const ry = active ? ((mouse.x - 50) / 50) * 16 : 0;

  return (
    /* perspective on outer wrapper — no overflow-hidden here so 3D is visible */
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => { setActive(false); setMouse({ x: 50, y: 50 }); }}
      className={`relative flex items-center justify-center rounded-2xl ${className ?? ""}`}
      style={{ perspective: "700px" }}
    >
      {/* Background layer — own overflow-hidden so it clips cleanly */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border/40 bg-card/60">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: active ? 1 : 0,
            background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(79,70,229,0.18), transparent 58%)`,
          }}
        />
      </div>

      {/* Hints */}
      <span className="absolute bottom-3 right-4 z-10 select-none text-[0.6rem] tracking-wider text-muted-foreground/30 uppercase">
        Przesuń mysz →
      </span>
      <span className="absolute top-4 left-4 z-10 select-none text-[0.65rem] tracking-[0.2em] text-muted-foreground/50 uppercase font-medium">
        3D tilt
      </span>

      {/* Tilting content — transformStyle preserve-3d for child translateZ to work */}
      <div
        style={{
          transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
          transition: active ? "transform 0.08s ease-out" : "transform 0.5s ease-out",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative flex flex-col items-center gap-3 p-8"
      >
        <div
          className="font-heading text-4xl font-semibold tracking-tight"
          style={{ transform: "translateZ(0px)" }}
        >
          Antoni
        </div>
        <div
          className="text-base font-medium text-accent"
          style={{ transform: "translateZ(24px)" }}
        >
          Code is craft.
        </div>
        <div
          className="text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase"
          style={{ transform: "translateZ(40px)" }}
        >
          Frontend · Backend · AI · Hardware
        </div>
        <div
          className="mt-1 flex items-center gap-2.5"
          style={{ transform: "translateZ(56px)" }}
        >
          {ICONS.map((Icon, i) => (
            <div
              key={i}
              className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-background/80"
            >
              <Icon size={15} weight="duotone" className="text-accent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
