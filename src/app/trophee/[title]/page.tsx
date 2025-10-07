import React from 'react';
import { projects } from '@/contents/projects';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import NavbarFixed from '@/app/components/NavbarFixed';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ImageCarousel from '../../components/ImageCarousel';

interface Props {
  params: Promise<{ title: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title } = await params;
  const project = projects.find((p) => p.slug === title);

  if (!project) {
    return {
      title: 'Projet non trouvé - Adrian Bauduin',
      description: 'Le projet que vous recherchez est introuvable.',
    };
  }

  const image = Array.isArray(project.imageProject) ? project.imageProject[0] : project.imageProject;
  const materials = project.materials?.join(', ') || '';
  const techniques = project.techniques?.join(', ') || '';

  return {
    title: `${project.title} - Trophée en bois sur mesure - Adrian Bauduin`,
    description: `${project.description.slice(0, 150)}... Création artisanale en ${materials} réalisée en ${project.year} par Adrian Bauduin, ébéniste dans les Hauts-de-France.`,
    keywords: [
      `trophée ${project.title}`,
      `trophée bois sur mesure`,
      'ébéniste créateur Lille',
      'trophée personnalisé Nord',
      'création artisanale bois',
      materials,
      techniques
    ].filter(Boolean).join(', '),
    openGraph: {
      title: `${project.title} - Trophée en bois sur mesure`,
      description: project.description.slice(0, 200),
      images: image ? [image] : [],
      url: `https://adrianbauduin.com/${project.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - Trophée sur mesure`,
      description: project.description.slice(0, 200),
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `https://adrianbauduin.com/${project.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    title: project.slug,
  }));
}


const TropheePage = async ({ params }: Props) => {
  const { title } = await params;
  const project = projects.find((p) => p.slug === title);

  if (!project) {
    notFound();
  }

  // ensure we have an array of image paths
  const images: string[] = Array.isArray(project.imageProject)
    ? project.imageProject
    : project.imageProject
    ? [project.imageProject]
    : [];

  // Generate structured data for SEO
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "creator": {
      "@type": "Person",
      "name": "Adrian Bauduin"
    },
    "material": project.materials?.join(', '),
    "dateCreated": project.year?.toString(),
    "image": images[0] || '',
    "url": `https://adrianbauduin.com/${project.slug}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <NavbarFixed />
        
        <div className="flex justify-center px-4 sm:px-6 md:px-8 pt-8">
          <Link
            href="/#realisations"
            className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 uppercase text-sm md:text-lg font-semibold tracking-widest text-center mx-auto mb-10 w-full max-w-xs sm:max-w-sm md:max-w-md"
          > 
            Réalisations
          </Link>
        </div>
        
        <div className="container mx-auto py-34  md:py-30  sm:py-30">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
            {/* Left: big image */}
            <div className="lg:w-1/2 w-full h-96 lg:h-[70vh] relative bg-gray-200">
              {images.length > 0 ? (
                <ImageCarousel images={images} projectTitle={project.title} />
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
                        alt={`Logo ${project.partenaires?.[0] || 'client'}`}
                        width={100}
                        height={100}
                        className="rounded-xl mr-4 p-4"
                      />
                    )}
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

              <div className="mt-6">
                <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
                <h2 className="text-lg font-medium mb-4">Description:</h2>
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
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TropheePage;