import { DatabaseProject } from '@/types'
import { validateProjectSEO } from './projectSeoGenerator'

export interface SEOValidationResult {
  overall: {
    score: number // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
    status: 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'critical'
  }
  categories: {
    content: SEOCategoryResult
    technical: SEOCategoryResult
    images: SEOCategoryResult
    metadata: SEOCategoryResult
    structured: SEOCategoryResult
  }
  actionableRecommendations: string[]
  criticalIssues: string[]
}

interface SEOCategoryResult {
  score: number
  issues: string[]
  recommendations: string[]
  checks: Record<string, boolean>
}

/**
 * Comprehensive SEO validation for projects
 */
export function validateComprehensiveSEO(project: DatabaseProject): SEOValidationResult {
  const contentResult = validateContentSEO(project)
  const technicalResult = validateTechnicalSEO(project)
  const imagesResult = validateImagesSEO(project)
  const metadataResult = validateMetadataSEO(project)
  const structuredResult = validateStructuredDataSEO(project)
  
  // Calculate overall score
  const totalScore = (
    contentResult.score +
    technicalResult.score +
    imagesResult.score +
    metadataResult.score +
    structuredResult.score
  ) / 5
  
  // Determine grade and status
  const grade = getGrade(totalScore)
  const status = getStatus(totalScore)
  
  // Collect all critical issues and recommendations
  const criticalIssues = [
    ...contentResult.issues.filter(issue => issue.includes('critique') || issue.includes('manque')),
    ...technicalResult.issues.filter(issue => issue.includes('critique') || issue.includes('manque')),
    ...imagesResult.issues.filter(issue => issue.includes('critique') || issue.includes('manque')),
    ...metadataResult.issues.filter(issue => issue.includes('critique') || issue.includes('manque')),
    ...structuredResult.issues.filter(issue => issue.includes('critique') || issue.includes('manque'))
  ]
  
  const actionableRecommendations = [
    ...contentResult.recommendations.slice(0, 2), // Top 2 from each category
    ...technicalResult.recommendations.slice(0, 2),
    ...imagesResult.recommendations.slice(0, 2),
    ...metadataResult.recommendations.slice(0, 2),
    ...structuredResult.recommendations.slice(0, 2)
  ].slice(0, 8) // Limit to top 8 recommendations
  
  return {
    overall: {
      score: Math.round(totalScore),
      grade,
      status
    },
    categories: {
      content: contentResult,
      technical: technicalResult,
      images: imagesResult,
      metadata: metadataResult,
      structured: structuredResult
    },
    actionableRecommendations,
    criticalIssues
  }
}

function validateContentSEO(project: DatabaseProject): SEOCategoryResult {
  const issues: string[] = []
  const recommendations: string[] = []
  const checks: Record<string, boolean> = {}
  
  // Title validation
  checks.hasTitle = !!project.title && project.title.length >= 3
  if (!checks.hasTitle) {
    issues.push('Titre manque ou trop court (critique)')
  }
  
  checks.titleLength = project.title ? project.title.length <= 60 : false
  if (!checks.titleLength && project.title) {
    recommendations.push('Raccourcir le titre à moins de 60 caractères pour un meilleur SEO')
  }
  
  // Description validation
  checks.hasDescription = !!project.description && project.description.length >= 50
  if (!checks.hasDescription) {
    issues.push('Description manque ou trop courte (critique)')
  }
  
  checks.descriptionLength = project.description ? 
    project.description.length >= 120 && project.description.length <= 160 : false
  if (!checks.descriptionLength && project.description) {
    if (project.description.length < 120) {
      recommendations.push('Allonger la description à 120-160 caractères pour optimiser les snippets')
    } else {
      recommendations.push('Raccourcir la description à 120-160 caractères pour éviter la troncature')
    }
  }
  
  // Content quality
  checks.hasMaterials = !!project.materials && project.materials.length > 0
  if (!checks.hasMaterials) {
    recommendations.push('Ajouter les matériaux utilisés pour enrichir le contenu SEO')
  }
  
  checks.hasTechniques = !!project.techniques && project.techniques.length > 0
  if (!checks.hasTechniques) {
    recommendations.push('Ajouter les techniques utilisées pour améliorer la pertinence')
  }
  
  checks.hasClient = !!project.client
  if (!checks.hasClient) {
    recommendations.push('Ajouter le nom du client/partenaire si applicable')
  }
  
  checks.hasYear = !!project.year && project.year >= 2020
  if (!checks.hasYear) {
    recommendations.push('Ajouter l\'année de création pour la fraîcheur du contenu')
  }
  
  const score = calculateCategoryScore(checks)
  
  return { score, issues, recommendations, checks }
}

