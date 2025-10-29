"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { generateImageAlt, generateImageTitle } from '@/utils/seo';

interface ImageCarouselProps {
  images: string[];
  projectTitle: string;
  project?: {
    title?: string;
    project?: string;
    materials?: string[];
    techniques?: string[];
    year?: number;
    client?: string;
  };
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, projectTitle, project }) => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const prev = () => setCurrent((c) => (c - 1 + length) % length);
  const next = () => setCurrent((c) => (c + 1) % length);

  if (length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500" role="img" aria-label="Aucune image disponible">
        No image
      </div>
    );
  }

  const projectData = project || { title: projectTitle };

  // Generate enhanced SEO-optimized alt text for current image
  const generateEnhancedAlt = (index: number): string => {
    const materials = projectData.materials?.join(' et ') || 'bois';
    const baseTitle = projectData.title || projectData.project || projectTitle;
    const year = projectData.year ? ` ${projectData.year}` : '';
    const client = projectData.client ? ` pour ${projectData.client}` : '';
    
    if (index === 0) {
      return `Trophée ${baseTitle} en ${materials}${year} - Création artisanale par Adrian Bauduin, ébéniste à Lille${client}`;
    } else {
      const views = ['détail du fini', 'vue d\'ensemble', 'détail technique', 'angle alternatif'];
      const viewType = views[index % views.length] || `vue ${index + 1}`;
      return `${baseTitle} - ${viewType} - Artisanat en ${materials} par Adrian Bauduin`;
    }
  };

  // Generate structured data for the current image
  const generateImageStructuredData = (imageUrl: string, index: number) => {
    return {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "url": imageUrl,
      "name": generateEnhancedAlt(index),
      "description": `Image ${index + 1} du trophée ${projectData.title || projectTitle} créé par Adrian Bauduin`,
      "creator": {
        "@type": "Person",
        "name": "Adrian Bauduin"
      },
      "copyrightHolder": {
        "@type": "Person", 
        "name": "Adrian Bauduin"
      },
      "license": "https://creativecommons.org/licenses/by-nc-nd/4.0/",
      "acquireLicensePage": "https://adrianbauduin.com/contact",
      "creditText": "Adrian Bauduin - Ébéniste créateur",
      "width": "800",
      "height": "600",
      "encodingFormat": "image/webp"
    };
  };

  return (
    <>
      {/* Add structured data for the current image */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateImageStructuredData(images[current], current))
        }}
      />
      
      <div className="relative w-full h-full" role="region" aria-label={`Galerie de ${projectTitle}`}>
        <Image
          src={images[current]}
          alt={generateEnhancedAlt(current)}
          title={`${projectData.title || projectTitle} - Image ${current + 1} sur ${length} - Adrian Bauduin Ébéniste`}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
          priority={current === 0}
          loading={current === 0 ? 'eager' : 'lazy'}
          quality={90}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />

      {length > 1 && (
        <>
          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label={`Image précédente (${current} sur ${length})`}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md cursor-pointer z-10 transition-all duration-200"
            type="button"
          >
            <span aria-hidden="true">‹</span>
          </button>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label={`Image suivante (${current + 2} sur ${length})`}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md cursor-pointer z-10 transition-all duration-200"
            type="button"
          >
            <span aria-hidden="true">›</span>
          </button>

          {/* Image counter with accessibility */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-black/50 text-white text-sm px-3 py-1 rounded"
            role="status"
            aria-live="polite"
            aria-label={`Image ${current + 1} sur ${length}`}
          >
            {current + 1} / {length}
          </div>

          {/* Dot indicators for better UX */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === current ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default ImageCarousel;