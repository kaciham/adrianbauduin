const url = 'https://adrianbauduin.com';

// Configuration centralisée des données business
const businessInfo = {
  name: "Adrian Bauduin - Designer et ébéniste, créateur de trophées en bois sur mesure à Lille",
  description: "Ébéniste créateur à Lille, spécialisé en trophées bois sur mesure : gravure laser, impression UV et CNC pour événements d'entreprise, sportifs et culturels.",
  image: `${url}/projects/createur-trophee-design-ecoposs.webp`,
  twitterImage: `${url}/projects/createur-trophee-design-ecoposs.webp`,
  url: url,
  telephone: "+33623284237",
  address: {
    streetAddress: "30 Rue Henri Regnault",
    addressLocality: "Lille",
    postalCode: "59000",
    addressCountry: "FR"
  },
  coordinates: {
    latitude: 50.6292,
    longitude: 3.0573
  },
  socialMedia: {
    linkedin: "https://www.linkedin.com/in/adrian-bauduin-1b152b220/",
    instagram: "https://www.instagram.com/adrianbauduin/"
  }
};

// Données structurées JSON-LD pour LocalBusiness
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": businessInfo.name,
  "image": businessInfo.image,
  "@id": businessInfo.url,
  "url": businessInfo.url,
  "telephone": businessInfo.telephone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": businessInfo.address.streetAddress,
    "addressLocality": businessInfo.address.addressLocality,
    "postalCode": businessInfo.address.postalCode,
    "addressCountry": {
      "@type": "Country",
      "name": "FR"
    }
  },
  "description": businessInfo.description,
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": businessInfo.coordinates.latitude,
    "longitude": businessInfo.coordinates.longitude
  },
  "priceRange": "€€",
  "hasMap": `https://www.google.com/maps/place/Lille/@${businessInfo.coordinates.latitude},${businessInfo.coordinates.longitude},17z`,
  "sameAs": [
    businessInfo.socialMedia.linkedin,
    businessInfo.socialMedia.instagram
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "http://schema.org/Monday",
      "http://schema.org/Tuesday",
      "http://schema.org/Wednesday",
      "http://schema.org/Thursday", 
      "http://schema.org/Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  }
};

// Export des données business pour utilisation dans layout.tsx
export { businessInfo };

