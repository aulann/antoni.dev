import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, Geist_Mono, Playfair_Display, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { BackNavProvider } from "@/components/providers/back-nav-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://antoni-portfolio.vercel.app"),
  title: {
    default: "Antoni — Code is craft.",
    template: "%s · Antoni",
  },
  description:
    "Portfolio Antoniego — pasjonata technologii. Frontend, backend, AI, automatyzacje, hardware. Buduję, automatyzuję, składam, uczę się.",
  keywords: [
    "Antoni",
    "portfolio",
    "frontend developer",
    "Next.js",
    "React",
    "Supabase",
    "AI",
    "n8n",
    "hardware",
    "CCNA",
    "INF.02",
  ],
  authors: [{ name: "Antoni" }],
  creator: "Antoni",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://antoni-portfolio.vercel.app",
    title: "Antoni — Code is craft.",
    description:
      "Portfolio pasjonata technologii. Frontend, backend, AI, automatyzacje, hardware.",
    siteName: "Antoni Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antoni — Code is craft.",
    description:
      "Portfolio pasjonata technologii. Frontend, backend, AI, automatyzacje, hardware.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1420" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
      className={`${fraunces.variable} ${interTight.variable} ${geistMono.variable} ${playfairDisplay.variable} ${dmSans.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          storageKey="ap-theme"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LenisProvider>
            <BackNavProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-2 focus:outline-accent"
              >
                Przejdź do treści
              </a>
              {children}
              <Toaster />
            </BackNavProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
