export type Service = {
  id: string;
  icon: string;
  title: string;
  description: string;
  deliverables: string[];
  badge: string;
};

export const services: Service[] = [
  {
    id: "landing",
    icon: "Storefront",
    title: "Strony firmowe & landing page",
    description:
      "Szybkie, estetyczne strony zoptymalizowane pod SEO i konwersję. Od wizytówki po rozbudowany serwis.",
    deliverables: [
      "Responsywny design mobile-first",
      "Optymalizacja SEO i Core Web Vitals",
      "Integracja z CMS lub edytor treści",
      "Deploy na Vercel z własną domeną",
    ],
    badge: "Most popular",
  },
  {
    id: "webapp",
    icon: "ChartBar",
    title: "Aplikacje webowe & dashboardy",
    description:
      "Panele admina, CRM-y, narzędzia wewnętrzne. Full-stack z Supabase i Next.js.",
    deliverables: [
      "Autoryzacja i zarządzanie rolami",
      "Baza danych Postgres z RLS",
      "REST API lub server actions",
      "Tabele, wykresy, filtry i eksport",
    ],
    badge: "Full-stack",
  },
  {
    id: "portfolio",
    icon: "PaintBrush",
    title: "Portfolio & strony kreatywne",
    description:
      "Interaktywne portfolio z animacjami i efektami, które zostają w pamięci odwiedzających.",
    deliverables: [
      "Animacje scroll-driven i micro-interactions",
      "Custom cursor i efekty hover",
      "Optymalizowane zasoby i lazy loading",
      "Unikalny design dopasowany do marki",
    ],
    badge: "Creative",
  },
  {
    id: "consulting",
    icon: "Compass",
    title: "Konsultacje tech & audyt",
    description:
      "Przegląd istniejącej strony, dobór stosu technologicznego, wskazówki do optymalizacji.",
    deliverables: [
      "Audyt wydajności i bezpieczeństwa",
      "Raport z rekomendacjami",
      "Dobór technologii pod projekt",
      "Konsultacja godzinowa lub pakiet",
    ],
    badge: "Advisory",
  },
  {
    id: "hardware",
    icon: "Cpu",
    title: "Hardware & składanie PC",
    description:
      "Dobór komponentów pod budżet i zastosowanie, montaż, diagnostyka i overclocking.",
    deliverables: [
      "Konfiguracja pod gaming / workstation / serwer",
      "Montaż i cable management",
      "Instalacja systemu i sterowników",
      "Diagnostyka i overclocking",
    ],
    badge: "Hardware",
  },
  {
    id: "maintenance",
    icon: "Wrench",
    title: "Wsparcie & utrzymanie",
    description:
      "Aktualizacje, monitoring, poprawki, szkolenie — zostaję na dłużej po wdrożeniu.",
    deliverables: [
      "Monitoring uptime i alertów",
      "Regularne aktualizacje zależności",
      "Szybkie poprawki i hotfixy",
      "Szkolenie z obsługi treści",
    ],
    badge: "Ongoing",
  },
];
