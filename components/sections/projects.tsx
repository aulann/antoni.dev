"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import Image from "next/image";
import { projects, capabilities, type Project } from "@/lib/content/projects";

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="projekty" className="border-t border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div ref={ref} className="mb-16 flex flex-col gap-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
          >
            03 · Projekty
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading max-w-2xl text-4xl leading-tight font-medium tracking-tight md:text-6xl"
          >
            Wybrane
            <br />
            <span className="text-accent">realizacje.</span>
          </motion.h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        <Capabilities inView={inView} />
      </div>
    </section>
  );
}

function MockUI({
  project,
  springX,
  springY,
}: {
  project: Project;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const x = useTransform(springY, [-5, 5], [-4, 4]);
  const y = useTransform(springX, [-5, 5], [4, -4]);

  return (
    <motion.div
      style={{ x, y }}
      className="absolute inset-6 rounded-xl border border-border/40 bg-background/40 p-4 backdrop-blur-sm"
      aria-hidden
    >
      <div className="mb-3 flex gap-1.5">
        <div className="size-2.5 rounded-full bg-border/80" />
        <div className="size-2.5 rounded-full bg-border/80" />
        <div className="size-2.5 rounded-full bg-border/80" />
      </div>
      <div className="space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-border/60" />
        <div className="h-2 w-1/2 rounded-full bg-border/40" />
        <div className="h-2 w-5/6 rounded-full bg-border/60" />
        <div className="h-2 w-2/5 rounded-full bg-border/30" />
      </div>
      <div
        className="mt-4 h-16 rounded-lg opacity-20"
        style={{ backgroundColor: project.accentColor }}
      />
    </motion.div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 24 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 24 });
  const layerY = useTransform(springX, [-5, 5], [6, -6]);
  const layerX = useTransform(springY, [-5, 5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 10);
    rotateX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setShowVideo(false);
    videoRef.current?.pause();
  };

  const handleMouseEnter = () => {
    if (!project.heroVideo) return;
    setShowVideo(true);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 3;
    v.play().catch(() => {});
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={() => router.push(`/projects/${project.slug}`)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm"
      data-cursor="interactive"
    >
      <div
        className="relative h-52 overflow-hidden"
        style={
          !project.image
            ? { background: `linear-gradient(135deg, ${project.accentColor}18 0%, ${project.accentColor}08 100%)` }
            : undefined
        }
      >
        {project.heroVideo && (
          <video
            ref={videoRef}
            src={project.heroVideo}
            muted
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            className="absolute inset-0 size-full object-cover object-top"
            style={{ opacity: showVideo && videoReady ? 1 : 0, transition: "opacity 0.4s ease" }}
            aria-hidden
          />
        )}

        {project.image ? (
          <motion.div
            style={{ x: layerX, y: layerY, opacity: showVideo && videoReady ? 0 : 1, transition: "opacity 0.4s ease" }}
            className="absolute inset-0"
          >
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-card/60 to-transparent" />
          </motion.div>
        ) : (
          <>
            <motion.div
              style={{ x: layerX, y: layerY }}
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <div
                className="size-32 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: project.accentColor }}
              />
            </motion.div>
            <MockUI project={project} springX={springX} springY={springY} />
          </>
        )}

        {project.liveUrl && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <span className="size-2 animate-pulse rounded-full bg-green-400" />
            live
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-heading text-lg font-medium tracking-tight">{project.name}</h3>
          <p className="text-sm text-accent">{project.tagline}</p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[0.72rem] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
        {project.liveUrl && (
          <div className="mt-auto pt-2">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-base font-medium text-accent transition-opacity hover:opacity-70"
            >
              Zobacz live
              <ArrowUpRight size={14} />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Capabilities({ inView }: { inView: boolean }) {
  return (
    <div className="mt-16 flex flex-col gap-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-xs tracking-[0.25em] text-muted-foreground/70 uppercase"
      >
        Co jeszcze potrafię zbudować
      </motion.p>
      <div className="flex flex-wrap gap-2.5">
        {capabilities.map((cap, i) => {
          const Icon = (PhosphorIcons[cap.icon as keyof typeof PhosphorIcons] ??
            PhosphorIcons.Question) as React.ElementType;
          return (
            <motion.div
              key={cap.label}
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
            >
              <Icon size={14} aria-hidden />
              {cap.label}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
