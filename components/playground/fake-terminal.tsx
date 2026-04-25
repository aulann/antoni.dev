"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { CaretRight } from "@phosphor-icons/react";

type Line = { type: "input" | "output" | "error" | "success" | "accent" | "bold"; text: string };

const PROMPT = "antoni@portfolio ~ %";

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
  { label: null,       value: "antoni@portfolio",       variant: "accent" },
  { label: null,       value: "─".repeat(24),          variant: "sep"    },
  { label: "OS",       value: "AntoniOS 1.0.0",        variant: "normal"  },
  { label: "Host",     value: "vercel.app",            variant: "normal"  },
  { label: "Kernel",   value: "Next.js 16.2.4",        variant: "normal"  },
  { label: "Uptime",   value: "online",                variant: "normal"  },
  { label: "Packages", value: "47 (npm)",              variant: "normal"  },
  { label: "Shell",    value: "zsh 5.9",               variant: "normal"  },
  { label: "CPU",      value: "Full-Stack Dev",        variant: "normal"  },
  { label: "RAM",      value: "32 GB",                 variant: "normal"  },
  { label: "GPU",      value: "RTX 4070 Super",        variant: "normal"  },
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
    { type: "output",  text: "" },
    { type: "output",  text: "  about     → kim jestem" },
    { type: "output",  text: "  stack     → czego używam" },
    { type: "output",  text: "  projects  → moje projekty" },
    { type: "output",  text: "  contact   → jak się skontaktować" },
    { type: "output",  text: "" },
    { type: "output",  text: "  age       → mój wiek" },
    { type: "output",  text: "  date      → aktualna data" },
    { type: "output",  text: "" },
    { type: "output",  text: "  clear     → czyść terminal" },
    { type: "output",  text: "" },
    { type: "output",  text: "Tip: Tab uzupełnia komendę, ↑/↓ przewija historię." },
  ],
  about: [
    { type: "output",  text: "Od dziecka interesują mnie komputery i to, jak działają różne rzeczy —" },
    { type: "output",  text: "zacząłem od oglądania YouTube'a, oglądałem budowanie komputerów i gierki," },
    { type: "output",  text: "od razu wiedziałem że chcę robić to samo. Z czasem moja ciekawość weszła" },
    { type: "output",  text: "w praktykę — zacząłem rozumieć jak działa system od środka, sieci, kod." },
    { type: "output",  text: "Rok temu zdałem mój pierwszy egzamin INF.02 na 100% z części praktycznej." },
    { type: "output",  text: "Dziś najbardziej kręci mnie cyberbezpieczeństwo i AI, mam wiele zajawek" },
    { type: "output",  text: "z informatyki, próbuję wszystkiego i tego co najbardziej mnie interesuje —" },
    { type: "output",  text: "szybko się uczę i wszystko jest dla mnie ciekawe." },
  ],
  stack: [
    { type: "bold",    text: "Hardware:   Składanie PC · Sieci LAN · Okablowanie · Serwery" },
    { type: "bold",    text: "Frontend:   HTML/CSS · JavaScript · React/Next.js · Tailwind · C++ · Python" },
    { type: "bold",    text: "Backend:    SQL · Supabase · API Integration" },
    { type: "bold",    text: "AI:         n8n · Prompt Engineering · Claude/OpenAI · Lokalne modele" },
    { type: "bold",    text: "DevOps:     VS Code · Git · Linux · Vercel" },
  ],
  projects: [
    { type: "bold",    text: "1. La Fontana Pizza Napoletana" },
    { type: "output",  text: "   Next.js 14 + Tailwind · pizzeria z Tychów (in progress)" },
    { type: "output",  text: "" },
    { type: "bold",    text: "2. BD Design" },
    { type: "output",  text: "   Next.js 14 + GSAP · portfolio grafika" },
  ],
  age: [
    { type: "output",  text: "17 lat, zaniedługo 18." },
  ],
};

const COMMANDS = [
  "help", "about", "stack", "projects", "contact",
  "age", "date",
  "clear",
];

const INIT: Line[] = [
  { type: "output", text: 'Wpisz "help" aby zobaczyć komendy.' },
  { type: "output", text: "" },
];

function levenshtein(a: string, b: string): number {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function suggest(cmd: string): string | null {
  let best: string | null = null;
  let bestDist = Infinity;
  for (const c of COMMANDS) {
    const d = levenshtein(cmd, c);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return bestDist <= 2 ? best : null;
}

function Neofetch() {
  const rows = Math.max(ASCII_ART.length, SYSINFO.length);

  return (
    <div className="mb-3 flex items-center gap-5">
      <div className="shrink-0 select-none text-accent leading-[1.6] whitespace-pre">
        {ASCII_ART.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

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

  const resolve = (cmd: string): Line[] => {
    const [head] = cmd.split(/\s+/);

    if (head === "date") {
      return [{ type: "output", text: new Date().toLocaleString("pl-PL") }];
    }
    const response = RESPONSES[cmd];
    if (response) return response;

    const did = suggest(cmd);
    return [
      { type: "error", text: `Nie znaleziono komendy: ${cmd}` },
      ...(did ? [{ type: "output" as const, text: `Może chodziło o: ${did}?` }] : []),
    ];
  };

  const run = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === "") return;

    if (trimmed === "clear") {
      setLines(INIT);
      setInput("");
      setHistIdx(-1);
      return;
    }

    if (trimmed === "contact") {
      document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
      setLines((prev) => [...prev, { type: "input", text: `${PROMPT} ${cmd}` }]);
      setHistory((prev) => [trimmed, ...prev].slice(0, 30));
      setHistIdx(-1);
      setInput("");
      return;
    }

    const outputLines = resolve(trimmed);

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
    if (e.key === "Tab") {
      e.preventDefault();
      const trimmed = input.trim().toLowerCase();
      if (!trimmed) return;
      const match = COMMANDS.find((c) => c.startsWith(trimmed));
      if (match) setInput(match);
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
          antoni@portfolio — zsh
        </span>
      </div>

      {/* Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto px-5 py-4"
        style={{ maxHeight: 480 }}
      >
        <Neofetch />
        <div className="space-y-0.5">
          {lines.map((line, i) => {
            if (line.type === "bold") {
              const colonIdx = line.text.indexOf(":");
              const label = colonIdx >= 0 ? line.text.slice(0, colonIdx + 1) : line.text;
              const value = colonIdx >= 0 ? line.text.slice(colonIdx + 1) : "";
              return (
                <div key={i} className="whitespace-pre">
                  <span className="font-semibold text-foreground">{label}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              );
            }
            return (
              <div
                key={i}
                className={
                  line.type === "input"
                    ? "text-foreground/80"
                    : line.type === "error"
                      ? "text-red-400"
                      : line.type === "success"
                        ? "text-green-400"
                        : line.type === "accent"
                          ? "text-accent font-semibold"
                          : "text-muted-foreground"
                }
              >
                {line.text || " "}
              </div>
            );
          })}
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