function validateTechnicalSEO(project: DatabaseProject): SEOCategoryResult {
  const issues: string[] = []
  const recommendations: string[] = []
  const checks: Record<string, boolean> = {}
  
  // URL/Slug validation
  checks.hasSlug = !!project.slug && project.slug.length >= 3
  if (!checks.hasSlug) {
    issues.push('Slug d\'URL manque (critique)')
  }
  
  checks.slugFormat = project.slug ? 
    /^[a-z0-9-]+$/.test(project.slug) && !project.slug.includes('--') : false
  if (!checks.slugFormat && project.slug) {
    recommendations.push('Optimiser le format du slug (minuscules, tirets, pas de caractères spéciaux)')
  }
  
  checks.slugLength = project.slug ? project.slug.length <= 50 : false
  if (!checks.slugLength && project.slug) {
    recommendations.push('Raccourcir le slug à moins de 50 caractères')
  }
  
  // Content freshness
  checks.recentContent = project.year ? project.year >= new Date().getFullYear() - 2 : false
  if (!checks.recentContent) {
    recommendations.push('Contenu récent favorisé par les moteurs de recherche')
  }
  
  // Indexability
  checks.indexable = true // Assume indexable unless specified otherwise
  
  const score = calculateCategoryScore(checks)
  
  return { score, issues, recommendations, checks }
}

function validateImagesSEO(project: DatabaseProject): SEOCategoryResult {
  const issues: string[] = []
  const recommendations: string[] = []
  const checks: Record<string, boolean> = {}
  
  // Image presence
  checks.hasImages = !!project.images && project.images.length > 0
  if (!checks.hasImages) {
    issues.push('Aucune image fournie (critique pour l\'engagement)')
  }
  
  checks.multipleImages = project.images ? project.images.length >= 3 : false
  if (!checks.multipleImages) {
    recommendations.push('Ajouter 3-5 images pour améliorer l\'engagement utilisateur')
  }
  
  checks.imageFormats = project.images ? 
    project.images.every(img => img.includes('.webp') || img.includes('.jpg') || img.includes('.jpeg')) : false
  if (!checks.imageFormats) {
    recommendations.push('Utiliser des formats d\'image optimisés (WebP, JPEG)')
  }
  
  // Image optimization (inferred)
  checks.optimizedImages = project.images ? project.images.length <= 8 : true // Not too many images
  if (!checks.optimizedImages) {
    recommendations.push('Limiter à 8 images maximum pour optimiser les performances')
  }
  
  const score = calculateCategoryScore(checks)
  
  return { score, issues, recommendations, checks }
}

function validateMetadataSEO(project: DatabaseProject): SEOCategoryResult {
  const issues: string[] = []
  const recommendations: string[] = []
  const checks: Record<string, boolean> = {}
  
  // Basic metadata (inferred from content)
  checks.hasMetaTitle = !!project.title
  checks.hasMetaDescription = !!project.description
  
  // Social media optimization
  checks.hasOpenGraphData = !!project.title && !!project.description && !!project.images?.[0]
  if (!checks.hasOpenGraphData) {
    recommendations.push('Optimiser les métadonnées Open Graph pour les réseaux sociaux')
  }
  
  checks.hasTwitterCard = checks.hasOpenGraphData
  if (!checks.hasTwitterCard) {
    recommendations.push('Ajouter les métadonnées Twitter Card')
  }
  
  // Structured data readiness
  checks.structuredDataReady = !!(project.title && project.description && project.materials)
  if (!checks.structuredDataReady) {
    recommendations.push('Compléter les informations pour les données structurées')
  }
  
  const score = calculateCategoryScore(checks)
  
  return { score, issues, recommendations, checks }
}

function validateStructuredDataSEO(project: DatabaseProject): SEOCategoryResult {
  const issues: string[] = []
  const recommendations: string[] = []
  const checks: Record<string, boolean> = {}
  
  // Product schema readiness
  checks.productSchemaReady = !!(
    project.title && 
    project.description && 
    project.materials
  )
  if (!checks.productSchemaReady) {
    recommendations.push('Compléter les données pour le schema Product')
  }
  
  // Article schema readiness
  checks.articleSchemaReady = !!(
    project.title && 
    project.description && 
    project.year
  )
  if (!checks.articleSchemaReady) {
    recommendations.push('Ajouter l\'année pour le schema Article')
  }
  
  // Creative work schema readiness
  checks.creativeWorkReady = !!(
    project.title && 
    project.materials && 
    project.techniques
  )
  if (!checks.creativeWorkReady) {
    recommendations.push('Ajouter techniques pour le schema CreativeWork')
  }
  
  // Breadcrumb schema readiness
  checks.breadcrumbReady = !!project.slug
  if (!checks.breadcrumbReady) {
    issues.push('Slug manque pour les breadcrumbs')
  }
  
  const score = calculateCategoryScore(checks)
  
  return { score, issues, recommendations, checks }
}

function calculateCategoryScore(checks: Record<string, boolean>): number {
  const total = Object.keys(checks).length
  const passed = Object.values(checks).filter(Boolean).length
  return total > 0 ? Math.round((passed / total) * 100) : 0
}

function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function getStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'critical' {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'needs-improvement'
  if (score >= 60) return 'poor'
  return 'critical'
}

/**
 * Quick SEO health check for dashboard
 */
export function quickSEOCheck(project: DatabaseProject): {
  score: number
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'critical'
  topIssues: string[]
} {
  const validation = validateProjectSEO(project)
  
  let score = 100
  
  // Deduct points for issues
  if (!validation.isValid) score -= 30
  score -= validation.issues.length * 10
  score -= validation.recommendations.length * 5
  
  // Ensure score is not negative
  score = Math.max(0, score)
  
  const status = getStatus(score)
  const topIssues = [...validation.issues, ...validation.recommendations.slice(0, 3)]
  
  return { score, status, topIssues }
}