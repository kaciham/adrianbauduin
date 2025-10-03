const url = 'https://portfolio-adrianbauduin.vercel.app';

// Configuration centralisée des données business
const businessInfo = {
  name: "Adrian Bauduin - Trophées en bois sur mesure",
  description: "Ébéniste passionné spécialisé dans la création de trophées en bois sur mesure, alliant savoir-faire traditionnel et design contemporain, opérant dans lille et sa région",
  image: `${url}/projects/adrianprofile2.webp`,
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

