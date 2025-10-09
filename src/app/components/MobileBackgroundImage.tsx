"use client";

import React, { ReactNode, useEffect, useState } from 'react';

interface MobileBackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}

const MobileBackgroundImage: React.FC<MobileBackgroundImageProps> = ({
  src,
  alt,
  className = "",
  children,
  style = {}
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Detect iOS devices
    const checkIOS = () => {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
    };

    checkMobile();
    checkIOS();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const combinedStyle: React.CSSProperties = {
    backgroundImage: `url('${src}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // On iOS or mobile, always use scroll; on desktop, allow fixed if requested
    backgroundAttachment: (isMobile || isIOS) ? 'scroll' : 
      (className.includes('bg-fixed') && !isMobile) ? 'fixed' : 'scroll',
    // Optimize for iOS Safari
    ...(isIOS && {
      WebkitBackfaceVisibility: 'hidden' as any,
      WebkitTransform: 'translate3d(0, 0, 0)' as any,
      transform: 'translate3d(0, 0, 0)',
    }),
    ...style
  };

  return (  
    <div 
      className={className}
      style={combinedStyle}
      role={alt ? "img" : undefined}
      aria-label={alt}
    >
      {children}
    </div>
  );
};

export default MobileBackgroundImage;