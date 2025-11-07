'use client';

import React, { useEffect, useRef } from 'react';

const GoogleReviews = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const loadAndInitWidget = () => {
      if (typeof window === 'undefined') return;

      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://widgets.sociablekit.com/google-reviews/widget.js"]');
      
      if (!existingScript && !scriptLoadedRef.current) {
        // Load script for the first time
        const script = document.createElement('script');
        script.src = 'https://widgets.sociablekit.com/google-reviews/widget.js';
        script.defer = true;
        script.onload = () => {
          scriptLoadedRef.current = true;
          // Initialize widget after script loads
          if (window.SociableKitReviews) {
            window.SociableKitReviews.init();
          }
        };
        document.head.appendChild(script);
      } else {
        // Script already loaded, just reinitialize the widget
        scriptLoadedRef.current = true;
        if (window.SociableKitReviews) {
          window.SociableKitReviews.init();
        }
      }
    };

    loadAndInitWidget();
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
            ref={widgetRef}
            className="sk-ww-google-reviews" 
            data-embed-id="25616483"
          ></div>
        </div>
      </div>
    </section>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SociableKitReviews?: {
      init: () => void;
    };
  }
}

export default GoogleReviews;