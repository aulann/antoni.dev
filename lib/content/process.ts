export type ProcessStep = {
  number: string;
  title: string;
  body: string;
  detail: string;
  icon: string;
  duration: string;
  deliverables: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Rozmowa",
    body: "Zaczynamy od rozmowy.",
    detail:
      "Co chcesz osiągnąć? Dla kogo ten projekt? Jaki masz budżet? Wszystko omawiamy na spokojnie.",
    icon: "ChatCircle",
    duration: "1–2 dni",
    deliverables: ["Plan projektu", "Wycenę", "Śmiało możesz mówić co potrzebujesz"],
  },
  {
    number: "02",
    title: "Projekt",
    body: "Przekładam pomysł na projekt.",
    detail:
      "Przekładam twój pomysł na projekt demo, wysyłam podgląd, wprowadzam poprawki.",
    icon: "PaintBrushBroad",
    duration: "3–4 dni",
    deliverables: ["Projekt demo strony", "Styl wizualny", "Możliwość poprawek przed pisaniem kodu"],
  },
  {
    number: "03",
    title: "Budowa",
    body: "Piszę kod.",
    detail:
      "Piszę projekt zgodnie z zatwierdzonym designem, dbam o każdy szczegół, możesz samemu śledzić postęp.",
    icon: "BracketsCurly",
    duration: "1–3 tygodnie",
    deliverables: ["Link podglądowy do strony", "Stały kontakt", "Optymalizacja pod Google wraz z responsywnością"],
  },
  {
    number: "04",
    title: "Wdrożenie",
    body: "Publikacja i przekazanie projektu.",
    detail:
      "Strona idzie do internetu na twoją własną domenę, pokazuję finalny projekt i zostaję do opiekowania się stroną.",
    icon: "RocketLaunch",
    duration: "1–2 dni",
    deliverables: ["Działającą stronę", "Stałą opiekę", "Pokazanie jak działa"],
  },
];
