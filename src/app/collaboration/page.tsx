import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';

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