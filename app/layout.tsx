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
  metadataBase: new URL("https://studio.jessejesse.com/"),
  title: {
    default: "studio.JesseJesse.com",
    template: "%s | studio.JesseJesse.com",
  },
  description: "Build websites with AI assistance",
  keywords: [
    "website builder",
    "AI website assistant",
    "studio.JesseJesse.com",
    "no-code web builder",
  ],
  authors: [{ name: "Jesse Jesse" }],
  creator: "Jesse Jesse",
  publisher: "Jesse Jesse",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studio.jessejesse.com",
    title: "studio.JesseJesse.com - Build websites with AI",
    description: "Build websites with AI assistance",
    images: [
      {
        url: "/sog.png",
        width: 1200,
        height: 630,
        alt: "studio.JesseJesse.com preview image",
      },
    ],
    siteName: "studio.JesseJesse.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "studio.JesseJesse.com - Build websites with AI",
    description: "Build websites with AI assistance",
    images: ["/sog.png"],
  },
  alternates: {
    canonical: "https://studio.jessejesse.com",
  },
  other: {
    "theme-color": "#1e40af",
    "msapplication-TileColor": "#1e40af",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://studio.jessejesse.com/#website",
              url: "https://studio.jessejesse.com",
              name: "studio.JesseJesse.com",
              description: "Build websites with AI assistance",
              publisher: {
                "@id": "https://studio.jessejesse.com/#organization",
              },
              inLanguage: "en-US",
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}









