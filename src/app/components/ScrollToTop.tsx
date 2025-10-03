'use client';

import React, { useState, useEffect } from 'react';
import TopIcon from './TopIcon';

const ScrollToTop: React.FC = () => {
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

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className='w-14 h-14 sm:w-18 sm:h-18 fixed bottom-5 rounded-full right-5 bg-slate-200 opacity-90 border-4 p-2 shadow-custom cursor-pointer transition-transform duration-300 ease-in-out hover:delay-200 hover:-translate-y-2'
      aria-label="Retour en haut de la page"
    >
      <TopIcon />
    </button>
  );
};

export default ScrollToTop;