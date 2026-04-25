import type { Metadata, Viewport } from "next";
import { Geist_Mono, Playfair_Display, DM_Sans } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { BackNavProvider } from "@/components/providers/back-nav-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
  metadataBase: new URL("https://aulan.pl"),
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
    url: "https://aulan.pl",
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
  themeColor: "#f0e6d3",
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
      className={`${geistMono.variable} ${playfairDisplay.variable} ${dmSans.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
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
            <Analytics />
          </BackNavProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
