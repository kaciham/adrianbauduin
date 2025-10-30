'use client';

import React, { useEffect } from 'react';

const GoogleReviews = () => {
  useEffect(() => {
    // Ensure the Sociablekit widget script is loaded
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://widgets.sociablekit.com/google-reviews/widget.js';
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-6xl font-bold mb-6 text-gray-900">
            Avis Clients
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que nos clients pensent de nos créations
          </p>
        </div>
        
        {/* Sociablekit Google Reviews Widget */}
        <div className="max-w-6xl mx-auto">
          <div 
            className="sk-ww-google-reviews" 
            data-embed-id="25616483"
          ></div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;