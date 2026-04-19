"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { CaretRight } from "@phosphor-icons/react";

type Line = { type: "input" | "output" | "error" | "success"; text: string };

const PROMPT = "tony@portfolio ~ %";

const ASCII_ART = [
  "       /\\       ",
  "      /  \\      ",
  "     / /\\ \\     ",
  "    / /  \\ \\    ",
  "   / / /\\ \\ \\   ",
  "  / / /  \\ \\ \\  ",
  " /_/ /    \\ \\_\\ ",
  " \\_\\/      \\/_/ ",
];

const SYSINFO = [
  { label: null,       value: "tony@portfolio",       variant: "accent" },
  { label: null,       value: "─".repeat(24),          variant: "sep"    },
  { label: "OS",       value: "AntoniOS 1.0.0",        variant: "normal"  },
  { label: "Host",     value: "vercel.app",            variant: "normal"  },
  { label: "Kernel",   value: "Next.js 16.2.4",        variant: "normal"  },
  { label: "Uptime",   value: "zawsze online",         variant: "normal"  },
  { label: "Packages", value: "47 (npm)",              variant: "normal"  },
  { label: "Shell",    value: "zsh 5.9",               variant: "normal"  },
  { label: "CPU",      value: "Full-Stack Dev",        variant: "normal"  },
  { label: "RAM",      value: "32 GB DDR5 + kawa",     variant: "normal"  },
  { label: "GPU",      value: "RTX 3080 Ti",           variant: "normal"  },
  { label: "Colors",   value: null,                    variant: "colors"  },
];

const COLOR_BLOCKS = [
  "bg-red-400",
  "bg-yellow-400",
  "bg-green-400",
  "bg-cyan-400",
  "bg-blue-400",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-400",
];

const RESPONSES: Record<string, Line[]> = {
  help: [
    { type: "output",  text: "Dostępne komendy:" },
    { type: "output",  text: "  about    → Kim jestem" },
    { type: "output",  text: "  stack    → Czego używam" },
    { type: "output",  text: "  projects → Moje projekty" },
    { type: "output",  text: "  contact  → Jak się skontaktować" },
    { type: "output",  text: "  easter   → 🤫" },
    { type: "output",  text: "  clear    → Czyści terminal" },
  ],
  about: [
    { type: "output",  text: "Antoni, 17 lat, pasjonat technologii." },
    { type: "output",  text: "Składam PC, konfiguruję sieci (INF.02 ✓, CCNA w drodze)," },
    { type: "output",  text: "buduję strony i aplikacje, automatyzuję z n8n, bawię się AI." },
    { type: "output",  text: "Technologia to nie praca — to zabawa i ciągłe uczenie się." },
  ],
  stack: [
    { type: "output",  text: "Frontend:   Next.js · React · TypeScript · Tailwind" },
    { type: "output",  text: "Backend:    Supabase · PostgreSQL · REST API" },
    { type: "output",  text: "AI:         Claude API · OpenAI · n8n workflows" },
    { type: "output",  text: "DevOps:     Linux · Docker · Git · Vercel" },
    { type: "output",  text: "Hardware:   PC building · CCNA networking · Cisco" },
  ],
  projects: [
    { type: "output",  text: "1. La Fontana Pizza Napoletana" },
    { type: "output",  text: "   Next.js 14 + Supabase + Vercel · Cert AVPN 739" },
    { type: "output",  text: "" },
    { type: "output",  text: "2. BD Design Portfolio" },
    { type: "output",  text: "   Next.js 14 + Supabase · portfolio grafika" },
  ],
  contact: [
    { type: "output",  text: "Email:   ulanantek11@gmail.com" },
    { type: "output",  text: "Lub użyj formularza kontaktowego na dole ↓" },
  ],
  easter: [
    { type: "success", text: "🎉 Znalazłeś easter egga!" },
    { type: "output",  text: "Skróty: / → ten terminal · ? → lista skrótów" },
    { type: "output",  text: "Konami: ↑↑↓↓←→←→BA → niespodzianka" },
    { type: "success", text: "Jesteś prawdziwym nerdem. Pozdrawiam :)" },
  ],
};

const INIT: Line[] = [
  { type: "output", text: 'Wpisz "help" aby zobaczyć komendy.' },
  { type: "output", text: "" },
];

function Neofetch() {
  const rows = Math.max(ASCII_ART.length, SYSINFO.length);

  return (
    <div className="mb-3 flex items-center gap-5">
      {/* ASCII art column — whitespace-pre preserves leading spaces */}
      <div className="shrink-0 select-none text-accent leading-[1.6] whitespace-pre">
        {ASCII_ART.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {/* Info column */}
      <div className="leading-[1.6] min-w-0">
        {Array.from({ length: rows }).map((_, i) => {
          const item = SYSINFO[i];
          if (!item) return <div key={i} />;

          if (item.variant === "accent") {
            return (
              <div key={i} className="font-semibold text-accent">
                {item.value}
              </div>
            );
          }
          if (item.variant === "sep") {
            return (
              <div key={i} className="text-muted-foreground/30">
                {item.value}
              </div>
            );
          }
          if (item.variant === "colors") {
            return (
              <div key={i} className="flex items-center gap-0.5 pt-0.5">
                {COLOR_BLOCKS.map((cls, j) => (
                  <span key={j} className={`inline-block h-3 w-5 rounded-sm ${cls}`} />
                ))}
              </div>
            );
          }
          return (
            <div key={i} className="flex gap-0">
              <span className="shrink-0 text-accent" style={{ minWidth: "9ch" }}>
                {item.label}
              </span>
              <span className="text-muted-foreground">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FakeTerminal({ className }: { className?: string }) {
  const [lines, setLines] = useState<Line[]>(INIT);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const run = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === "") return;

    if (trimmed === "clear") {
      setLines(INIT);
      setInput("");
      setHistIdx(-1);
      return;
    }

    const response = RESPONSES[trimmed];
    const outputLines: Line[] = response
      ? response
      : [{ type: "error", text: `zsh: command not found: ${trimmed}` }];

    setLines((prev) => [
      ...prev,
      { type: "input", text: `${PROMPT} ${cmd}` },
      ...outputLines,
      { type: "output", text: "" },
    ]);
    setHistory((prev) => [trimmed, ...prev].slice(0, 30));
    setHistIdx(-1);
    setInput("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      run(input);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : (history[idx] ?? ""));
    }
  };

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/60 font-mono text-xs ${className ?? ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border/30 bg-muted/30 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-red-400/70" />
          <span className="size-3 rounded-full bg-yellow-400/70" />
          <span className="size-3 rounded-full bg-green-400/70" />
        </div>
        <span className="ml-2 text-[0.65rem] tracking-wider text-muted-foreground/50">
          tony@portfolio — zsh
        </span>
      </div>

      {/* Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto px-5 py-4"
        style={{ maxHeight: 420 }}
      >
        <Neofetch />
        <div className="space-y-0.5">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.type === "input"
                  ? "text-foreground/80"
                  : line.type === "error"
                    ? "text-red-400"
                    : line.type === "success"
                      ? "text-green-400"
                      : "text-muted-foreground"
              }
            >
              {line.text || "\u00A0"}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex shrink-0 items-center gap-2 border-t border-border/30 px-5 py-3">
        <span className="shrink-0 text-accent">{PROMPT}</span>
        <input
          ref={inputRef}
          id="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/30"
          placeholder="help"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
        <CaretRight size={11} className="shrink-0 animate-pulse text-accent" />
      </div>
    </div>
  );
}
