import { DatabaseProject } from '@/types'
import { generateRichKeywords, generateOptimizedDescription, generateBreadcrumbSchema } from './seo'

export interface ProjectSEOData {
  title: string
  description: string
  keywords: string[]
  openGraph: {
    title: string
    description: string
    images: Array<{
      url: string
      width: number
      height: number
      alt: string
    }>
    type: string
  }
  twitter: {
    card: string
    title: string
    description: string
    images: string[]
  }
  structuredData: {
    product: object
    article: object
    breadcrumb: object
  }
  canonical: string
}

/**
 * Generates comprehensive SEO metadata for a project
 */
export function generateProjectSEO(project: DatabaseProject): ProjectSEOData {
  const baseUrl = 'https://adrianbauduin.com'
  const canonical = `${baseUrl}/trophee/${project.slug}`
  
  // Enhanced title generation with local SEO
  const title = generateSEOTitle(project)
  
  // Optimized description for search engines
  const description = generateOptimizedDescription({
    description: project.description,
    materials: Array.isArray(project.materials) ? project.materials : (project.materials ? [project.materials] : []),
    year: project.year,
    title: project.title
  }, 160)
  
  // Rich keywords for better targeting
  const keywords = generateRichKeywords({
    title: project.title,
    materials: Array.isArray(project.materials) ? project.materials : (project.materials ? [project.materials] : []),
    techniques: Array.isArray(project.techniques) ? project.techniques : (project.techniques ? [project.techniques] : []),
    technologies: Array.isArray(project.technologies) ? project.technologies : (project.technologies ? [project.technologies] : []),
    year: project.year,
    partenaires: project.client ? [project.client] : []
  })
  
  // Optimized images with proper alt text
  const optimizedImages = generateOptimizedImages(project, baseUrl)
  
  return {
    title,
    description,
    keywords,
    canonical,
    openGraph: {
      title: `${title} | Adrian Bauduin`,
      description,
      images: optimizedImages,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Adrian Bauduin`,
      description,
      images: optimizedImages.map(img => img.url)
    },
    structuredData: {
      product: generateProductSchema(project, baseUrl),
      article: generateArticleSchema(project, baseUrl),
      breadcrumb: generateBreadcrumbSchema({ title: project.title, slug: project.slug })
    }
  }
}

/**
 * Generates SEO-optimized title for a project
 */
function generateSEOTitle(project: DatabaseProject): string {
  const materials = Array.isArray(project.materials) ? project.materials[0] : (project.materials || 'bois')
  const year = project.year ? ` ${project.year}` : ''
  
  // Format: "Trophée [Title] en [Material] sur mesure[Year] - Ébéniste Lille"
  const title = `Trophée ${project.title} en ${materials} sur mesure${year} - Ébéniste Lille`
  
  // Ensure title is under 60 characters for Google
  if (title.length > 60) {
    return `Trophée ${project.title} en ${materials} - Ébéniste Lille`
  }
  
  return title
}

/**
 * Generates optimized images with proper dimensions and alt text
 */
function generateOptimizedImages(project: DatabaseProject, baseUrl: string) {
  if (!project.images || project.images.length === 0) {
    // Fallback to default image
    return [{
      url: `${baseUrl}/projects/default-trophy.webp`,
      width: 800,
      height: 600,
      alt: `Trophée ${project.title} en bois sur mesure par Adrian Bauduin, ébéniste à Lille`
    }]
  }
  
  return project.images.slice(0, 4).map((imageUrl, index) => {
    const materials = Array.isArray(project.materials) ? project.materials.join(' et ') : (project.materials || 'bois')
    
    let alt: string
    if (index === 0) {
      alt = `Trophée ${project.title} en ${materials} - Création sur mesure par Adrian Bauduin, ébéniste à Lille`
    } else {
      alt = `Vue ${index + 1} du trophée ${project.title} - Détail artisanal en ${materials}`
    }
    
    return {
      url: imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`,
      width: 800,
      height: 600,
      alt
    }
  })
}

/**
 * Generates Product structured data for better e-commerce SEO
 */
