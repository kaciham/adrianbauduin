import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Ébéniste à Lille | Adrian Bauduin - Créateur de Trophées Sur Mesure',
  description: "Ébéniste créateur à Lille, spécialisé en trophées bois sur mesure : gravure laser, impression UV et CNC pour événements d'entreprise, sportifs et culturels.",
  keywords: 'ébéniste Lille, menuisier Lille, artisan bois Nord, trophée sur mesure Lille, ébéniste Hauts-de-France, créateur bois Lambersart',
  alternates: {
    canonical: 'https://adrianbauduin.com/ebeniste-lille',
  },
  openGraph: {
    title: 'Adrian Bauduin - Designer et ébéniste, créateur de trophées en bois sur mesure à Lille',
    description: "Ébéniste créateur à Lille, spécialisé en trophées bois sur mesure : gravure laser, impression UV et CNC pour événements d'entreprise, sportifs et culturels.",
    images: ['/projects/adrianprofile2.webp'],
  }
};

export default function EbenisteLillePage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Adrian Bauduin - Designer et ébéniste, créateur de trophées en bois sur mesure à Lille",
    "description": "Ébéniste créateur à Lille, spécialisé en trophées bois sur mesure : gravure laser, impression UV et CNC pour événements d'entreprise, sportifs et culturels.",
    "url": "https://adrianbauduin.com/ebeniste-lille",
    "provider": {
      "@type": "Person",
      "name": "Adrian Bauduin"
    },
    "areaServed": [
      "Lille",
      "Lambersart", 
      "Villeneuve-d'Ascq",
      "Roubaix",
      "Tourcoing",
      "Hauts-de-France"
    ],
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
        {/* Hero */}
        <header className="bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-4 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Ébéniste Créateur à <span className="text-amber-600">Lille</span>
                </h1>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Passionné par le <strong>travail du bois</strong>, je crée des <strong>trophées sur mesure</strong>  
                   qui allient tradition artisanale et design contemporain. Mon atelier près de Lille 
                  est au service de vos projets les plus ambitieux.
                </p>
                {/* <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/devis"
                    className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
                  >
                    Devis Gratuit
                  </Link>
                  <Link
                    href="/#realisations"
                    className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg hover:bg-amber-600 hover:text-white transition-colors text-center"
                  >
                    Voir Mes Créations
                  </Link>
                </div> */}
              </div>
              <div className="relative">
                <Image
                  src="/projects/adrianprofile2.webp"
                  alt="Adrian Bauduin, ébéniste créateur à Lille dans son atelier"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </header>

        {/* Zone de service */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Zone d'Intervention</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Basé près de Lille, j&apos;interviens dans toute la région</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    <strong>Lille</strong> et métropole lilloise
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    <strong>Lambersart, Villeneuve-d'Ascq</strong>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    <strong>Roubaix, Tourcoing</strong>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    <strong>Arras, Béthune</strong>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Toute la région <strong>Hauts-de-France</strong>
                  </li>
                </ul>
                <p className="mt-6 text-gray-600">
                  Livraison et installation possible dans un rayon de 100km autour de Lille.
                </p>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg">
                <h4 className="text-xl font-semibold mb-4">Pourquoi Choisir Un Ébéniste Local ?</h4>
                <ul className="space-y-3 text-gray-700">
                  <li>✓ <strong>Proximité</strong> : Échanges directs et suivi personnalisé</li>
                  <li>✓ <strong>Réactivité</strong> : Délais courts et flexibilité</li>
                  <li>✓ <strong>Économie locale</strong> : Soutien de l'artisanat régional</li>
                  <li>✓ <strong>Livraison</strong> : Transport sécurisé par mes soins</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Mon Expertise d'Ébéniste</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">🔨 Techniques Traditionnelles</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Rabotage et dégauchissage</li>
                  <li>• Assemblages traditionnels</li>
                  <li>• Finitions à l'huile naturelle</li>
                  <li>• Sculpture et marqueterie</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">⚡ Technologies Modernes</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Fraiseuse numérique CNC</li>
                  <li>• Gravure laser haute précision</li>
                  <li>• Impression UV directe</li>
                  <li>• Découpe assistée par ordinateur</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">🌱 Matériaux Nobles</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Chêne massif européen</li>
                  <li>• Contreplaqué bouleau finlandais</li>
                  <li>• Bois upcyclés et durables</li>
                  <li>• Essences locales certifiées</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        {/* <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Ce Que Disent Mes Clients</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <blockquote className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-700 mb-4 italic">
                  &ldquo;Un travail exceptionnel ! Adrian a su traduire notre vision en un trophée unique 
                  qui a marqué notre événement. Sa créativité et son professionnalisme font la différence.&rdquo;
                </p>
                <footer className="text-sm text-gray-600">
                  — <strong>CIC Nord Ouest</strong>, concours Start Innovation
                </footer>
              </blockquote>
              <blockquote className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-700 mb-4 italic">
                  &ldquo;Depuis 3 ans, Adrian réalise nos trophées avec une constance remarquable. 
                  Délais respectés, qualité irréprochable, nous le recommandons sans hésiter.&rdquo;
                </p>
                <footer className="text-sm text-gray-600">
                  — <strong>DFCG Hauts-de-France</strong>, trophées Finance & Gestion
                </footer>
              </blockquote>
            </div>
          </div>
        </section> */}

        {/* Contact local */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Discutons de Votre Projet</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Basé près de Lille, je suis à votre écoute pour créer ensemble le trophée 
              qui valorisera votre événement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link
                href="/#realisations"
                 className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
              >
                Voir Mes Créations
              </Link>
              <Link
                href="/#contact"
                className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
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