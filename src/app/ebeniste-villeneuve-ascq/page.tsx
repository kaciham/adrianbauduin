import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/contents/projects';

export const metadata: Metadata = {
  title: 'Ébéniste Villeneuve d\'Ascq | Trophées Sur Mesure - Adrian Bauduin',
  description: 'Ébéniste créateur à Villeneuve d\'Ascq spécialisé dans les trophées en bois sur mesure. Proximité universités et entreprises, savoir-faire artisanal.',
  keywords: 'ébéniste Villeneuve d\'Ascq, trophée sur mesure Villeneuve d\'Ascq, menuisier Villeneuve d\'Ascq, artisan bois université Lille',
  openGraph: {
    title: 'Adrian Bauduin - trophées en bois sur mesure à Villeneuve d\'Ascq',
    description: 'Créateur de trophées sur mesure à Villeneuve d\'Ascq près de Lille',
  }
};

export default function VilleneuveAscqPage() {
  const universityProjects = projects.filter(p => 
    p.partenaires?.some(partner => 
      partner.toLowerCase().includes('université') || 
      partner.toLowerCase().includes('école') ||
      partner.toLowerCase().includes('academic')
    )
  ).slice(0, 2);

  const businessProjects = projects.filter(p => !universityProjects.includes(p)).slice(0, 2);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Création de trophées en bois sur mesure à Villeneuve d'Ascq",
    "description": "Service d'ébénisterie spécialisé dans les trophées sur mesure à Villeneuve d'Ascq",
    "provider": {
      "@type": "Person",
      "name": "Adrian Bauduin"
    },
    "areaServed": "Villeneuve-d'Ascq",
    "serviceType": "Ébénisterie sur mesure",
    "category": "Artisanat"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Ébéniste à <span className="text-amber-600">Villeneuve d&apos;Ascq</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl">
              Au cœur de <strong>Villeneuve d&apos;Ascq</strong>, je crée des <strong>trophées en bois sur mesure</strong> 
              pour les universités, entreprises tech et associations. Mon expertise artisanale s&apos;adapte 
              parfaitement à l&apos;écosystème dynamique de la ville universitaire.
            </p>
          </div>
        </header>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Spécialisé pour l&apos;Écosystème de Villeneuve d&apos;Ascq</h2>
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-blue-600">🎓 Secteur Universitaire</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                    <strong>Universités de Lille</strong> : Trophées de remise de diplômes, prix académiques
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                    <strong>Grandes écoles</strong> : Récompenses étudiantes, concours d&apos;innovation
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                    <strong>Recherche & Innovation</strong> : Prix scientifiques, projets étudiants
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-green-600">🏢 Secteur Entreprises</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></span>
                    <strong>Start-ups Tech</strong> : Trophées d&apos;innovation, récompenses équipes
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></span>
                    <strong>Entreprises Ascquoises</strong> : Prix commerciaux, événements corporate
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></span>
                    <strong>Incubateurs</strong> : Concours entrepreneuriaux, pitch contests
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Projets Récents à Villeneuve d&apos;Ascq</h2>
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Projets universitaires */}
              <div>
                <h3 className="text-xl font-semibold mb-6">🎓 Secteur Universitaire</h3>
                <div className="space-y-6">
                  {universityProjects.length > 0 ? universityProjects.map((project) => {
                    const image = Array.isArray(project.imageProject) ? project.imageProject[0] : project.imageProject;
                    return (
                      <article key={project.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {image && (
                          <div className="aspect-video relative">
                            <Image
                              src={image}
                              alt={`${project.title} - Université Villeneuve d'Ascq`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h4 className="font-semibold mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{project.year}</p>
                          <Link href={`/${project.slug}`} className="text-blue-600 hover:underline">
                            Voir le projet →
                          </Link>
                        </div>
                      </article>
                    );
                  }) : (
                    <p className="text-gray-600 italic">Projets universitaires en cours de développement...</p>
                  )}
                </div>
              </div>

              {/* Projets entreprises */}
              <div>
                <h3 className="text-xl font-semibold mb-6">🏢 Secteur Entreprises</h3>
                <div className="space-y-6">
                  {businessProjects.map((project) => {
                    const image = Array.isArray(project.imageProject) ? project.imageProject[0] : project.imageProject;
                    return (
                      <article key={project.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {image && (
                          <div className="aspect-video relative">
                            <Image
                              src={image}
                              alt={`${project.title} - Entreprises Villeneuve d'Ascq`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h4 className="font-semibold mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{project.year}</p>
                          <Link href={`/${project.slug}`} className="text-green-600 hover:underline">
                            Voir le projet →
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Votre Projet à Villeneuve d&apos;Ascq</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Université, start-up ou grande entreprise ? Créons ensemble le trophée 
              qui reflète l&apos;innovation de votre organisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/devis"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Devis Personnalisé
              </Link>
              <Link
                href="/collaboration"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
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