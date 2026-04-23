"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useInView } from "motion/react";
import { toast } from "sonner";
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  PaperPlaneTilt,
  ArrowRight,
} from "@phosphor-icons/react";

const schema = z.object({
  name: z.string().min(2, "Imię musi mieć minimum 2 znaki"),
  email: z.string().email("Podaj poprawny adres e-mail"),
  message: z.string().min(10, "Wiadomość musi mieć minimum 10 znaków"),
});

type FormData = z.infer<typeof schema>;

const channels = [
  {
    label: "E-mail",
    value: "ulanantek11@gmail.com",
    href: "mailto:ulanantek11@gmail.com",
    icon: EnvelopeSimple,
  },
  {
    label: "GitHub",
    value: "github.com",
    href: "#",
    icon: GithubLogo,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com",
    href: "#",
    icon: LinkedinLogo,
  },
];

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio.");
      return;
    }

    toast.success("Dzięki! Odpiszę w ciągu 24h.");
    reset();
  };

  return (
    <section id="kontakt" className="border-t border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div ref={ref} className="grid gap-16 lg:grid-cols-2 lg:gap-24 lg:items-stretch">

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-flex w-max items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
              >
                Kontakt
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-6xl"
              >
                Porozmawiajmy.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.16 }}
                className="text-sm leading-relaxed text-muted-foreground md:text-base"
              >
                Masz projekt, pytanie albo po prostu chcesz pogadać o technologii?
                Odpisuję zazwyczaj tego samego dnia.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="flex flex-col gap-3"
            >
              {channels.map(({ label, value, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:border-accent/40 hover:bg-accent/5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/50 transition-colors group-hover:border-accent/40 group-hover:bg-accent/10">
                    <Icon size={17} weight="duotone" className="text-muted-foreground transition-colors group-hover:text-accent" />
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">{label}</span>
                    <span className="truncate text-sm font-medium text-foreground">{value}</span>
                  </div>
                  <ArrowRight size={14} className="ml-auto shrink-0 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 lg:h-full"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Imię" error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="Antoni"
                  className={inputCls(!!errors.name)}
                />
              </Field>
              <Field label="E-mail" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="ty@example.com"
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide text-foreground/70 uppercase">
                Wiadomość
              </label>
              <textarea
                {...register("message")}
                placeholder="Cześć, mam projekt..."
                className={inputCls(!!errors.message) + " h-full resize-none"}
              />
              {errors.message && (
                <p className="text-xs text-red-500">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
            >
              {isSubmitting ? "Wysyłanie…" : "Wyślij wiadomość"}
              <PaperPlaneTilt
                size={16}
                weight="fill"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </motion.form>

        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium tracking-wide text-foreground/70 uppercase">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-lg border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50",
    "outline-none transition-colors focus:border-accent/60 focus:bg-muted/50",
    hasError ? "border-red-500/60" : "border-border/50",
  ].join(" ");
}
