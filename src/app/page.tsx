'use client'
import Hero from "./components/Hero";
import About from "./components/About";
import Contact from "./components/Contact";
import Realisation from "./components/Realisation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Collaborations from "./components/Collaborations";
import TopIcon from "./components/TopIcon";
import { useEffect, useState } from "react";

export default function Home() {

   const [scrolled, setScrolled] = useState(false)
     
       useEffect(() => {
         const handleScroll = () => {
           setScrolled(window.scrollY > window.innerHeight * 0.2)
         }
         window.addEventListener('scroll', handleScroll)
         return () => window.removeEventListener('scroll', handleScroll)
       }, [])
 
     const scrollToTop = () => {
         if (scrolled) {
             window.scrollTo({ top: 0, behavior: 'smooth' });
         }
     };

  return (
    <div className="scroll-smooth">
    <Navbar />
    <Hero />
    <About />
    <Realisation />
    <Collaborations />
    <Contact />
    
    
      <Footer />
         {scrolled && (
        <div
          className='w-14 h-14 sm:w-18 sm:h-18 fixed bottom-5 rounded-full right-5  bg-slate-200 opacity-90 border-4 p-2 shadow-custom cursor-pointer transition-transform duration-300 ease-in-out hover:delay-200 hover:-translate-y-2'
          onClick={scrollToTop}
        >
          <TopIcon />
        </div>
      )}
    </div>
  );
}
  