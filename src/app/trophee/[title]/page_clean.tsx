import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavbarFixed from '@/app/components/NavbarFixed';
import Footer from '@/app/components/Footer';
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
        
        <main className="container mx-auto py-34 md:py-30 sm:py-30">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
            <section className="lg:w-1/2 w-full h-96 lg:h-[70vh] relative bg-gray-200">
              {images.length > 0 ? (
                <ImageCarousel images={images} projectTitle={project.title} project={legacyProject} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
              )}
            </section>

            <section className="lg:w-1/2 w-full p-10">
              <header className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-4">
                <div>
                  <h3 className="text-sm text-gray-600">Client:</h3>
                  <div className="flex flex-col items-center mt-2">
                    {project.clientLogo && (
                      <Image
                        src={project.clientLogo}
                        alt={`Logo ${project.client || 'client'}`}
                        width={100}
                        height={100}
                        className="rounded-xl mr-4 p-4"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600">Année:</h3>
                  <div className="text-xl font-semibold mt-2 flex items-center justify-center h-full">
                    <time dateTime={project.year?.toString()}>{project.year || '-'}</time>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600">Projet:</h3>
                  <div className="text-xl font-semibold mt-2 flex items-center justify-center h-full">
                    <h1 className="text-center">{project.title}</h1>
                  </div>
                </div>
              </header>

              <section className="mt-6">
                <h2 className="text-lg font-medium mb-4">Description:</h2>
                <p className="text-base text-gray-800">{project.description}</p>
              </section>

              <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-gray-600">Matériaux</h3>
                  <div className="mt-2">
                    {project.materials ? (
                      <div className="text-sm">{project.materials}</div>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600">Techniques</h3>
                  <div className="mt-2">
                    {project.techniques ? (
                      <div className="text-sm">{project.techniques}</div>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
              </section>
            </section>
          </article>
          
          <nav className="flex justify-center px-4 sm:px-6 md:px-8 pt-8">
            <Link
              href="/#realisations"
              className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 uppercase text-sm md:text-lg font-semibold tracking-widest text-center mx-auto mb-10 w-full max-w-xs sm:max-w-sm md:max-w-md"
            > 
              Retour aux autres réalisations
            </Link>
          </nav>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TropheePage;