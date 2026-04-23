"use client";

import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Certificate, SealCheck } from "@phosphor-icons/react";
import Image from "next/image";

interface CertBadgeProps {
  code: string;
  name: string;
  issuer: string;
  year: string;
  logo?: string;
  icon?: ReactNode;
  large?: boolean;
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

export function CertBadge({ code, name, issuer, year, logo, icon, large }: CertBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [matrix, setMatrix] = useState(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState(identityMatrix);
  const [timeoutDone, setTimeoutDone] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }, []);

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
    setIsHovered(true);
    const m = getMatrix(e.clientX, e.clientY);
    setMatrix(getOpposite(m, e.clientY, true));
    setTimeoutDone(false);
    setTimeout(() => setTimeoutDone(true), 200);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (timeoutDone) setCurrentMatrix(getMatrix(e.clientX, e.clientY));
  };

  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    const opp = getOpposite(matrix, e.clientY);
    setCurrentMatrix(opp);
    setTimeout(() => setCurrentMatrix(identityMatrix), 200);
    leaveTO.current[0] = setTimeout(() => setIsHovered(false), 300);
  };

  useEffect(() => {
    if (timeoutDone) setMatrix(currentMatrix);
  }, [currentMatrix, timeoutDone]);

  const cardContent = (
    <div className={`relative flex items-center ${large ? "gap-5 py-2" : "gap-3"}`}>
      <div className={`flex shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 overflow-hidden ${large ? "size-14" : "size-9"}`}>
        {logo ? (
          <Image src={logo} alt={code} width={large ? 56 : 36} height={large ? 56 : 36} className="size-full object-cover" unoptimized />
        ) : icon ? (
          icon
        ) : (
          <Certificate size={large ? 26 : 18} weight="duotone" className="text-amber-500" />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={`font-heading font-semibold tracking-wide text-foreground ${large ? "text-xl md:text-2xl" : "text-sm md:text-base"}`}>
            {code}
          </span>
          <SealCheck size={large ? 16 : 13} weight="fill" className="shrink-0 text-amber-500" />
          <span className="text-xs text-muted-foreground/60">{year}</span>
        </div>
        <span className={`text-muted-foreground ${large ? "text-sm md:text-base" : "text-xs md:text-sm"}`}>{name}</span>
        <span className={`tracking-wide text-muted-foreground/50 uppercase ${large ? "text-xs" : "text-[0.7rem] md:text-xs"}`}>
          {issuer}
        </span>
      </div>
    </div>
  );

  const cardClass = `relative w-full overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/5 ${large ? "px-6 py-5" : "px-4 py-3"}`;

  if (isTouch || large) {
    return (
      <div className={cardClass}>
        {cardContent}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: "700px" }}
      className="w-full"
    >
      <div
        style={{
          transform: `matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: "transform 200ms ease-out",
        }}
        className={cardClass}
      >
        {/* Hover glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, hsl(45 100% 60% / 0.12) 0%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 300ms ease-out",
          }}
        />

        <div className="relative">
          {cardContent}
        </div>
      </div>
    </div>
  );
}
