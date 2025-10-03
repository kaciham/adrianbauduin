import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ - Questions Fréquentes | Adrian Bauduin Ébéniste',
  description: 'Toutes les réponses à vos questions sur la création de trophées en bois sur mesure. Délais, matériaux, processus de création...',
  openGraph: {
    title: 'FAQ - Adrian Bauduin - Trohphées en bois sur mesure à lille',
    description: 'Réponses aux questions fréquentes sur nos créations de trophées sur mesure',
  }
};

export default function FAQPage() {
  const faqData = [
    {
      question: "Quels sont les délais pour créer un trophée sur mesure ?",
      answer: "Les délais varient selon la complexité du projet, généralement entre 2 à 4 semaines. Pour les commandes urgentes, nous pouvons proposer des solutions accélérées."
    },
    {
      question: "Quels types de bois utilisez-vous ?",
      answer: "Nous travaillons principalement avec du chêne massif, du contreplaqué bouleau finlandais, et des essences locales certifiées. Tous nos bois sont sélectionnés pour leur qualité et leur durabilité."
    },
    {
      question: "Proposez-vous la gravure et la personnalisation ?",
      answer: "Oui, nous proposons la gravure laser haute précision, l'impression UV directe, et diverses techniques de personnalisation pour rendre chaque trophée unique."
    },
    {
      question: "Dans quelle zone livrez-vous ?",
      answer: "Nous livrons dans toute la région Hauts-de-France et dans un rayon de 100km autour de Lille. Livraison et installation possibles selon les projets."
    },
    {
      question: "Quel est le processus de commande ?",
      answer: "1) Contact et brief de votre projet, 2) Conception et devis gratuit, 3) Validation du design, 4) Fabrication artisanale, 5) Livraison et installation si nécessaire."
    },
    {
      question: "Proposez-vous des finitions écologiques ?",
      answer: "Absolument ! Nous privilégions les huiles naturelles Osmo, les vitrificateurs écologiques, et des techniques respectueuses de l'environnement."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Tout ce que vous devez savoir sur la création de trophées en bois sur mesure
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {faqData.map((faq, index) => (
                <article key={index} className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {faq.question}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-16 bg-amber-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Une autre question ?</h2>
              <p className="text-gray-700 mb-6">
                N&apos;hésitez pas à nous contacter pour discuter de votre projet spécifique
              </p>
              <Link
                href="/collaboration"
                className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}