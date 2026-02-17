'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { DatabaseProject } from '@/types';

const MAX_DESC_LENGTH = 60;

export default function ProjectCard({ project }: { project: DatabaseProject }) {
  const [expanded, setExpanded] = useState(false);
  const shortDesc = project.description.length > MAX_DESC_LENGTH && !expanded
    ? project.description.slice(0, MAX_DESC_LENGTH) + '...'
    : project.description;

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(true);
  };

  return (
    <Link href={`/trophee/${project.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform hover:scale-105 cursor-pointer">
        <div className="relative w-full h-80">
          <Image
            src={project.images && project.images.length > 0 ? project.images[0] : '/placeholder-image.svg'}
            alt={`${project.title} - ${project.client || 'trophée sur mesure'}`}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-gray-900 text-lg font-semibold mb-2">{project.title}</h3>
          <p className="text-gray-900 mb-2">
            {shortDesc}
            {project.description.length > MAX_DESC_LENGTH && !expanded && (
              <button
                className="text-gray-900 underline ml-2 text-sm cursor-pointer"
                type="button"
                onClick={handleReadMoreClick}
              >
                Lire plus ...
              </button>
            )}
          </p>
          {/* <div className="text-sm text-gray-900 mb-1"><span className="font-bold">Année:</span> {project.year}</div>
          <div className="text-sm text-gray-900 mb-1"><span className="font-bold">Matériaux:</span> {project.materials}</div>
          <div className="text-sm text-gray-900 mb-1"><span className="font-bold">Techniques:</span> {project.techniques}</div>
          <div className="text-sm text-gray-900 mb-1"><span className="font-bold">Partenaires:</span> {project.client}</div> */}
        </div>
      </div>
    </Link>
  );
}
