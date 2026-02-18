'use client';

import { useState, useEffect } from 'react';
import Hero from "./components/Hero";
import About from "./components/About";
import Contact from "./components/Contact";
import Realisation from "./components/Realisation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Collaborations from "./components/Collaborations";
import GoogleReviews from "./components/GoogleReviews";
import TopIcon from "./components/TopIcon";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // JSON-LD pour la page d'accueil
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Adrian Bauduin - Ébéniste créateur de trophées sur mesure",
    "description": "Ébéniste passionné spécialisé dans la création de trophées sur mesure, alliant savoir-faire traditionnel et design contemporain pour valoriser vos événements dans la région de Lille",
    "url": "https://adrianbauduin.com"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <div className="scroll-smooth">
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Realisation />
          <Collaborations />
          <GoogleReviews />
          <Contact />
        </main>
        <Footer />
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className='w-14 h-14 sm:w-18 sm:h-18 fixed bottom-5 rounded-full right-5 z-50 bg-slate-200 opacity-90 border-4 p-2 shadow-custom cursor-pointer transition-transform duration-300 ease-in-out hover:delay-200 hover:-translate-y-2'
            aria-label="Retour en haut de la page"
          >
            <TopIcon />
          </button>
        )}
      </div>
    </>
  );
}
