export type ProjectVideo = {
  src: string;   // path relative to /public
  label: string;
  description: string;
  portrait?: boolean; // true for vertical (9:16) recordings
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  liveUrl?: string;
  image?: string;          // hero card preview
  gallery?: string[];      // screenshots for case study
  heroVideo?: string;      // main scroll-through video (shown large at top)
  featureVideos?: ProjectVideo[]; // interactive elements videos
  accentColor: string;
};

export type Capability = {
  label: string;
  icon: string;
};

export const projects: Project[] = [
  {
    slug: "la-fontana",
    name: "La Fontana Pizza Napoletana",
    tagline: "Strona dla pizzerii z certyfikatem AVPN",
    description:
      "Kompletna strona firmowa z menu, galerią i integracją z Google Business Profile. Certyfikowana przez Associazione Verace Pizza Napoletana (#739).",
    stack: ["Next.js 14", "Supabase", "Tailwind CSS", "Vercel"],
    liveUrl: "https://la-fontana-tau.vercel.app",
    image: "/projects/la-fontana/images/hero-image.png",
    accentColor: "#c8401b",
  },
  {
    slug: "bd-design",
    name: "BD Design",
    tagline: "Portfolio dla grafika specjalizującego się w brandingu",
    description:
      "Nowoczesne portfolio prezentujące realizacje z zakresu odzieży reklamowej i gadżetów promocyjnych. Minimalistyczny design z efektami hover i płynnymi animacjami scroll-driven.",
    stack: ["Next.js 14", "Tailwind CSS", "GSAP", "Vercel"],
    liveUrl: "https://bddesign.one/",
    image: "/projects/bd-design/images/hero-image.png",
    gallery: [
      "/projects/bd-design/images/hero-image.png",
      "/projects/bd-design/images/about-image.png",
      "/projects/bd-design/images/categories.png",
      "/projects/bd-design/images/why-me-image.png",
      "/projects/bd-design/images/footer-image.png",
    ],
    heroVideo: "/projects/bd-design/videos/scroll.mp4",
    featureVideos: [
      {
        src: "/projects/bd-design/videos/lightbox.mp4",
        label: "Lightbox galerii",
        description: "Kliknięcie w kartę projektu otwiera fullscreenowy lightbox z nawigacją strzałkami i zamknięciem przez Escape lub kliknięcie w tło.",
      },
      {
        src: "/projects/bd-design/videos/why-choose-me.mp4",
        label: "Sekcja 'Dlaczego ja'",
        description: "Najechanie na element rozsuwa lewy akcent i pojawia się opis. Custom cursor zmienia kolor ringa w tej sekcji.",
      },
      {
        src: "/projects/bd-design/videos/footer.mp4",
        label: "Footer i proces współpracy",
        description: "Trzykrokowy proces współpracy z animacjami hover na kartach i linkiem CTA do Instagrama.",
      },
      {
        src: "/projects/bd-design/videos/scroll-mobile.mp4",
        label: "Wersja mobilna",
        description: "Responsywny layout na telefonie — hamburger z animacją clip-path, efekt scramble liter logo i stagger linków menu.",
        portrait: true,
      },
    ],
    accentColor: "#2563eb",
  },
];

export const capabilities: Capability[] = [
  { label: "E-commerce", icon: "ShoppingCart" },
  { label: "Dashboard / CRM", icon: "ChartBar" },
  { label: "Apka AI", icon: "Sparkle" },
  { label: "Automatyzacja n8n", icon: "GitBranch" },
  { label: "Strona firmowa", icon: "Storefront" },
  { label: "Integracja Supabase", icon: "Database" },
  { label: "Landing page", icon: "Cursor" },
];
