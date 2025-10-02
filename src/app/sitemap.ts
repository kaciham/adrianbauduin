import { MetadataRoute } from 'next'
import { projects } from '@/contents/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://portfolio-adrianbauduin.vercel.app'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/collaboration`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/devis`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Dynamic routes for projects (both [title] and trophee/[title])
  const projectRoutes: MetadataRoute.Sitemap = projects.flatMap((project) => [
    {
      url: `${baseUrl}/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/trophee/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  ])

  return [...staticRoutes, ...projectRoutes]
}