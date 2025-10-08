/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://adrianbauduin.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/admin/*', '/trophee/*'],
  
  // Configuration robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/']
      }
    ],
    additionalSitemaps: [
      'https://adrianbauduin.com/sitemap.xml',
    ],
  },

  // Transformation des URLs pour améliorer le SEO
  transform: async (config, path) => {
    // Priorités SEO personnalisées
    const customPriority = {
      '/': 1.0,
      '/collaboration': 0.8,
      '/devis': 0.8,
    }

    // Fréquence de changement personnalisée
    const customChangeFreq = {
      '/': 'weekly',
      '/collaboration': 'monthly',
      '/devis': 'monthly',
    }

    // Gestion spéciale pour les pages de projets
    let priority = customPriority[path] || 0.7
    let changefreq = customChangeFreq[path] || 'monthly'

    // Boost de priorité pour les pages de projets récents
    if (path.match(/\/(ecoposs|formidables|dfcg|start-innovation)/)) {
      priority = 0.8
      changefreq = 'monthly'
    }

    // Pages projets récents (dernières années)
    if (path.includes('2024') || path.includes('2025')) {
      priority = Math.min(priority + 0.1, 1.0)
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: `https://adrianbauduin.com${path}`,
          hreflang: 'fr',
        },
      ],
    }
  },

  // URLs additionnelles à inclure
  additionalPaths: async (config) => {
    const additionalPaths = [
      '/ebeniste-lille',
      '/ebeniste-lambersart',
      '/ebeniste-villeneuve-ascq',
      '/faq',
    ]

    return additionalPaths.map(path => ({
      loc: path,
      changefreq: 'monthly',
      priority: path.includes('/ebeniste-') ? 0.8 : 0.7,
      lastmod: new Date().toISOString(),
    }))
  }
}