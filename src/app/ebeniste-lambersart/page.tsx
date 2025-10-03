import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/contents/projects';

export const metadata: Metadata = {
  title: 'Ébéniste Lambersart | Trophées Sur Mesure - Adrian Bauduin',
  description: 'Ébéniste créateur à Lambersart spécialisé dans les trophées en bois sur mesure. Proximité de Lille, savoir-faire artisanal au service de vos événements.',
  keywords: 'ébéniste Lambersart, trophée sur mesure Lambersart, menuisier Lambersart, artisan bois Lambersart, création bois personnalisée',
  openGraph: {
    title: 'Adrian Bauduin - Ébéniste à Lambersart',
    description: 'Créateur de trophées sur mesure à Lambersart près de Lille',
  }
};

export default function LambersartPage() {
  const recentProjects = projects.slice(0, 3);

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Adrian Bauduin - Ébéniste Lambersart",
    "description": "Ébéniste créateur spécialisé dans les trophées sur mesure à Lambersart",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lambersart",
      "postalCode": "59130",
      "addressRegion": "Nord",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 50.6439,
      "longitude": 3.0239
    },
    "areaServed": "Lambersart"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Ébéniste à <span className="text-amber-600">Lambersart</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl">
              Basé à <strong>Lambersart</strong>, je crée des <strong>trophées en bois sur mesure</strong> 
              pour les entreprises et associations de la métropole lilloise. Mon atelier de proximité 
              vous garantit un service personnalisé et des délais optimisés.
            </p>
          </div>
        </header>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Choisir un Ébéniste Local à Lambersart ?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  📍
                </div>
                <h3 className="text-lg font-semibold mb-3">Proximité</h3>
                <p className="text-gray-600">Rendez-vous facililes et suivi de près de votre projet</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  ⚡
                </div>
                <h3 className="text-lg font-semibold mb-3">Réactivité</h3>
                <p className="text-gray-600">Délais courts et interventions rapides sur Lambersart</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🤝
                </div>
                <h3 className="text-lg font-semibold mb-3">Conseil Local</h3>
                <p className="text-gray-600">Connaissance du tissu économique local et de ses besoins</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🚚
                </div>
                <h3 className="text-lg font-semibold mb-3">Livraison</h3>
                <p className="text-gray-600">Installation et livraison directe sur Lambersart et environs</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Dernières Créations</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {recentProjects.map((project) => {
                const image = Array.isArray(project.imageProject) ? project.imageProject[0] : project.imageProject;
                return (
                  <article key={project.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {image && (
                      <div className="aspect-video relative">
                        <Image
                          src={image}
                          alt={`Trophée ${project.title} - Création ébéniste Lambersart`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{project.year}</p>
                      <Link
                        href={`/${project.slug}`}
                        className="text-amber-600 hover:underline"
                      >
                        Découvrir ce projet →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Votre Projet à Lambersart</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Créons ensemble le trophée qui valorisera votre événement. 
              Devis gratuit et rendez-vous à Lambersart possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/devis"
                className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
              >
                Devis Gratuit
              </Link>
              <Link
                href="/collaboration"
                className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg hover:bg-amber-600 hover:text-white transition-colors"
              >
                Prendre Contact
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}