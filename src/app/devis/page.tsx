import React from 'react';
import ChatWidget from '../components/ChatWidget';
import Footer from '../components/Footer';
import NavbarFixed from '../components/NavbarFixed';

const page = () => {
  return (
    <div>
      <NavbarFixed />
        <h2 className="text-black text-4xl text-center my-10">Devis</h2>
      <ChatWidget />
      <Footer />
    </div>
  ) 
}

export default page
