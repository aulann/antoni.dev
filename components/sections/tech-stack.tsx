import { techGroups } from "@/lib/content/tech";
import { TechGroupRow } from "@/components/tech-stack/tech-group";

export function TechStack() {
  return (
    <section id="stack" className="border-t border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-16 flex flex-col gap-3">
          <span className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase">
            Tech stack
          </span>
          <h2 className="font-heading max-w-2xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-6xl">
            Hardware, web, backend,
            <br />
            <span className="text-accent">AI i automatyzacje.</span>
          </h2>
          <p className="max-w-lg text-sm text-muted-foreground md:text-base">
            <span className="hidden md:inline">Najedź na ikonę</span>
            <span className="md:hidden">Dotknij ikonę</span>
            {" "}żeby zobaczyć poziom i opis. Każda to kawałek mojego warsztatu.
          </p>
        </div>

        <div>
          {techGroups.map((group) => (
            <TechGroupRow key={group.id} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
