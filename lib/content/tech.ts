export type TechItem = {
  name: string;
  simpleIcon?: string;
  brandColor?: string;
  phosphorIcon?: string;
  level: number; // 0–5, step 0.5
  note: string;
};

export type TechGroup = {
  id: string;
  label: string;
  eyebrow: string;
  categoryIcon: string;
  items: TechItem[];
};

export const techGroups: TechGroup[] = [
  {
    id: "hardware",
    label: "Hardware & Networking",
    eyebrow: "01",
    categoryIcon: "Desktop",
    items: [
      { name: "Składanie PC", phosphorIcon: "Desktop", level: 5, note: "Dobór komponentów pod budżet, montaż, diagnostyka i naprawa." },
      { name: "Sieci LAN", phosphorIcon: "Network", level: 3.5, note: "Konfiguracja routerów, switchy, VLAN-ów." },
      { name: "Okablowanie", phosphorIcon: "Cable", level: 3, note: "Skrętkowanie, panel krosowy, standardy okablowania strukturalnego." },
      { name: "Serwery", phosphorIcon: "HardDrive", level: 3, note: "DHCP, DNS, Active Directory, Apache — konfiguracja i zarządzanie." },
      { name: "Wirtualizacja", phosphorIcon: "StackSimple", level: 2, note: "VirtualBox, VMware, WSL — instalacja i uruchamianie maszyn wirtualnych." },
    ],
  },
  {
    id: "frontend",
    label: "Frontend & Języki",
    eyebrow: "02",
    categoryIcon: "MonitorPlay",
    items: [
      { name: "HTML / CSS", simpleIcon: "SiHtml5", brandColor: "#E34F26", level: 4.5, note: "Semantyka, Flexbox, Grid, animacje, custom properties." },
      { name: "JavaScript", simpleIcon: "SiJavascript", brandColor: "#F7DF1E", level: 3.5, note: "ES2024, async/await, DOM manipulation." },
      { name: "TypeScript", simpleIcon: "SiTypescript", brandColor: "#3178C6", level: 2.5, note: "Typy, interfejsy, strict mode." },
      { name: "React / Next.js", simpleIcon: "SiReact", brandColor: "#61DAFB", level: 3.5, note: "App Router, komponenty, hooki, SSR." },
      { name: "Tailwind CSS", simpleIcon: "SiTailwindcss", brandColor: "#06B6D4", level: 4.5, note: "Utility-first, custom tokeny, responsive design." },
      { name: "C++", simpleIcon: "SiCplusplus", brandColor: "#00599C", level: 3.5, note: "Zmienne, pętle, funkcje, klasy — szkoła + własna nauka." },
      { name: "Python", simpleIcon: "SiPython", brandColor: "#3776AB", level: 1.5, note: "Podstawy składni, aktywnie się uczę." },
    ],
  },
  {
    id: "backend",
    label: "Backend & Database",
    eyebrow: "03",
    categoryIcon: "Database",
    items: [
      { name: "SQL", phosphorIcon: "Database", level: 2, note: "Proste zapytania, tworzenie tabel i baz — PostgreSQL, XAMPP." },
      { name: "Supabase", simpleIcon: "SiSupabase", brandColor: "#3ECF8E", level: 3, note: "Auth, Storage, RLS, integracja z Next.js." },
      { name: "API Integration", phosphorIcon: "ArrowsLeftRight", level: 3, note: "Podłączanie zewnętrznych API — fetch, REST." },
    ],
  },
  {
    id: "ai-automation",
    label: "AI & Automatyzacje",
    eyebrow: "04",
    categoryIcon: "Sparkle",
    items: [
      { name: "n8n", simpleIcon: "SiN8n", brandColor: "#EA4B71", level: 4.5, note: "Workflow automation, integracje, webhooks, złożone scenariusze." },
      { name: "Prompt Engineering", phosphorIcon: "ChatText", level: 4, note: "Budowanie skutecznych promptów, context management, chain-of-thought." },
      { name: "Claude / OpenAI", simpleIcon: "SiAnthropic", brandColor: "#D4A27F", level: 3, note: "Integracja LLM do kodu, streaming, tool use." },
      { name: "Lokalne modele", phosphorIcon: "Brain", level: 4, note: "Instalacja i uruchamianie modeli AI lokalnie na PC." },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Narzędzia",
    eyebrow: "05",
    categoryIcon: "Terminal",
    items: [
      { name: "VS Code", simpleIcon: "SiVscodium", brandColor: "#007ACC", level: 5, note: "Główne IDE — extensions, debugger, multi-cursor, snippety." },
      { name: "Git", simpleIcon: "SiGit", brandColor: "#F05032", level: 4, note: "Branching, merge, rebase, pull requesty." },
      { name: "Linux", simpleIcon: "SiLinux", brandColor: "#FCC624", level: 3, note: "CLI, bash, konfiguracja systemu, podstawy administracji." },
      { name: "Vercel", simpleIcon: "SiVercel", brandColor: "#e2e8f0", level: 2, note: "Deploy, environment vars, preview links." },
    ],
  },
];
