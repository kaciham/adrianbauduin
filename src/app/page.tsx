import Hero from "./components/Hero";
import About from "./components/About";
import Contact from "./components/Contact";
import Realisation from "./components/Realisation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="scroll-smooth">
    <Navbar />
    <Hero />
    <About />
    <Realisation />
    <Contact />
    <Footer />
    </div>
  );
}
  