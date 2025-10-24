"use client";

import type { Metadata, OpenGraph, Twitter } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/contexts/SettingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "studio.JesseJesse.com",
  description: "Build websites with AI assistance",
  icons: {
    icon: "/app/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "studio.JesseJesse.com",
    description: "Build websites with AI assistance",
    url: "https://studio.jessejesse.com",
    siteName: "studio.JesseJesse.com",
    images: [
      {
        url: "/sog.png",
        width: 1200,
        height: 630,
        alt: "studio.JesseJesse.com preview image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "studio.JesseJesse.com",
    description: "Build websites with AI assistance",
    images: ["/sog.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const og: OpenGraph | undefined = metadata.openGraph;
  const tw: Twitter | undefined = metadata.twitter;

  const normalizeOGImages = (images: OpenGraph["images"]): { url: string }[] => {
    if (!images) return [];
    return Array.isArray(images) ? images.map(img => ({ url: String(img.url) })) : [{ url: String(images.url) }];
  };

  const normalizeTwitterImages = (images: Twitter["images"]): string[] => {
    if (!images) return [];
    return Array.isArray(images) ? images.map(img => (typeof img === "string" ? img : String(img.url))) : [typeof images === "string" ? images : String(images.url)];
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/app/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Open Graph */}
        <meta property="og:title" content={og?.title as string} />
        <meta property="og:description" content={og?.description as string} />
        <meta property="og:url" content={og?.url as string} />
        <meta property="og:site_name" content={og?.siteName as string} />
        {normalizeOGImages(og?.images).map((img, i) => (
          <meta key={i} property="og:image" content={img.url} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content={tw?.card as string} />
        <meta name="twitter:title" content={tw?.title as string} />
        <meta name="twitter:description" content={tw?.description as string} />
        {normalizeTwitterImages(tw?.images).map((img, i) => (
          <meta key={i} name="twitter:image" content={img} />
        ))}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}






