import { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/contents/projects';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Adrian bauduin - Trophées en bois sur mesure',
  description: 'Découvrez notre collection de trophées en bois sur mesure. Créations uniques alliant tradition et modernité pour récompenser vos événements dans les Hauts-de-France.',
  keywords: 'trophée bois sur mesure, trophée personnalisé Lille, ébéniste créateur, récompense bois artisanal, trophée entreprise Nord, ébéniste Lille',
  openGraph: {
    title: 'Collection Trophées Bois Sur Mesure - Adrian Bauduin',
    description: 'Trophées en bois uniques créés sur mesure par un ébéniste passionné dans la région lilloise',
    images: ['/projects/trophees-bois-design-start-innovation-2024.webp'],
  }
};

export default function TropheePage() {
  const recentProjects = projects.filter(p => (p.year || 0) >= 2023).slice(0, 6);
  
  const tropheeSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Trophées en Bois Sur Mesure",
    "description": "Collection de trophées en bois créés sur mesure par Adrian Bauduin, ébéniste spécialisé dans la région lilloise",
    "url": "https://adrianbauduin.com/trophee",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": projects.length,
      "itemListElement": recentProjects.map((project, index) => ({
        "@type": "CreativeWork",
        "position": index + 1,
        "name": project.title,
        "description": project.description.slice(0, 100),
        "creator": {
          "@type": "Person",
          "name": "Adrian Bauduin"
        },
        "material": project.materials?.join(', '),
        "url": `https://adrianbauduin.com/${project.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tropheeSchema) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trophées en Bois Sur Mesure
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              Créations uniques et personnalisées alliant <strong>savoir-faire traditionnel</strong> et 
              <strong> design contemporain</strong>. Chaque trophée raconte une histoire et valorise 
              vos moments d&apos;exception dans la région des <strong>Hauts-de-France</strong>.
            </p>
          </div>
        </header>

        {/* Avantages */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Choisir Nos Trophées ?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🏆
                </div>
                <h3 className="text-xl font-semibold mb-3">100% Sur Mesure</h3>
                <p className="text-gray-600">Chaque trophée est unique, conçu selon vos spécifications et l&apos;identité de votre événement.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🌱
                </div>
                <h3 className="text-xl font-semibold mb-3">Matériaux Durables</h3>
                <p className="text-gray-600">Bois nobles et éco-responsables, techniques artisanales respectueuses de l&apos;environnement.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  ⚡
                </div>
                <h3 className="text-xl font-semibold mb-3">Délais Respectés</h3>
                <p className="text-gray-600">Fabrication locale dans nos ateliers près de Lille pour une livraison dans les temps.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Projets récents */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Dernières Créations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentProjects.map((project) => {
                const image = Array.isArray(project.imageProject) ? project.imageProject[0] : project.imageProject;
                return (
                  <article key={project.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {image && (
                      <div className="aspect-video relative">
                        <Image
                          src={image}
                          alt={`Trophée ${project.title} en ${project.materials?.[0] || 'bois'} - Création Adrian Bauduin`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {project.materials?.slice(0, 2).join(' • ')} • {project.year}
                      </p>
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {project.description.slice(0, 120)}...
                      </p>
                      <Link
                        href={`/${project.slug}`}
                        className="inline-block bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
                      >
                        Découvrir ce projet
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/#realisations"
                className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Voir Toutes Nos Réalisations
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Votre Projet de Trophée Sur Mesure</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Transformons ensemble votre vision en une récompense unique qui marquera les esprits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/devis"
                className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
              >
                Demander un Devis
              </Link>
              <Link
                href="/collaboration"
                 className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
              >
                Discuter du Projet
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}