import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavbarFixed from '@/app/components/NavbarFixed';
import Footer from '@/app/components/Footer';
import ProjectStats from '@/app/components/ProjectStats';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ImageCarousel from '../../components/ImageCarousel';
import { generateProjectSEO } from '@/utils/projectSeoGenerator';
import { DatabaseProject } from '@/types';

interface Props {
  params: Promise<{ title: string }>;
}

async function getProject(slug: string): Promise<DatabaseProject | null> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://adrianbauduin.com' 
      : 'http://localhost:3000';
      
    const response = await fetch(`${baseUrl}/api/projects/slug/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.project : null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

function convertToLegacyFormat(project: DatabaseProject) {
  return {
    title: project.title,
    slug: project.slug,
    description: project.description,
    year: project.year,
    materials: project.materials ? project.materials.split(', ').map(m => m.trim()) : [],
    techniques: project.techniques ? project.techniques.split(', ').map(t => t.trim()) : [],
    technologies: project.technologies ? project.technologies.split(', ').map(t => t.trim()) : [],
    partenaires: project.client ? [project.client] : [],
    imageProject: project.images,
    imagePartner: project.clientLogo
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title } = await params;
  const project = await getProject(title);

  if (!project) {
    return {
      title: 'Projet non trouvé - Adrian Bauduin',
      description: 'Le projet que vous recherchez est introuvable.',
      robots: { index: false, follow: false },
    };
  }

  const seoData = generateProjectSEO(project);
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords.join(', '),
    openGraph: {
      title: seoData.openGraph.title,
      description: seoData.openGraph.description,
      url: seoData.canonical,
      type: 'article' as const,
      images: seoData.openGraph.images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
      })),
    },
    alternates: { canonical: seoData.canonical },
  };
}

export async function generateStaticParams(): Promise<{ title: string }[]> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://adrianbauduin.com' 
      : 'http://localhost:3000';
      
    const response = await fetch(`${baseUrl}/api/projects?limit=100`, {
      next: { revalidate: 0 }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.success || !data.projects) return [];
    
    return data.projects.map((project: DatabaseProject) => ({
      title: project.slug,
    }));
  } catch (error) {
    return [];
  }
}

const TropheePage = async ({ params }: Props) => {
  const { title } = await params;
  const project = await getProject(title);

  if (!project) {
    notFound();
  }

  const legacyProject = convertToLegacyFormat(project);
  const images: string[] = project.images || [];
  const seoData = generateProjectSEO(project);
  
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      seoData.structuredData.product,
      seoData.structuredData.article,
      seoData.structuredData.breadcrumb
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <NavbarFixed />
        
        <main className="container mx-auto py-24 md:py-28 px-4 sm:px-16 lg:px-8">
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden lg:flex">
            {/* Image Section */}
            <section className="lg:w-1/2 w-full h-96 lg:h-[70vh] relative bg-gradient-to-br from-gray-100 to-gray-200">
              {images.length > 0 ? (
                <ImageCarousel images={images} projectTitle={project.title} project={legacyProject} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">Aucune image disponible</p>
                  </div>
                </div>
              )}
            </section>

            {/* Content Section */}

            <section className="lg:w-1/2 w-full p-6 lg:p-12">
              <header className="mb-8">
                {/* Project Title */}
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {project.title}
                  </h1>
                  {project.client && (
                    <p className="text-lg text-gray-600 font-medium">
                      Créé pour {project.client}
                    </p>
                  )}
                </div>

                {/* Project Metadata */}
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
                  {project.clientLogo && (
                    <div className="flex flex-col items-center">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                        Client
                      </h3>
                      <div className="w-20 h-20 relative">
                        <Image
                          src={project.clientLogo}
                          alt={`Logo ${project.client || 'client'}`}
                          fill
                          className="object-contain rounded-lg"
                          loading="lazy"

                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                      Année
                    </h3>
                    <time 
                      dateTime={project.year?.toString()} 
                      className="text-2xl font-bold text-gray-900"
                    >
                      {project.year || '-'}
                    </time>
                  </div>

                  {/* <div className="flex flex-col items-center col-span-2 lg:col-span-1">
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                      Type
                    </h3>
                    <span className="text-lg font-semibold text-gray-900 text-center">
                      Trophée sur mesure
                    </span>
                  </div> */}
                </div>
              </header>

              {/* Project Description */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                  Description du projet
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-base leading-relaxed text-gray-700 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    {project.description}
                  </p>
                </div>
              </section>

              {/* Technical Specifications */}
              <section className="mt-8" aria-label="Spécifications techniques">
                <h2 className="text-lg font-medium mb-6 text-gray-800 border-b border-gray-200 pb-2">
                  Spécifications techniques
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Matériaux
                    </h3>
                    <div className="text-sm text-gray-800">
                      {project.materials ? (
                        <span className="font-medium">{project.materials}</span>
                      ) : (
                        <span className="text-gray-500 italic">Non spécifié</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Techniques
                    </h3>
                    <div className="text-sm text-gray-800">
                      {project.techniques ? (
                        <span className="font-medium">{project.techniques}</span>
                      ) : (
                        <span className="text-gray-500 italic">Non spécifié</span>
                      )}
                    </div>
                  </div>

                  {project.technologies && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Technologies
                      </h3>
                      <div className="text-sm text-gray-800">
                        <span className="font-medium">{project.technologies}</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Tags Section */}
              {project.tags && project.tags.length > 0 && (
                <section className="mt-8" aria-label="Tags du projet">
                  <h2 className="text-lg font-medium mb-4 text-gray-800">
                    Catégories
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Project Statistics */}
              {/* <section className="mt-8" aria-label="Statistiques du projet">
                <ProjectStats project={project} />
              </section> */}
            </section>
          </article>
          
          {/* Navigation */}
          <nav className="mt-12 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <Link href="/#realisations" className="hover:text-gray-900 transition-colors">
                Réalisations
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{project.title}</span>
            </div>
            
            {/* Back to projects button */}
            <div className="flex justify-center">
              <Link
                href="/#realisations"
                className="inline-flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 space-x-2"
              > 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Retour aux réalisations</span>
              </Link>
            </div>
          </nav>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TropheePage;