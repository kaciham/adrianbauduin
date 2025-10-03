import { MetadataRoute } from 'next'
import { projects } from '@/contents/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://portfolio-adrianbauduin.vercel.app'
  const currentDate = new Date()

  // Static routes
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
      priority: 0.8,
    },
  ]

  // Dynamic routes for projects with better priorities based on year
  const projectRoutes: MetadataRoute.Sitemap = projects.flatMap((project) => {
    const projectYear = project.year || new Date().getFullYear()
    const projectLastModified = new Date(`${projectYear}-12-31`)
    const isRecentProject = projectYear >= 2023
    const priority = isRecentProject ? 0.8 : 0.6

    return [
      {
        url: `${baseUrl}/${project.slug}`,
        lastModified: projectLastModified,
        changeFrequency: 'monthly' as const,
        priority,
      },
      {
        url: `${baseUrl}/trophee/${project.slug}`,
        lastModified: projectLastModified,
        changeFrequency: 'monthly' as const,
        priority,
      }
    ]
  })

  // Additional SEO pages
  const seoRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/trophee`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    }
  ]

  return [...staticRoutes, ...projectRoutes, ...seoRoutes]
}