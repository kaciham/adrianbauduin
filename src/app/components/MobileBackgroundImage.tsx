"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';

interface MobileBackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  priority?: boolean;
}

const MobileBackgroundImage: React.FC<MobileBackgroundImageProps> = ({
  src,
  alt = "",
  className = "",
  children,
  style = {},
  priority = false
}) => {
  const [useParallax, setUseParallax] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobile = window.innerWidth <= 768;
    const wantsFixed = className.includes('bg-fixed');
    setUseParallax(wantsFixed && !isMobile && !isIOS);

    const handleResize = () => {
      setUseParallax(wantsFixed && window.innerWidth > 768 && !isIOS);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [className]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        // Clip le contenu fixe à la zone du composant
        ...(useParallax ? { clipPath: 'inset(0)' } : {}),
        ...style,
      }}
    >
      <div
        className="absolute inset-0"
        style={useParallax ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' } : {}}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          quality={80}
          className="object-cover"
        />
      </div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default MobileBackgroundImage;
