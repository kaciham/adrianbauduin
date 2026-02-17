import { MetadataRoute } from 'next'
import { DatabaseProject } from '@/types'

async function getProjects(): Promise<DatabaseProject[]> {
  try {
    // During build time, try to connect to database with fallback
    const isProduction = process.env.NODE_ENV === 'production'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    // Only attempt fetch during runtime or if database is available
    if (process.env.MONGODB_URI) {
      const response = await fetch(`${baseUrl}/api/projects?limit=100`, {
        next: { 
          revalidate: isProduction ? 1800 : 30, // 30 minutes in prod, 30 seconds in dev
          tags: ['projects-sitemap'] 
        },
        headers: {
          'User-Agent': 'Sitemap-Generator/1.0'
        }
      })
      
      if (!response.ok) {
        console.warn('Failed to fetch projects for sitemap, using fallback')
        return []
      }
      
      const data = await response.json()
      if (!data.success || !data.projects) {
        return []
      }
      
      return data.projects
    }
    
    return []
  } catch (error) {
    console.warn('Error fetching projects for sitemap:', error)
    return []
  }
}

// Cache static routes to avoid recalculation
const getStaticRoutes = (): MetadataRoute.Sitemap => {
  const baseUrl = 'https://adrianbauduin.com'
  const currentDate = new Date()

  return [
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
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch projects from database
  const projects = await getProjects()

  // Dynamic routes for projects with enhanced prioritization
  const baseUrl = 'https://adrianbauduin.com'
  const projectRoutes: MetadataRoute.Sitemap = projects.flatMap((project) => {
    const projectYear = project.year || new Date().getFullYear()
    const projectLastModified = project.updatedAt ? new Date(project.updatedAt) : new Date(project.createdAt)
    
    // Enhanced priority calculation based on multiple factors
    let priority = 0.6 // Base priority
    
    // Recent projects get higher priority
    const currentYear = new Date().getFullYear()
    if (projectYear >= currentYear) priority += 0.3 // Current year projects
    else if (projectYear >= currentYear - 1) priority += 0.2 // Last year
    else if (projectYear >= currentYear - 2) priority += 0.1 // Two years ago
    
    // Projects with more images get slightly higher priority (engagement factor)
    if (project.images && project.images.length > 5) {
      priority += 0.1
    } else if (project.images && project.images.length > 3) {
      priority += 0.05
    }
    
    // Projects with technologies field get slight boost (indicating more detailed/modern projects)
    if (project.technologies && project.technologies.length > 0) {
      priority += 0.05
    }
    
    // Projects with multiple tags get slight boost (better categorization)
    if (project.tags && project.tags.length > 2) {
      priority += 0.05
    }
    
    // Projects with prestigious clients get higher priority
    const prestigiousClients = ['CIC', 'DFCG', 'La Voix Du Nord', 'CPAM', 'Energic', 'START Innovation']
    if (project.client && 
      prestigiousClients.some(pc => project.client!.toLowerCase().includes(pc.toLowerCase()))
    ) {
      priority += 0.1
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

  const staticRoutes = getStaticRoutes()
  return [...staticRoutes, ...projectRoutes]
}