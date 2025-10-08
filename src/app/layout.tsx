import type { Metadata } from "next";
import "./globals.css";
import { localBusinessSchema, businessInfo } from './next-seo.config';
import { geistSans, geistMono } from './lib/fonts';
import Analytics from './components/Analytics';

// Metadata pour Next.js App Router
export const metadata: Metadata = {
  metadataBase: new URL("https://adrianbauduin.com"),
  title: "Adrian Bauduin - Trophées en bois sur mesure",
  description: "Création de trophées en bois sur mesure dans la région de Lille",
  keywords: "trophée sur mesure, ébéniste Lille, trophée bois, création artisanale",
  openGraph: {
    title: "Adrian Bauduin - trophées en bois sur mesure",
    description: "Création de trophées en bois sur mesure dans la région de Lille",
    url: "https://adrianbauduin.com",
    siteName: "Adrian Bauduin - Trophées en bois sur mesure",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: businessInfo.image,
        width: 1200,
        height: 630,
        alt: "Adrian Bauduin - Ébéniste spécialisé dans les trophées en bois sur mesure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adrian Bauduin - trophées en bois sur mesure",
    description: "Création de trophées en bois sur mesure dans la région de Lille",
    images: [businessInfo.twitterImage],
  },
  // Preconnect pour améliorer LCP
  other: {
    'preconnect': 'https://fonts.googleapis.com',
    'dns-prefetch': 'https://fonts.gstatic.com',
    'google-site-verification': 'googlea4bfe6b54e36b8db',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
