"use client";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import React from "react";

export const Circle = ({ className, children, idx, ...rest }: any) => {
  return (
    <motion.div
      {...rest}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: idx * 0.1, duration: 0.2 }}
      className={twMerge(
        "absolute inset-0 left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-neutral-200",
        className
      )}
    />
  );
};

export const Radar = ({ className }: { className?: string }) => {
  const circles = new Array(8).fill(1);
  return (
    <div
      className={twMerge(
        "relative flex h-20 w-20 items-center justify-center rounded-full",
        className
      )}
    >
      <style>{`
        @keyframes radar-spin {
          from { transform: rotate(20deg); }
          to   { transform: rotate(380deg); }
        }
        .animate-radar-spin {
          animation: radar-spin 10s linear infinite;
        }
      `}</style>
      <div
        style={{ transformOrigin: "right center" }}
        className="animate-radar-spin absolute right-1/2 top-1/2 z-40 flex h-[5px] w-130 items-end justify-center overflow-hidden bg-transparent"
      >
        <div className="relative z-40 h-[1px] w-full bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>
      {circles.map((_, idx) => (
        <Circle
          style={{
            height: `${(idx + 1) * 6.5}rem`,
            width: `${(idx + 1) * 6.5}rem`,
            border: `1px solid rgba(71, 85, 105, ${1 - (idx + 1) * 0.1})`,
          }}
          key={`circle-${idx}`}
          idx={idx}
        />
      ))}
    </div>
  );
};

export const IconContainer = ({
  icon,
  text,
  delay,
  onClick,
  accent,
}: {
  icon?: React.ReactNode;
  text?: string;
  delay?: number;
  onClick?: () => void;
  accent?: string;
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: delay ?? 0 }}
      onClick={onClick}
      className="group relative z-50 flex flex-col items-center justify-center space-y-2 cursor-pointer"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 group-hover:scale-110"
        style={{
          background: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        {icon}
      </div>
      <div className="rounded-md px-2 py-1">
        <div className="text-center text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {text}
        </div>
      </div>
    </motion.button>
  );
};
