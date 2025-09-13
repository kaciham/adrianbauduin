import React from 'react';
import ChatWidget from '../components/ChatWidget';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const page = () => {
  return (
    <div>
      <Navbar />
        <h2 className="text-black text-4xl text-center my-10">Devis</h2>
      <ChatWidget />
      <Footer />
    </div>
  ) 
}

export default page
