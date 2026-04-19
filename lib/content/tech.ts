export type TechItem = {
  name: string;
  simpleIcon?: string;  // @icons-pack/react-simple-icons key e.g. "SiReact"
  brandColor?: string;  // hex brand color
  phosphorIcon?: string; // fallback Phosphor icon if no simpleIcon
  level: number;
  note: string;
};

export type TechGroup = {
  id: string;
  label: string;
  eyebrow: string;
  categoryIcon: string; // Phosphor icon name for the group header
  items: TechItem[];
};

export const techGroups: TechGroup[] = [
  {
    id: "hardware",
    label: "Hardware & Networking",
    eyebrow: "01",
    categoryIcon: "Desktop",
    items: [
      { name: "Składanie PC", phosphorIcon: "Desktop", level: 92, note: "Dobór komponentów, overclocking, diagnostyka." },
      { name: "CPU / GPU", phosphorIcon: "Cpu", level: 88, note: "Intel, AMD — architektura i chłodzenie." },
      { name: "Sieci LAN", phosphorIcon: "Network", level: 75, note: "Kablowanie, switching, podstawy routingu." },
      { name: "Cisco", simpleIcon: "SiCisco", brandColor: "#1BA0D7", level: 62, note: "Packet Tracer, CLI, CCNA w toku." },
      { name: "Raspberry Pi", simpleIcon: "SiRaspberrypi", brandColor: "#A22846", level: 60, note: "Linux, GPIO, projekty IoT." },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    eyebrow: "02",
    categoryIcon: "MonitorPlay",
    items: [
      { name: "HTML", simpleIcon: "SiHtml5", brandColor: "#E34F26", level: 90, note: "Semantyka, dostępność, SEO." },
      { name: "CSS", simpleIcon: "SiCss", brandColor: "#1572B6", level: 88, note: "Flexbox, grid, animacje, custom properties." },
      { name: "JavaScript", simpleIcon: "SiJavascript", brandColor: "#F7DF1E", level: 82, note: "ES2024, async/await, DOM manipulation." },
      { name: "TypeScript", simpleIcon: "SiTypescript", brandColor: "#3178C6", level: 76, note: "Typy, generyki, strict mode." },
      { name: "React", simpleIcon: "SiReact", brandColor: "#61DAFB", level: 80, note: "Hooks, context, custom hooks, React 19." },
      { name: "Next.js", simpleIcon: "SiNextdotjs", brandColor: "#e2e8f0", level: 78, note: "App Router, SSR, API routes, Turbopack." },
      { name: "Tailwind CSS", simpleIcon: "SiTailwindcss", brandColor: "#06B6D4", level: 85, note: "Utility-first, custom tokens, responsive." },
      { name: "shadcn/ui", phosphorIcon: "Shapes", level: 80, note: "Radix primitives, customizacja, composability." },
    ],
  },
  {
    id: "backend",
    label: "Backend & Database",
    eyebrow: "03",
    categoryIcon: "Database",
    items: [
      { name: "Supabase", simpleIcon: "SiSupabase", brandColor: "#3ECF8E", level: 78, note: "Auth, Postgres, Storage, RLS, Edge Functions." },
      { name: "PostgreSQL", simpleIcon: "SiPostgresql", brandColor: "#4169E1", level: 70, note: "Schema design, relacje, indeksy, RLS." },
      { name: "Node.js", simpleIcon: "SiNodedotjs", brandColor: "#339933", level: 65, note: "Express, API routes, middleware." },
      { name: "REST API", phosphorIcon: "ArrowsLeftRight", level: 74, note: "Projektowanie endpointów, auth, rate limiting." },
    ],
  },
  {
    id: "ai-automation",
    label: "AI & Automatyzacje",
    eyebrow: "04",
    categoryIcon: "Sparkle",
    items: [
      { name: "Claude API", simpleIcon: "SiAnthropic", brandColor: "#D4A27F", level: 80, note: "Integracja LLM, tool use, streaming." },
      { name: "OpenAI", phosphorIcon: "Brain", level: 72, note: "Chat completions, embeddings, fine-tuning." },
      { name: "n8n", simpleIcon: "SiN8n", brandColor: "#EA4B71", level: 82, note: "Workflow automation, integracje, webhooks." },
      { name: "Make", simpleIcon: "SiMake", brandColor: "#6D00CC", level: 65, note: "Scenariusze, integracje, automatyzacje no-code." },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Narzędzia",
    eyebrow: "05",
    categoryIcon: "Terminal",
    items: [
      { name: "Linux", simpleIcon: "SiLinux", brandColor: "#FCC624", level: 70, note: "CLI, bash scripting, konfiguracja systemu." },
      { name: "Docker", simpleIcon: "SiDocker", brandColor: "#2496ED", level: 58, note: "Dockerfile, compose, podstawy konteneryzacji." },
      { name: "Git", simpleIcon: "SiGit", brandColor: "#F05032", level: 80, note: "Branching, rebase, pull requesty." },
      { name: "Vercel", simpleIcon: "SiVercel", brandColor: "#e2e8f0", level: 82, note: "Deploy, environment vars, preview links." },
      { name: "VS Code", simpleIcon: "SiVscodium", brandColor: "#007ACC", level: 88, note: "Extensions, debugger, multi-cursor." },
    ],
  },
];
