import { Geist, Geist_Mono } from "next/font/google";

// Optimisation des fonts avec preload et subset
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Améliore le CLS
  preload: true,   // Améliore le LCP
  fallback: ['system-ui', 'arial'], // Fallback rapide
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Pas critique, évite le préchargement
  fallback: ['ui-monospace', 'monospace'],
});