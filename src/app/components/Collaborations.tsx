"use client";

import { projects } from '@/contents/projects';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';

const Collaborations: React.FC = () => {
  const [animationSpeed, setAnimationSpeed] = useState<number>(40);
  const [isPaused, setIsPaused] = useState(false);
  const logoRowRef = useRef<HTMLDivElement>(null);
  
  // Get unique partners - some projects share the same partner (like CIC Nord Ouest)
  const uniquePartnerLogos = Array.from(new Set(projects.map(project => project.imagePartner)))
    .filter(Boolean) as string[];
  
  // Group projects by partner for quick reference
  const projectsByPartner: Record<string, typeof projects> = {};
  projects.forEach(project => {
    if (project.imagePartner) {
      if (!projectsByPartner[project.imagePartner]) {
        projectsByPartner[project.imagePartner] = [];
      }
      projectsByPartner[project.imagePartner].push(project);
    }
  });
    
  useEffect(() => {
    // Adjust animation speed based on screen width for responsive behavior
    const handleResize = () => {
      // Calculate speed based on content width for smoother scrolling
      const contentWidth = logoRowRef.current?.scrollWidth || 0;
      const viewportWidth = window.innerWidth;
      
      // Base speed calculation - adjust the divisor for faster/slower scrolling
      // For a typical viewport, we want the animation to take about 30 seconds
      const baseSpeed = window.innerWidth > 1200 ? 30 : 
                        window.innerWidth > 768 ? 25 : 20;
      
      setAnimationSpeed(baseSpeed);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Function to handle logo hover
  const handleLogoHover = (isHovering: boolean) => {
    setIsPaused(isHovering);
  };

  return (
    <section id='collaborations' className="bg-white">
      <div className="container mx-auto text-center py-4">
        <h2 className="text-3xl md:text-6xl font-bold mb-16 text-gray-900">Partenaires</h2>
        
        {/* Animated logos row */}
        <div 
          className="relative w-full overflow-hidden mb-12 h-28 bg-gray-50 rounded-lg p-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ position: 'relative' }}
        >
          <div 
            ref={logoRowRef}
            className="flex items-center absolute whitespace-nowrap"
            style={{
              animation: `scrollLeftToRight ${animationSpeed}s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
              display: 'flex',
              gap: '4rem',
              width: 'max-content'
            }}
          >
            {/* First set of logos */}
            {uniquePartnerLogos.map((logo, index) => {
              // Find the first project for this partner
              const partnerProject = projectsByPartner[logo]?.[0];
              return (
                <div 
                  key={index} 
                  className="w-32 h-20 relative flex-shrink-0 cursor-pointer"
                  onMouseEnter={() => handleLogoHover(true)}
                  onMouseLeave={() => handleLogoHover(false)}
                >
                  {partnerProject ? (
                    <Link href={`/${partnerProject.slug}`}>
                      <Image
                        src={logo}
                        alt={`Partner logo ${index + 1}`}
                        layout="fill"
                        objectFit="contain"
                        className="transition-transform duration-500 hover:scale-125"
                      />
                    </Link>
                  ) : (
                    <Image
                      src={logo}
                      alt={`Partner logo ${index + 1}`}
                      layout="fill"
                      objectFit="contain"
                      className="transition-transform duration-500 hover:scale-125"
                    />
                  )}
                </div>
              );
            })}

            {/* Second set of identical logos for seamless looping */}
            {uniquePartnerLogos.map((logo, index) => {
              // Find the first project for this partner
              const partnerProject = projectsByPartner[logo]?.[0];
              return (
                <div 
                  key={`second-${index}`} 
                  className="w-32 h-20 relative flex-shrink-0 cursor-pointer"
                  onMouseEnter={() => handleLogoHover(true)}
                  onMouseLeave={() => handleLogoHover(false)}
                >
                  {partnerProject ? (
                    <Link href={`/${partnerProject.slug}`}>
                      <Image
                        src={logo}
                        alt={`Partner logo ${index + 1}`}
                        layout="fill"
                        objectFit="contain"
                        className="transition-transform duration-500 hover:scale-125"
                      />
                    </Link>
                  ) : (
                    <Image
                      src={logo}
                      alt={`Partner logo ${index + 1}`}
                      layout="fill"
                      objectFit="contain"
                      className="transition-transform duration-500 hover:scale-125"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        
      </div>
    </section>
  );
};

export default Collaborations;
