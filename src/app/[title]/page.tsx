"use client";

import React, { useState } from 'react';
import { projects } from '@/contents/projects';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import NavbarFixed from '@/app/components/NavbarFixed';
import Footer from '@/app/components/Footer';


const ProjectPage = ({ params }: { params: Promise<{ title: string }> | { title: string } }) => {
  // Next.js may provide params as a Promise in newer versions; unwrap with React.use()
  // React.use will resolve the promise at render time in server components, but
  // since this is a client component we call React.use to unwrap any potential promise.
  // Accept either a plain object or a Promise for compatibility.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unwrappedParams = (React as any).use ? (React as any).use(params) : params;

  const title = typeof unwrappedParams === 'object' && unwrappedParams !== null ? (unwrappedParams.title as string) : String(unwrappedParams);

  const project = projects.find((p) => p.slug === title);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <NavbarFixed />
        <main className="container mx-auto py-24 px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[80vh] flex items-center justify-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Projet non trouvé</h1>
          <p className="text-gray-700 mb-6">Le projet que vous recherchez est introuvable ou n'existe pas.</p>
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

  // ensure we have an array of image paths
  const images: string[] = Array.isArray(project.imageProject)
    ? project.imageProject
    : project.imageProject
    ? [project.imageProject]
    : [];

  const [current, setCurrent] = useState(0);
  const length = images.length;

  const prev = () => setCurrent((c) => (c - 1 + length) % length);
  const next = () => setCurrent((c) => (c + 1) % length);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <NavbarFixed />
      <div className="container flex flex-col justify-center items-center mx-auto py-34  md:py-30  sm:py-30">
      
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Left: big image */}
          <div className="lg:w-1/2 w-full h-96 lg:h-[80vh] relative bg-gray-200">
            {length > 0 ? (
              <>
                <Image
                  src={images[current]}
                  alt={`${project.title || project.project} - ${current + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(min-width: 1024px) 80vw, 100vw"
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
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-black/50 text-white text-sm px-3 py-1 rounded">{current + 1} / {length}</div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
            )}
            
          </div>

          {/* Right: attributes and overview */}
          <div className="lg:w-1/2 w-full p-10">
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
                  {/* <div className="text-xl font-semibold">{project.partenaires?.join(', ') || '-'}</div> */}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Année:</div>
                <div className="text-xl font-semibold mt-2 flex items-center justify-center h-full">{project.year || '-'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Projet:</div>
                <div className="text-xl font-semibold mt-2 flex items-center justify-center h-full">{project.project || project.title}</div>
              </div>
            </div>
{/* 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-sm text-gray-600">Scope:</div>
                <div className="text-xl font-semibold mt-2">{project.techniques?.slice(0, 3).join(', ') || '-'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600">&nbsp;</div>
                <div className="text-xl font-semibold mt-2">&nbsp;</div>
              </div>
            </div> */}

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Description:</h3>
              <p className="text-base text-gray-800">{project.description}</p>
            </div>

            {/* Optional extra details */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600">Matériaux</div>
                <div className="mt-2">{project.materials?.join(', ') || '-'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Techniques</div>
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

export default ProjectPage;