'use client';

import { useEffect, useState } from "react";

interface ClientScrollHandlerProps {
  children: React.ReactNode;
}

export default function ClientScrollHandler({ children }: ClientScrollHandlerProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.2);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (scrolled) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return scrolled ? (
    <div onClick={scrollToTop}>
      {children}
    </div>
  ) : null;
}