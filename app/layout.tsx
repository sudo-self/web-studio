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


const asString = (value: string | undefined) => value ?? "";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const og = metadata.openGraph;
  const tw = metadata.twitter;

  return (
    <html lang="en">
      <head>
        {/* Icons & manifest */}
        <link rel="icon" href="/app/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Open Graph */}
        <meta property="og:title" content={asString(og?.title)} />
        <meta property="og:description" content={asString(og?.description)} />
        <meta property="og:url" content={asString(og?.url)} />
        <meta property="og:site_name" content={asString(og?.siteName)} />
        {og?.images?.map((img, i) => (
          <meta key={i} property="og:image" content={asString(img.url)} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content={asString(tw?.card)} />
        <meta name="twitter:title" content={asString(tw?.title)} />
        <meta name="twitter:description" content={asString(tw?.description)} />
        {tw?.images?.map((img, i) => (
          <meta key={i} name="twitter:image" content={asString(img)} />
        ))}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}



