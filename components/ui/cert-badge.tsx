"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { Certificate, SealCheck } from "@phosphor-icons/react";

interface CertBadgeProps {
  code: string;
  name: string;
  issuer: string;
  year: string;
}

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1";

const maxRotate = 0.22;
const minRotate = -0.22;
const maxScale = 1;
const minScale = 0.97;

const overlayAnimations = [...Array(10).keys()]
  .map(
    (e) => `
  @keyframes certOverlay${e + 1} {
    0%   { transform: rotate(${e * 10}deg); }
    50%  { transform: rotate(${(e + 1) * 10}deg); }
    100% { transform: rotate(${e * 10}deg); }
  }`,
  )
  .join(" ");

const OVERLAY_COLORS = [
  "hsl(45, 100%, 60%)",
  "hsl(30, 100%, 55%)",
  "hsl(55, 100%, 55%)",
  "hsl(20, 100%, 60%)",
  "hsl(233, 85%, 60%)",
  "hsl(271, 85%, 55%)",
  "hsl(300, 40%, 45%)",
  "transparent",
  "transparent",
  "white",
];

export function CertBadge({ code, name, issuer, year }: CertBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [firstOverlay, setFirstOverlay] = useState(0);
  const [matrix, setMatrix] = useState(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState(identityMatrix);
  const [disableInOut, setDisableInOut] = useState(true);
  const [disableAnim, setDisableAnim] = useState(false);
  const [timeoutDone, setTimeoutDone] = useState(false);

  const enterTO = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTO = useRef<ReturnType<typeof setTimeout>[]>([]);

  const getDims = () => {
    const r = ref.current?.getBoundingClientRect();
    return { left: r?.left ?? 0, right: r?.right ?? 0, top: r?.top ?? 0, bottom: r?.bottom ?? 0 };
  };

  const getMatrix = (cx: number, cy: number) => {
    const { left, right, top, bottom } = getDims();
    const xC = (left + right) / 2;
    const yC = (top + bottom) / 2;
    const scale = [
      maxScale - (maxScale - minScale) * Math.abs(xC - cx) / (xC - left),
      maxScale - (maxScale - minScale) * Math.abs(yC - cy) / (yC - top),
      maxScale - (maxScale - minScale) * (Math.abs(xC - cx) + Math.abs(yC - cy)) / (xC - left + yC - top),
    ];
    const r = {
      x1: 0.25 * ((yC - cy) / yC - (xC - cx) / xC),
      x2: maxRotate - (maxRotate - minRotate) * Math.abs(right - cx) / (right - left),
      y2: maxRotate - (maxRotate - minRotate) * (top - cy) / (top - bottom),
      z0: -(maxRotate - (maxRotate - minRotate) * Math.abs(right - cx) / (right - left)),
      z1: 0.2 - (0.2 + 0.6) * (top - cy) / (top - bottom),
    };
    return `${scale[0]}, 0, ${r.z0}, 0, ${r.x1}, ${scale[1]}, ${r.z1}, 0, ${r.x2}, ${r.y2}, ${scale[2]}, 0, 0, 0, 0, 1`;
  };

  const getOpposite = (m: string, cy: number, enter?: boolean) => {
    const { top, bottom } = getDims();
    const oY = bottom - cy + top;
    const weak = enter ? 0.7 : 4;
    const mul = enter ? -1 : 1;
    return m.split(", ").map((v, i) => {
      if (i === 2 || i === 4 || i === 8) return String(-parseFloat(v) * mul / weak);
      if (i === 0 || i === 5 || i === 10) return "1";
      if (i === 6) return String(mul * (maxRotate - (maxRotate - minRotate) * (top - oY) / (top - bottom)) / weak);
      if (i === 9) return String((maxRotate - (maxRotate - minRotate) * (top - oY) / (top - bottom)) / weak);
      return v;
    }).join(", ");
  };

  const onMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    leaveTO.current.forEach(clearTimeout);
    setDisableAnim(true);
    const { left, right, top, bottom } = getDims();
    const xC = (left + right) / 2;
    const yC = (top + bottom) / 2;
    setDisableInOut(false);
    enterTO.current = setTimeout(() => setDisableInOut(true), 350);
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setFirstOverlay((Math.abs(xC - e.clientX) + Math.abs(yC - e.clientY)) / 1.5),
      ),
    );
    const m = getMatrix(e.clientX, e.clientY);
    setMatrix(getOpposite(m, e.clientY, true));
    setTimeoutDone(false);
    setTimeout(() => setTimeoutDone(true), 200);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, right, top, bottom } = getDims();
    const xC = (left + right) / 2;
    const yC = (top + bottom) / 2;
    setTimeout(() => setFirstOverlay((Math.abs(xC - e.clientX) + Math.abs(yC - e.clientY)) / 1.5), 150);
    if (timeoutDone) setCurrentMatrix(getMatrix(e.clientX, e.clientY));
  };

  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (enterTO.current) clearTimeout(enterTO.current);
    const opp = getOpposite(matrix, e.clientY);
    setCurrentMatrix(opp);
    setTimeout(() => setCurrentMatrix(identityMatrix), 200);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setDisableInOut(false);
        leaveTO.current[0] = setTimeout(() => setFirstOverlay(-firstOverlay / 4), 150);
        leaveTO.current[1] = setTimeout(() => setFirstOverlay(0), 300);
        leaveTO.current[2] = setTimeout(() => {
          setDisableAnim(false);
          setDisableInOut(true);
        }, 500);
      }),
    );
  };

  useEffect(() => {
    if (timeoutDone) setMatrix(currentMatrix);
  }, [currentMatrix, timeoutDone]);

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: "700px" }}
    >
      <style>{overlayAnimations}</style>
      <div
        style={{
          transform: `matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: "transform 200ms ease-out",
        }}
        className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3"
      >
        {/* Holographic overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
          style={{ mixBlendMode: "overlay" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="certBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              </filter>
            </defs>
            {OVERLAY_COLORS.map((color, i) => (
              <g
                key={i}
                style={{
                  transform: `rotate(${firstOverlay + i * 10}deg)`,
                  transformOrigin: "center center",
                  transition: !disableInOut ? "transform 200ms ease-out" : "none",
                  animation: disableAnim ? "none" : `certOverlay${i + 1} 5s infinite`,
                  willChange: "transform",
                }}
              >
                <polygon
                  points="0,0 100%,100% 100%,0 0,100%"
                  fill={color}
                  filter="url(#certBlur)"
                  opacity="0.55"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Card content */}
        <div className="relative flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10">
            <Certificate size={20} weight="duotone" className="text-amber-500" />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-semibold tracking-wide text-foreground">
                {code}
              </span>
              <SealCheck size={14} weight="fill" className="shrink-0 text-amber-500" />
              <span className="text-xs text-muted-foreground/60">{year}</span>
            </div>
            <span className="truncate text-xs text-muted-foreground">{name}</span>
            <span className="text-[0.72rem] tracking-wide text-muted-foreground/50 uppercase">
              {issuer}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
