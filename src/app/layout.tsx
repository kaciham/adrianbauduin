import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { localBusinessSchema, businessInfo } from './next-seo.config';
import { geistSans, geistMono } from './lib/fonts';
import Analytics from './components/Analytics';
import { AuthProvider } from '../contexts/AuthContext';

// Metadata pour Next.js App Router
export const metadata: Metadata = {
  metadataBase: new URL("https://adrianbauduin.com"),
  title: "Adrian Bauduin - Trophées en bois sur mesure",
  description: "Ébéniste créateur à Lille, spécialisé dans la conception de trophées en bois sur mesure. Gravure laser, impression UV et usinage CNC pour vos événements d'entreprise, sportifs et culturels.",
  keywords: "trophée sur mesure, ébéniste Lille, trophée bois, création artisanale",
  alternates: {
    canonical: "https://adrianbauduin.com",
  },
  openGraph: {
    title: "Adrian Bauduin - trophées en bois sur mesure",
    description: "Ébéniste créateur à Lille, spécialisé dans la conception de trophées en bois sur mesure. Gravure laser, impression UV et usinage CNC pour vos événements d'entreprise, sportifs et culturels.",
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
    description: "Ébéniste créateur à Lille, spécialisé dans la conception de trophées en bois sur mesure. Gravure laser, impression UV et usinage CNC pour vos événements d'entreprise, sportifs et culturels.",
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
        <link rel="preload" as="image" href="/projects/trophée-design-contreplaqué-gravure-impression.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {/* Skip to content - accessibilité */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:text-sm focus:font-semibold"
        >
          Aller au contenu principal
        </a>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5DLRC8GP"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <AuthProvider>
          <Analytics />
          {children}
        </AuthProvider>
        {/* Google Tag Manager - chargé après l'interactivité */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5DLRC8GP');`
          }}
        />
        <Script
          src="https://widgets.sociablekit.com/google-reviews/widget.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://datafa.st/js/script.js"
          strategy="lazyOnload"
          data-website-id="dfid_v7DsPZXhGzoaO3hO0OTEP"
          data-domain="adrianbauduin.com"
        />
      </body>
    </html>
  );
}
