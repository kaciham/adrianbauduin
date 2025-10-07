"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  projectTitle: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, projectTitle }) => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const prev = () => setCurrent((c) => (c - 1 + length) % length);
  const next = () => setCurrent((c) => (c + 1) % length);

  if (length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No image
      </div>
    );
  }

  return (
    <>
      <Image
        src={images[current]}
        alt={`${projectTitle} - ${images[current].split('/').pop()?.split('.')[0] || `Image ${current + 1}`}`}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority
      />

      {/* Left arrow */}
      <button
        onClick={prev}
        aria-label="Précédent"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md cursor-pointer"
      >
        ‹
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        aria-label="Suivant"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md cursor-pointer"
      >
        ›
      </button>

      {/* simple counter */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-black/50 text-white text-sm px-3 py-1 rounded">
        {current + 1} / {length}
      </div>
    </>
  );
};

export default ImageCarousel;