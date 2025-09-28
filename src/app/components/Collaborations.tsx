"use client";

import { projects } from '@/contents/projects';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';

const Collaborations: React.FC = () => {
  const [animationSpeed, setAnimationSpeed] = useState(30);
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
      const newSpeed = window.innerWidth > 1200 ? 30 : 
                        window.innerWidth > 768 ? 25 : 20;
      setAnimationSpeed(newSpeed);
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
    <section id='collaborations' className="bg-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Mes Collaborations</h2>
        
        {/* Animated logos row */}
        <div 
          className="relative w-full overflow-hidden mb-12 h-28 bg-gray-50 rounded-lg p-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={logoRowRef}
            className="flex items-center absolute whitespace-nowrap"
            style={{
              animation: `scrollLeftToRight ${animationSpeed}s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
              display: 'flex',
              gap: '4rem'
            }}
          >
            {/* Duplicate logos array to create a seamless loop effect */}
            {[...uniquePartnerLogos, ...uniquePartnerLogos].map((logo, index) => (
              <div 
                key={index} 
                className="w-32 h-20 relative flex-shrink-0 cursor-pointer"
                onMouseEnter={() => handleLogoHover(true)}
                onMouseLeave={() => handleLogoHover(false)}
              >
                <Image
                  src={logo}
                  alt={`Partner logo ${index + 1}`}
                  layout="fill"
                  objectFit="contain"
                  className="transition-transform duration-300 hover:scale-125"
                />
              </div>
            ))}
          </div>
        </div>
        
        
      </div>
    </section>
  );
};

export default Collaborations;
