export function generateImageAlt(project: { title?: string; project?: string; materials?: string[]; techniques?: string[] }, imageIndex: number = 0): string {
  const materials = project.materials?.slice(0, 2).join(' et ') || 'bois';
  const techniques = project.techniques?.slice(0, 1)[0] || 'artisanal';
  
  const baseAlt = `Trophée ${project.title || project.project} en ${materials}`;
  
  if (imageIndex === 0) {
    return `${baseAlt} - Trophée en bois sur mesure par Adrian Bauduin, ébéniste à Lille`;
  }
  
  return `${baseAlt} - Vue ${imageIndex + 1} - Technique ${techniques}`;
}

export function generateImageTitle(project: { title?: string; project?: string }): string {
  return `Trophée personnalisé ${project.title || project.project} - Création unique en bois sur mesure`;
}

export function generateRichKeywords(project: { 
  title?: string; 
  project?: string; 
  materials?: string[]; 
  techniques?: string[];
  technologies?: string[];
  partenaires?: string[];
  year?: number;
}): string[] {
  const baseKeywords = [
    'trophée bois sur mesure',
    'ébéniste créateur Lille',
    'trophée personnalisé Nord-Pas-de-Calais',
    'création artisanale bois Hauts-de-France',
    'trophée design événementiel',
    'récompense bois massif sur mesure',
    'artisan ébéniste Lambersart',
    'trophée entreprise gravé',
    'prix remise cérémonie bois',
    'ébénisterie artisanale Lille',
    'trophée eco-responsable bois',
    'création unique trophée design'
  ];

  const specificKeywords = [
    project.title ? `trophée ${project.title.toLowerCase()}` : '',
    project.year ? `trophée bois sur mesure ${project.year}` : '',
    ...(project.materials?.map(m => m.toLowerCase()) || []),
    ...(project.techniques?.map(t => t.toLowerCase()) || []),
    ...(project.technologies?.map(t => `trophée ${t.toLowerCase()}`) || []),
    ...(project.partenaires?.map(p => `trophée ${p.toLowerCase()}`) || [])
  ].filter(Boolean);

  return [...baseKeywords, ...specificKeywords];
}

export function generateOptimizedDescription(project: {
  description: string;
  materials?: string[];
  year?: number;
  title?: string;
}, maxLength: number = 160): string {
  const materials = project.materials?.join(', ') || 'bois';
  const baseDescription = project.description;
  
  const suffix = ` Trophée en ${materials} créé en ${project.year} par Adrian Bauduin, ébéniste spécialisé dans les récompenses personnalisées à Lille et dans les Hauts-de-France.`;
  
  const totalLength = baseDescription.length + suffix.length;
  
  if (totalLength <= maxLength) {
    return baseDescription + suffix;
  }
  
  const truncatedBase = baseDescription.slice(0, maxLength - suffix.length - 3) + '...';
  return truncatedBase + suffix;
}

export function generateBreadcrumbSchema(project: { title?: string; slug?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://adrianbauduin.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Réalisations",
        "item": "https://adrianbauduin.com/#realisations"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.title || "Trophée",
        "item": `https://adrianbauduin.com/trophee/${project.slug}`
      }
    ]
  };
}