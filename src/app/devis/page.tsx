'use client';
import React from 'react';
import ChatWidget from '../components/ChatWidget';
import Footer from '../components/Footer';
import NavbarFixed from '../components/NavbarFixed';
import Contact from '../components/Contact';

const page = () => {
  return (
    <div>
      <NavbarFixed />
        <h2 className="text-gray-900 text-4xl pt-12 text-center my-10">Devis</h2>
      <ChatWidget />
      <Contact />
      <Footer />
    </div>
  ) 
}

export default page
