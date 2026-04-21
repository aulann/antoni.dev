import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HeroVideo } from "@/components/projects/hero-video";
import { FeatureVideo } from "@/components/projects/feature-video";
import { projects } from "@/lib/content/projects";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} · Case study`,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-5xl px-5 py-24 md:px-8 md:py-32">
      {/* Back */}
      <Link
        href="/#projekty"
        className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Wróć do projektów
      </Link>

      {/* Header */}
      <div className="mb-16 flex flex-col gap-5">
        <span
          className="inline-flex w-max items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-[0.75rem] tracking-[0.25em] text-muted-foreground uppercase"
          style={{ borderColor: `${project.accentColor}50` }}
        >
          Case study
        </span>
        <h1 className="font-heading text-4xl font-medium tracking-tight md:text-5xl">
          {project.name}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[0.75rem] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-base font-medium text-accent transition-opacity hover:opacity-70"
            >
              Zobacz live
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>

      {/* ── 1. Hero video ── */}
      {project.heroVideo ? (
        <div className="mb-16 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <HeroVideo src={project.heroVideo} label={`${project.name} — przegląd strony`} />
        </div>
      ) : project.image ? (
        <div className="mb-16 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <Image
            src={project.image}
            alt={project.name}
            width={1200}
            height={675}
            className="w-full object-cover"
            priority
          />
        </div>
      ) : null}

      {/* ── 2. Screenshots ── */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="mb-16">
          <h2 className="font-heading mb-6 text-xl font-medium tracking-tight">Screenshoty</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div
                key={src}
                className="group overflow-hidden rounded-xl border border-border/60 bg-card"
              >
                <Image
                  src={src}
                  alt={`${project.name} screenshot ${i + 1}`}
                  width={800}
                  height={500}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 3. Feature videos with descriptions ── */}
      {project.featureVideos && project.featureVideos.length > 0 && (
        <section>
          <h2 className="font-heading mb-8 text-xl font-medium tracking-tight">
            Elementy interaktywne
          </h2>
          <div className="flex flex-col gap-12">
            {project.featureVideos.map((video) => (
              <div key={video.src} className="flex flex-col gap-4">
                <div className={`overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm ${video.portrait ? "mx-auto max-w-xs aspect-9/16" : ""}`}>
                  <FeatureVideo src={video.src} label={video.label} portrait={video.portrait} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium text-foreground">{video.label}</h3>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Placeholder if nothing yet */}
      {!project.heroVideo && !project.gallery && !project.featureVideos && (
        <div className="rounded-2xl border border-border/60 bg-card/60 p-8 text-center text-sm text-muted-foreground">
          Szczegółowy opis projektu będzie dostępny wkrótce.
        </div>
      )}
    </main>
  );
}