function generateProductSchema(project: DatabaseProject, baseUrl: string) {
  const materials = Array.isArray(project.materials) ? project.materials.join(', ') : (project.materials || 'bois massif')
  const techniques = Array.isArray(project.techniques) ? project.techniques.join(', ') : (project.techniques || 'artisanal')
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `Trophée ${project.title} en ${materials}`,
    "description": project.description,
    "image": project.images?.[0] || `${baseUrl}/projects/default-trophy.webp`,
    "brand": {
      "@type": "Brand",
      "name": "Adrian Bauduin"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Adrian Bauduin - Ébénisterie",
      "url": baseUrl,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "30 Rue Henri Regnault",
        "addressLocality": "Lille",
        "postalCode": "59000",
        "addressCountry": "FR"
      }
    },
    "category": "Trophée personnalisé",
    "material": materials,
    "artMedium": techniques,
    "dateCreated": project.year ? `${project.year}-01-01` : project.createdAt,
    "artform": "Ébénisterie",
    "artworkSurface": "Bois massif",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/MadeToOrder",
      "priceCurrency": "EUR",
      "seller": {
        "@type": "Organization",
        "name": "Adrian Bauduin",
        "url": baseUrl
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Technique",
        "value": techniques
      },
      {
        "@type": "PropertyValue", 
        "name": "Matériau principal",
        "value": materials
      },
      {
        "@type": "PropertyValue",
        "name": "Type de produit",
        "value": "Trophée sur mesure"
      }
    ]
  }
}

/**
 * Generates Article structured data for content SEO
 */
function generateArticleSchema(project: DatabaseProject, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Création du trophée ${project.title} en bois sur mesure`,
    "description": project.description,
    "image": project.images?.[0] || `${baseUrl}/projects/default-trophy.webp`,
    "datePublished": project.createdAt,
    "dateModified": project.updatedAt || project.createdAt,
    "author": {
      "@type": "Person",
      "name": "Adrian Bauduin",
      "url": `${baseUrl}/ebeniste-lille`,
      "sameAs": [
        "https://www.linkedin.com/in/adrian-bauduin-1b152b220/",
        "https://www.instagram.com/adrianbauduin/"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Adrian Bauduin - Ébénisterie",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.webp`
      },
      "url": baseUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/trophee/${project.slug}`
    },
    "articleSection": "Réalisations",
    "about": {
      "@type": "Thing",
      "name": `Trophée ${project.title}`,
      "description": `Trophée personnalisé en bois massif créé par Adrian Bauduin`
    },
    "keywords": generateRichKeywords({
      title: project.title,
      materials: Array.isArray(project.materials) ? project.materials : (project.materials ? [project.materials] : []),
      techniques: Array.isArray(project.techniques) ? project.techniques : (project.techniques ? [project.techniques] : []),
      year: project.year,
      partenaires: project.client ? [project.client] : []
    }).join(', ')
  }
}

/**
 * Validates that a project has all required SEO elements
 */
export function validateProjectSEO(project: DatabaseProject): {
  isValid: boolean
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []
  
  // Required fields
  if (!project.title || project.title.length < 3) {
    issues.push('Titre du projet trop court (minimum 3 caractères)')
  }
  
  if (!project.description || project.description.length < 50) {
    issues.push('Description trop courte (minimum 50 caractères pour le SEO)')
  }
  
  if (!project.slug) {
    issues.push('Slug manquant pour l\'URL')
  }
  
  if (!project.images || project.images.length === 0) {
    issues.push('Aucune image pour le projet')
  }
  
  // Recommendations
  if (project.description && project.description.length > 200) {
    recommendations.push('Description optimale entre 150-200 caractères')
  }
  
  if (!project.materials) {
    recommendations.push('Ajouter les matériaux utilisés pour améliorer le SEO')
  }
  
  if (!project.techniques) {
    recommendations.push('Ajouter les techniques utilisées pour enrichir le contenu')
  }
  
  if (!project.year) {
    recommendations.push('Ajouter l\'année de création')
  }
  
  if (project.images && project.images.length < 3) {
    recommendations.push('Ajouter plus d\'images (3-5 recommandées)')
  }
  
  if (!project.client) {
    recommendations.push('Ajouter le client/partenaire si applicable')
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  }
}

/**
 * Generates slug from title if not provided
 */
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim() // Remove leading/trailing spaces
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length
}