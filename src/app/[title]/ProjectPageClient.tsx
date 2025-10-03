"use client";

import React, { useState } from 'react';
import { Projects } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import NavbarFixed from '@/app/components/NavbarFixed';
import Footer from '@/app/components/Footer';

interface ProjectPageClientProps {
  project: Projects | undefined;
  slug: string;
}

const ProjectPageClient = ({ project, slug }: ProjectPageClientProps) => {
  const [current, setCurrent] = useState(0);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <NavbarFixed />
        <main className="container mx-auto py-24 px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[80vh] flex items-center justify-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">Projet non trouvé</h1>
              <p className="text-gray-700 mb-6">Le projet que vous recherchez est introuvable ou n&apos;existe pas.</p>
              <Link
                href="/#realisations"
                className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
              >
                Retour à la liste des trophées
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images: string[] = Array.isArray(project.imageProject)
    ? project.imageProject
    : project.imageProject
    ? [project.imageProject]
    : [];

  const length = images.length;

  const prev = () => setCurrent((c) => (c - 1 + length) % length);
  const next = () => setCurrent((c) => (c + 1) % length);

  // JSON-LD pour le projet spécifique
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "creator": {
      "@type": "Person",
      "name": "Adrian Bauduin",
      "jobTitle": "Ébéniste",
      "url": "https://portfolio-adrianbauduin.vercel.app"
    },
    "dateCreated": `${project.year}-01-01`,
    "material": project.materials?.join(', '),
    "artMedium": project.techniques?.join(', '),
    "image": images.map(img => `https://portfolio-adrianbauduin.vercel.app${img}`),
    "mainEntityOfPage": `https://portfolio-adrianbauduin.vercel.app/${slug}`
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <NavbarFixed />
      <div className="container flex flex-col justify-center items-center mx-auto py-34 md:py-30 sm:py-30">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Left: big image */}
          <div className="lg:w-1/2 w-full h-96 lg:h-[80vh] relative bg-gray-200">
            {length > 0 ? (
              <>
                <Image
                  src={images[current]}
                  alt={`${project.title || project.project} - Image ${current + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  priority
                />

                {/* Left arrow */}
                <button
                  onClick={prev}
                  aria-label="Image précédente"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md cursor-pointer"
                >
                  ‹
                </button>

                {/* Right arrow */}
                <button
                  onClick={next}
                  aria-label="Image suivante"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md cursor-pointer"
                >
                  ›
                </button>

                {/* simple counter */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-black/50 text-white text-sm px-3 py-1 rounded">
                  {current + 1} / {length}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Aucune image</div>
            )}
          </div>

          {/* Right: attributes and overview */}
          <div className="lg:w-1/2 w-full p-10">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold mb-6">{project.title}</h1>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-4">
              <div>
                <div className="text-sm text-gray-600">Client:</div>
                <div className="flex flex-col items-center mt-2">
                  {project.imagePartner && (
                    <Image
                      src={project.imagePartner}
                      alt={`Logo ${project.partenaires?.join(', ')}`}
                      width={100}
                      height={100}
                      className="rounded-xl mr-4 p-4"
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Année:</div>
                <div className="text-xl font-semibold mt-2 flex items-center justify-center h-full">
                  {project.year || '-'}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Projet:</div>
                <div className="text-xl font-semibold mt-2 flex items-center justify-center h-full">
                  {project.project || project.title}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium mb-4">Description:</h2>
              <p className="text-base text-gray-800">{project.description}</p>
            </div>

            {/* Optional extra details */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-gray-600 font-medium">Matériaux</h3>
                <div className="mt-2">{project.materials?.join(', ') || '-'}</div>
              </div>

              <div>
                <h3 className="text-sm text-gray-600 font-medium">Techniques</h3>
                <div className="mt-2">{project.techniques?.join(', ') || '-'}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-8">
              {project.githubLink && (
                <Link
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-lg text-blue-500 hover:underline"
                >
                  <FaGithub className="mr-2" />
                  GitHub
                </Link>
              )}
              {project.demoLink && (
                <Link
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-lg text-green-500 hover:underline"
                >
                  <FiExternalLink className="mr-2" />
                  Démo
                </Link>
              )}
            </div>
          </div>
        </div>
        <Link
          href="/#realisations"
          className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-8 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
        >
          Retour aux autres réalisations
        </Link>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProjectPageClient;