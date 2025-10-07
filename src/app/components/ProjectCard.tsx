'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { projects } from '@/contents/projects';

const MAX_DESC_LENGTH = 60;

export default function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [expanded, setExpanded] = useState(false);
  const shortDesc = project.description.length > MAX_DESC_LENGTH && !expanded
    ? project.description.slice(0, MAX_DESC_LENGTH) + '...'
    : project.description;

  return (
    <Link href={`/${project.slug}`}>
      <div className="bg-white  rounded-lg shadow-xl overflow-hidden transform transition-transform hover:scale-102 cursor-pointer">
        <div className="relative w-full h-80">
          <Image
            src={Array.isArray(project.imageProject) ? project.imageProject[0] : project.imageProject}
            alt={project.slug}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
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
                onClick={e => {
                  e.preventDefault();
                  setExpanded(true);
                }}
              >
                Lire plus ...
              </button>
            )}
          </p>
          {/* <div className="text-sm text-gray-900 mb-1"><span className="font-bold">Année:</span> {project.year}</div>
          <div className="text-sm text-gray-900 mb-1"><span className="font-bold">Matériaux:</span> {project.materials?.join(', ')}</div>
          <div className="text-sm text-gray-900 mb-1"><span className="font-bold">Techniques:</span> {project.techniques?.join(', ')}</div>
          <div className="text-sm text-gray-900 mb-1"><span className="font-bold">Partenaires:</span> {project.partenaires?.join(', ')}</div> */}
        </div>
      </div>
    </Link>
  );
}
