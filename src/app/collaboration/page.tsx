import { Metadata } from 'next';
import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://adrianbauduin.com/collaboration',
  },
  robots: {
    index: false,
  },
};

const page = () => {
  return (
    <>
    <Navbar />  
    <div>
     <h1 className="text-3xl font-bold text-gray-900 py-8 text-center">Collaboration</h1>
    </div>
    <Footer />
    </>
  );
}

export default page