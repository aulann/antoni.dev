import type { ReactNode } from "react";

type PlaceholderProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function SectionPlaceholder({
  id,
  eyebrow,
  title,
  description,
  children,
}: PlaceholderProps) {
  return (
    <section
      id={id}
      className="relative border-t border-border/40 py-24 md:py-32"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:px-8">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase">
            {eyebrow}
          </span>
          <h2 className="font-heading max-w-2xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-6xl">
            {title}
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
        {children && <div className="pt-6">{children}</div>}
        <div className="font-mono text-[0.7rem] tracking-wider text-muted-foreground/60 uppercase">
          Wkrótce w kolejnej iteracji →
        </div>
      </div>
    </section>
  );
}
