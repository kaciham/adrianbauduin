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
import { generateRichKeywords, generateOptimizedDescription, generateBreadcrumbSchema } from '@/utils/seo';

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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const image = Array.isArray(project.imageProject) ? project.imageProject[0] : project.imageProject;
  const materials = project.materials?.join(', ') || '';
  const techniques = project.techniques?.join(', ') || '';
  const partenaires = project.partenaires?.join(', ') || '';
  
  // Enhanced SEO description using utility
  const enhancedDescription = generateOptimizedDescription(project, 160);
  
  // Rich keywords array with long-tail variations using utility
  const richKeywords = generateRichKeywords(project);

  // Full-sized images for better social sharing
  const fullImageUrl = image ? `https://adrianbauduin.com${image}` : '';
  
  return {
    title: `${project.title} - Trophée en bois sur mesure par Adrian Bauduin | Ébéniste Lille`,
    description: enhancedDescription,
    keywords: richKeywords.join(', '),
    authors: [{ name: 'Adrian Bauduin', url: 'https://adrianbauduin.com' }],
    creator: 'Adrian Bauduin',
    publisher: 'Adrian Bauduin - Ébéniste',
    category: 'Artisanat et Design',
    openGraph: {
      title: `${project.title} - Trophée en bois sur mesure`,
      description: enhancedDescription.slice(0, 200),
      url: `https://adrianbauduin.com/trophee/${project.slug}`,
      siteName: 'Adrian Bauduin - Trophées en bois sur mesure',
      locale: 'fr_FR',
      type: 'article',
      publishedTime: `${project.year}-12-31T12:00:00.000Z`,
      modifiedTime: new Date().toISOString(),
      section: 'Trophées et Récompenses',
      tags: richKeywords.slice(0, 10),
      images: fullImageUrl ? [{
        url: fullImageUrl,
        width: 1200,
        height: 630,
        alt: `Trophée ${project.title} en ${materials} - Création artisanale Adrian Bauduin`,
        type: 'image/webp',
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@adrianbauduin',
      creator: '@adrianbauduin',
      title: `${project.title} - Trophée bois sur mesure`,
      description: enhancedDescription.slice(0, 200),
      images: fullImageUrl ? [{
        url: fullImageUrl,
        alt: `Trophée ${project.title} - Artisanat bois Adrian Bauduin`,
      }] : [],
    },
    alternates: {
      canonical: `https://adrianbauduin.com/trophee/${project.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'googlea4bfe6b54e36b8db',
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

  // Enhanced structured data for better SEO
  const baseUrl = 'https://adrianbauduin.com';
  const fullImageUrl = images[0] ? `${baseUrl}${images[0]}` : '';
  
  // Primary Creative Work Schema
  const creativeworkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
  "@id": `${baseUrl}/trophee/${project.slug}#creativework`,
    "name": project.title,
    "description": project.description,
    "creator": {
      "@type": "Person",
      "name": "Adrian Bauduin",
      "jobTitle": "Ébéniste créateur",
      "url": baseUrl,
      "sameAs": [
        "https://www.linkedin.com/in/adrian-bauduin-1b152b220/",
        "https://www.instagram.com/adrianbauduin/"
      ]
    },
    "material": project.materials?.join(', '),
    "artMedium": "Bois massif",
    "artworkSurface": project.techniques?.join(', '),
    "dateCreated": project.year?.toString(),
    "image": {
      "@type": "ImageObject",
      "url": fullImageUrl,
      "caption": `Trophée ${project.title} en ${project.materials?.join(' et ') || 'bois'} - Adrian Bauduin`,
      "width": 1200,
      "height": 630
    },
  "url": `${baseUrl}/trophee/${project.slug}`,
  "mainEntityOfPage": `${baseUrl}/trophee/${project.slug}`,
    "genre": "Artisanat d'art",
    "keywords": [
      "trophée bois sur mesure",
      "ébénisterie artisanale",
      "création personnalisée",
      project.materials?.join(', ')
    ].filter(Boolean).join(', '),
    "locationCreated": {
      "@type": "Place",
      "name": "Atelier Adrian Bauduin",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lille",
        "addressRegion": "Hauts-de-France",
        "addressCountry": "FR"
      }
    }
  };

  // Product Schema for commercial aspect
  // Build offers only when a price is available to avoid Search Console errors
  const offers = project.price
    ? {
        "@type": "Offer",
        "price": typeof project.price === 'number' ? project.price.toString() : project.price,
        "priceCurrency": project.priceCurrency || 'EUR',
        "availability": "https://schema.org/PreOrder",
        "description": "Trophée sur mesure - Devis personnalisé",
        "url": `${baseUrl}/devis`,
        "seller": {
          "@type": "Organization",
          "name": "Adrian Bauduin - Ébéniste"
        }
      }
    : undefined;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/trophee/${project.slug}#product`,
    "name": `Trophée ${project.title}`,
    "description": `Trophée personnalisé en ${project.materials?.join(' et ') || 'bois'} créé sur mesure par Adrian Bauduin`,
    "category": "Trophées et récompenses artisanales",
    "brand": {
      "@type": "Brand",
      "name": "Adrian Bauduin"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Adrian Bauduin - Ébéniste",
      "url": baseUrl
    },
    "material": project.materials?.join(', '),
    "image": fullImageUrl,
    // only include offers when defined
    ...(offers ? { offers } : {}),
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Techniques utilisées",
        "value": project.techniques?.join(', ')
      },
      {
        "@type": "PropertyValue", 
        "name": "Année de création",
        "value": project.year?.toString()
      },
      {
        "@type": "PropertyValue",
        "name": "Client",
        "value": project.partenaires?.join(', ')
      }
    ].filter(prop => prop.value)
  };

  // Article Schema for content aspect
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
  "@id": `${baseUrl}/trophee/${project.slug}#article`,
    "headline": `${project.title} - Trophée en bois sur mesure`,
    "description": project.description,
    "image": fullImageUrl,
    "datePublished": `${project.year}-12-31T12:00:00.000Z`,
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": "Adrian Bauduin",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Adrian Bauduin - Ébéniste",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/projects/logo_adrian_bauduin_blanc.svg`
      }
    },
  "mainEntityOfPage": `${baseUrl}/trophee/${project.slug}`,
    "articleSection": "Portfolio",
    "keywords": [
      "trophée bois",
      "ébénisterie",
      "artisanat",
      "Lille",
      "Hauts-de-France",
      project.materials?.join(', ')
    ].filter(Boolean).join(', ')
  };

  // Combine schemas with proper graph structure including breadcrumbs
  const breadcrumbSchema = generateBreadcrumbSchema(project);
  
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [creativeworkSchema, productSchema, articleSchema, breadcrumbSchema]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <NavbarFixed />
        
 
        
        <main className="container mx-auto py-34  md:py-30  sm:py-30">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
            {/* Left: big image */}
            <section className="lg:w-1/2 w-full h-96 lg:h-[70vh] relative bg-gray-200" aria-label="Galerie photos du trophée">
              {images.length > 0 ? (
                <ImageCarousel images={images} projectTitle={project.title} project={project} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
              )}
            </section>

            {/* Right: attributes and overview */}
            <section className="lg:w-1/2 w-full p-10" aria-label="Détails du trophée">
              <header className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-4">
                <div>
                  <h3 className="text-sm text-gray-600">Client:</h3>
                  <div className="flex flex-col items-center mt-2">
                    {project.imagePartner && (
                      <Image
                        src={project.imagePartner}
                        alt={`Logo ${project.partenaires?.[0] || 'client'}`}
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
                    <h1 className="text-center">{project.project || project.title}</h1>
                  </div>
                </div>
              </header>

              <section className="mt-6">
                <h2 className="text-lg font-medium mb-4">Description:</h2>
                <p className="text-base text-gray-800">{project.description}</p>
              </section>

              {/* Technical specifications */}
              <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6" aria-label="Spécifications techniques">
                <div>
                  <h3 className="text-sm text-gray-600">Matériaux</h3>
                  <ul className="mt-2">
                    {project.materials?.map((material, index) => (
                      <li key={index} className="text-sm">{material}</li>
                    )) || <span>-</span>}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600">Techniques</h3>
                  <ul className="mt-2">
                    {project.techniques?.map((technique, index) => (
                      <li key={index} className="text-sm">{technique}</li>
                    )) || <span>-</span>}
                  </ul>
                </div>
              </section>
                      
              <nav className="flex items-center space-x-4 mt-8" aria-label="Liens externes">
                {project.githubLink && (
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-lg text-blue-500 hover:underline"
                    aria-label={`Voir le code source sur GitHub pour ${project.title}`}
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
                    aria-label={`Voir la démonstration de ${project.title}`}
                  >
                    <FiExternalLink className="mr-2" />
                    Démo
                  </Link>
                )}
              </nav>
            </section>
            
          </article>
                 <nav className="flex justify-center px-4 sm:px-6 md:px-8 pt-8">
          <Link
            href="/#realisations"
            className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 uppercase text-sm md:text-lg font-semibold tracking-widest text-center mx-auto mb-10 w-full max-w-xs sm:max-w-sm md:max-w-md"
            aria-label="Retour à la galerie des autres réalisations de trophées"
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