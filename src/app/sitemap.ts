import { MetadataRoute } from 'next'
import { projects } from '@/contents/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adrianbauduin.com'
  const currentDate = new Date()

  // Static routes with optimized priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/collaboration`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/devis`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9, // Higher priority for conversion page
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ebeniste-lille`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ebeniste-lambersart`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ebeniste-villeneuve-ascq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Dynamic routes for projects with enhanced prioritization
  const projectRoutes: MetadataRoute.Sitemap = projects.flatMap((project) => {
    const projectYear = project.year || new Date().getFullYear()
    const projectLastModified = new Date(`${projectYear}-12-31`)
    
    // Enhanced priority calculation based on multiple factors
    let priority = 0.6 // Base priority
    
    // Recent projects get higher priority
    if (projectYear >= 2024) priority += 0.2
    else if (projectYear >= 2023) priority += 0.1
    
    // Projects with more images get slightly higher priority (engagement factor)
    if (Array.isArray(project.imageProject) && project.imageProject.length > 3) {
      priority += 0.05
    }
    
    // Projects with prestigious partners get higher priority
    const prestigiousPartners = ['CIC', 'DFCG', 'La Voix Du Nord']
    if (project.partenaires?.some(partner => 
      prestigiousPartners.some(pp => partner.toLowerCase().includes(pp.toLowerCase()))
    )) {
      priority += 0.05
    }
    
    // Cap priority at 0.9 (home page should remain highest)
    priority = Math.min(priority, 0.9)

    return [
      {
        url: `${baseUrl}/trophee/${project.slug}`,
        lastModified: projectLastModified,
        changeFrequency: 'monthly' as const,
        priority,
      }
    ]
  })

  return [...staticRoutes, ...projectRoutes]
}