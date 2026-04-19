"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import * as PhosphorIcons from "@phosphor-icons/react";
import type { TechGroup } from "@/lib/content/tech";
import { TechIcon } from "./tech-icon";

function getCategoryIcon(name: string) {
  const key = name as keyof typeof PhosphorIcons;
  return (PhosphorIcons[key] ?? PhosphorIcons.Question) as React.ElementType;
}

export function TechGroupRow({ group }: { group: TechGroup }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const CategoryIcon = getCategoryIcon(group.categoryIcon);

  return (
    <div
      ref={ref}
      className="border-b border-border/40 py-10 last:border-0 md:py-14"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-16">
        {/* Left: group info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3"
        >
          <span className="font-mono text-[0.72rem] tracking-[0.2em] text-accent">
            {group.eyebrow}
          </span>
          <h3 className="font-heading text-xl font-medium tracking-tight">
            {group.label}
          </h3>
          <CategoryIcon
            size={52}
            weight="thin"
            className="mt-2 text-foreground/60"
            aria-hidden
          />
        </motion.div>

        {/* Right: brand icons */}
        <div className="flex flex-wrap items-start gap-x-6 gap-y-10 pt-1 pl-4 lg:pl-8">
          {group.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.45,
                delay: 0.18 + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <TechIcon item={item} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
