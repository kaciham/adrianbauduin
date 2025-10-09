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

  return (
    <div className="relative w-full h-full" role="region" aria-label={`Galerie de ${projectTitle}`}>
      <Image
        src={images[current]}
        alt={generateImageAlt(projectData, current)}
        title={generateImageTitle(projectData)}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
        priority={current === 0}
        loading={current === 0 ? 'eager' : 'lazy'}
        quality={90}
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
  );
};

export default ImageCarousel;