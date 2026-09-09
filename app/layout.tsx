import type { Metadata } from "next";
import { Fraunces, Inter, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/animation/SmoothScrollProvider";
import { CursorPollenOGL } from "@/components/flowers/CursorPollenOGL";
import { FlowerCursor } from "@/components/flowers/FlowerCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SitePreloader } from "@/components/layout/SitePreloader";

import { AudioToggle } from "@/components/layout/AudioToggle";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kimkhanh.me"),
  title: "Kim Khanh — Port Operations & Personal Archive",
  description:
    "Kim Khanh is a commercial specialist in port operations. Explore her work journey, education, stories, and little joys.",
  keywords: [
    "Kim Khanh",
    "commercial specialist",
    "port operations",
    "transport operations",
    "botanical garden",
    "flowers",
    "slow living",
    "scrapbook",
    "editorial portfolio",
  ],
  authors: [
    { name: "Kim Khanh" },
    { name: "trhgatu", url: "https://github.com/trhgatu" },
  ],
  creator: "trhgatu",
  openGraph: {
    title: "Kim Khanh — Port Operations & Personal Archive",
    description:
      "A personal journey through port operations, education, varied work experiences, and everyday joys.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/images/flower_2.avif",
        width: 1200,
        height: 630,
        alt: "Kim Khanh Botanical Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kim Khanh — Port Operations & Personal Archive",
    description:
      "A personal journey through port operations, education, varied work experiences, and everyday joys.",
    images: ["/assets/images/flower_2.avif"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${caveat.variable}`}>
      <body className="overflow-guard">
        <SitePreloader />
        <SmoothScrollProvider>
          <CursorPollenOGL />
          <FlowerCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <AudioToggle />
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
