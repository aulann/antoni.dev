"use client";

import { useEffect, useRef, useCallback } from "react";

const COLS = 18;
const ROWS = 10;
const ATTRACT_RADIUS = 90;
const STRENGTH = 0.28;

export function MagneticDots({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const dotsRef = useRef<{ ox: number; oy: number; x: number; y: number; vx: number; vy: number }[]>([]);
  const rafRef = useRef<number>(0);
  const reduceMotion = useRef(false);

  const build = useCallback((w: number, h: number) => {
    const gapX = w / (COLS + 1);
    const gapY = h / (ROWS + 1);
    dotsRef.current = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const ox = gapX * (c + 1);
        const oy = gapY * (r + 1);
        dotsRef.current.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
      }
    }
  }, []);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cache dark mode — update via MutationObserver instead of querying DOM every frame
    const darkRef = { current: document.documentElement.classList.contains("dark") };
    const mo = new MutationObserver(() => {
      darkRef.current = document.documentElement.classList.contains("dark");
    });
    mo.observe(document.documentElement, { attributeFilter: ["class"] });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      build(rect.width, rect.height);
    };
    resize();

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.offsetX, y: e.offsetY };
    };
    const onLeave = () => { mouse.current = { x: -999, y: -999 }; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const IDLE_THRESHOLD = 0.05;

    const tick = () => {
      const dpr = devicePixelRatio;
      const dark = darkRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      let isIdle = true;

      for (const d of dotsRef.current) {
        if (!reduceMotion.current) {
          const dx = mx - d.ox;
          const dy = my - d.oy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < ATTRACT_RADIUS && dist > 0) {
            const force = (1 - dist / ATTRACT_RADIUS) * STRENGTH;
            d.vx += dx * force;
            d.vy += dy * force;
          }

          d.vx += (d.ox - d.x) * 0.1;
          d.vy += (d.oy - d.y) * 0.1;
          d.vx *= 0.72;
          d.vy *= 0.72;
          d.x += d.vx;
          d.y += d.vy;

          if (Math.abs(d.vx) > IDLE_THRESHOLD || Math.abs(d.vy) > IDLE_THRESHOLD) {
            isIdle = false;
          }
        }

        const pdx = mx - d.x;
        const pdy = my - d.y;
        const pd = Math.sqrt(pdx * pdx + pdy * pdy);
        const prox = Math.max(0, 1 - pd / ATTRACT_RADIUS);

        const radius = (1.5 + prox * 2.5) * dpr;
        const alpha = dark ? 0.1 + prox * 0.65 : 0.15 + prox * 0.6;

        ctx.beginPath();
        ctx.arc(d.x * dpr, d.y * dpr, radius, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(129,140,248,${alpha})`
          : `rgba(79,70,229,${alpha})`;
        ctx.fill();
      }

      // Pause loop when dots are settled and mouse is off-canvas
      const mouseOff = mx === -999;
      if (isIdle && mouseOff && !reduceMotion.current) {
        rafRef.current = 0;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    canvas.addEventListener("mousemove", startLoop);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousemove", startLoop);
      canvas.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      mo.disconnect();
    };
  }, [build]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
