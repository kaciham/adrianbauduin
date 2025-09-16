import Hero from "./components/Hero";
import About from "./components/About";
import Contact from "./components/Contact";
import Realisation from "./components/Realisation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Collaborations from "./components/Collaborations";

export default function Home() {
  return (
    <div className="scroll-smooth">
    <Navbar />
    <Hero />
    <About />
    <Realisation />
    <Collaborations />
    <Contact />
    <Footer />
    </div>
  );
}
  