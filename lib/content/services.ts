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
      "Profesjonalnie wykonane, estetyczne strony, zoptymalizowane pod widoczność w Google / Google Maps. Od zwyczajnych wizytówek do rozbudowanych stron z bazami danych.",
    deliverables: [
      "Responsywność na każdym urządzeniu",
      "Optymalizacja pod Google",
      "Opublikowanie strony z własną domeną",
    ],
    badge: "Dla firm",
  },
  {
    id: "webapp",
    icon: "ChartBar",
    title: "Aplikacje webowe & dashboardy",
    description:
      "Panele admina, systemy do zarządzania klientami i zamówieniami, narzędzia wewnętrzne. Full-stack z Supabase i Next.js.",
    deliverables: [
      "Logowanie i różne poziomy dostępu",
      "Bezpieczna baza danych",
      "Połączenie z zewnętrznymi usługami",
      "Tabele, wykresy, filtry i eksport",
    ],
    badge: "Full-stack",
  },
  {
    id: "portfolio",
    icon: "PaintBrush",
    title: "Portfolio & strony kreatywne",
    description:
      "Interaktywne portfolio z animacjami i efektami, responsywne, dopasowane pod klienta.",
    deliverables: [
      "Animacje przy przewijaniu strony",
      "Efekty hover i własny kursor",
      "Szybkie ładowanie strony",
      "Unikalny design dopasowany do marki",
    ],
    badge: "Indywidualne",
  },
  {
    id: "consulting",
    icon: "Compass",
    title: "Utrzymywanie stron & redesign",
    description:
      "Aktualizacje, poprawki i odświeżenie designu twojej strony. Zostaję z klientem po wdrożeniu zmian.",
    deliverables: [
      "Przegląd i ocena istniejącej strony",
      "Propozycja nowego designu",
      "Poprawa szybkości i wyglądu",
      "Stałe wsparcie po zmianach",
    ],
    badge: "Stałe wsparcie",
  },
];
