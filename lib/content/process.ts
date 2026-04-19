export type ProcessStep = {
  number: string;
  title: string;
  body: string;
  detail: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Rozmowa",
    body: "Zaczynamy od rozmowy.",
    detail:
      "Co chcesz osiągnąć? Kto to kupuje? Jaki masz budżet i deadline? Bez presji — to etap słuchania, nie sprzedawania. Wychodzę z nim z gotowym briefem.",
  },
  {
    number: "02",
    title: "Projekt",
    body: "Przekładam pomysł na projekt.",
    detail:
      "Wireframe, potem design w Figmie. Widzisz co zobaczy twój klient — zanim napiszę choćby linię kodu. Wprowadzam poprawki, aż będziemy zgodni.",
  },
  {
    number: "03",
    title: "Budowa",
    body: "Piszę kod.",
    detail:
      "Z dbałością o detal, szybkość i SEO. Każdego dnia widzisz postępy na dedykowanym linku preview — nie czekasz do końca na niespodziankę.",
  },
  {
    number: "04",
    title: "Wdrożenie",
    body: "Deploy i przekazanie.",
    detail:
      "Strona ląduje na twojej domenie. Konfiguruję analitykę, szkolę cię z aktualizacji treści i zostaję na wsparciu. Projekt żyje dalej.",
  },
];
