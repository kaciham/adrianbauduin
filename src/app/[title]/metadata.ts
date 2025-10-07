import { Metadata } from 'next';
import { projects } from '@/contents/projects';

export function generateProjectMetadata(slug: string): Metadata {
  const project = projects.find((p) => p.slug === slug);
  
  if (!project) {
    return {
      title: 'Projet non trouvé - Adrian Bauduin',
      description: 'Le projet demandé n\'existe pas.',
    };
  }

  const title = `${project.title} | Adrian Bauduin - Trophée en bois sur mesure`;
  const description = project.description.slice(0, 160);
  const images = Array.isArray(project.imageProject) ? project.imageProject : [project.imageProject];
  const imageUrl = `https://adrianbauduin.com${images[0]}`;

  return {
    title,
    description,
    keywords: [
      'trophée sur mesure',
      'ébéniste Lille',
      'trophée bois',
      project.project,
      ...(project.materials || []),
      ...(project.techniques || []),
      ...(project.partenaires || []),
    ].join(', '),
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'article',
      publishedTime: `${project.year}-01-01T00:00:00.000Z`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://adrianbauduin.com/${slug}`,
    },
  };
}