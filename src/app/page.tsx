import Hero from "./components/Hero";
import About from "./components/About";
import Contact from "./components/Contact";
import Realisation from "./components/Realisation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Collaborations from "./components/Collaborations";
import GoogleReviews from "./components/GoogleReviews";
import ScrollToTop from "./components/ScrollToTop";

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Adrian Bauduin - Ébéniste créateur de trophées sur mesure",
  "description": "Ébéniste créateur à Lille, spécialisé en trophées bois sur mesure : gravure laser, impression UV et CNC pour événements d'entreprise, sportifs et culturels.",
  "url": "https://adrianbauduin.com"
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <div className="scroll-smooth">
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Realisation />
          <Collaborations />
          <GoogleReviews />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
