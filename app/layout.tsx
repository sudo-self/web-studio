import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const og = metadata.openGraph;
  const tw = metadata.twitter;

  const ogImages = Array.isArray(og?.images)
    ? og.images.map((img) => img.url)
    : og?.images
    ? [og.images.url]
    : [];

  const twImages = Array.isArray(tw?.images) ? tw.images : tw?.images ? [tw.images] : [];

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
        {ogImages.map((url, i) => (
          <meta key={i} property="og:image" content={url} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content={tw?.card as string} />
        <meta name="twitter:title" content={tw?.title as string} />
        <meta name="twitter:description" content={tw?.description as string} />
        {twImages.map((url, i) => (
          <meta key={i} name="twitter:image" content={url} />
        ))}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}







