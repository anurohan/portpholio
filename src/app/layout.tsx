import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { meta, SITE_URL } from "@/lib/site";
import { profile } from "@/content/profile";
import Providers from "@/providers/Providers";
import Background from "@/components/three/Background";
import Nav from "@/components/ui/Nav";
import Cursor from "@/components/ui/Cursor";
import Intro from "@/components/intro/Intro";
import SkipLink from "@/components/ui/SkipLink";
import ScrollProgress from "@/components/ui/ScrollProgress";

// Self-hosted at build time by Next — no external request, no layout shift.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: meta.title,
    template: `%s — ${profile.name}`,
  },
  description: meta.description,
  keywords: meta.keywords,
  authors: [{ name: profile.name, url: profile.githubUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: meta.title,
    description: meta.description,
    siteName: `${profile.name} — Portfolio`,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: meta.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    images: ["/og.svg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080B10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-ink-900 text-chalk antialiased">
        <Providers>
          <SkipLink />
          <Background />
          <Cursor />
          <Nav />
          <ScrollProgress />
          <Intro />
          <main id="main">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
