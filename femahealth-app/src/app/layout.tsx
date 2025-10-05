import type { Metadata } from "next";
import { Abril_Fatface, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

const abrilFatface = Abril_Fatface({
  variable: "--font-abril-fatface",
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HealthVibe - Natural Remedies & Wellness Solutions",
  description: "Discover AI-powered natural remedies, herbal treatments, and wellness solutions. Your trusted companion for holistic health and healing with thousands of verified remedies.",
  keywords: "natural remedies, herbal medicine, wellness, health, healing, alternative medicine, AI health, holistic healing, herbal treatments",
  authors: [{ name: "HealthVibe Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "HealthVibe - Natural Remedies & Wellness Solutions",
    description: "Discover AI-powered natural remedies, herbal treatments, and wellness solutions. Your trusted companion for holistic health and healing.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://images.unsplash.com/photo-1595435742656-5272d0bc9b72?w=1200&h=630&fit=crop&crop=center",
        width: 1200,
        height: 630,
        alt: "HealthVibe - Natural Healing Herbs",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${abrilFatface.variable} ${montserrat.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
