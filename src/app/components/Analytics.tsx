'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') return;

    // Initialize gtag if not already done
    if (typeof window !== 'undefined') {
      // Set up dataLayer if it doesn't exist
      window.dataLayer = window.dataLayer || [];
      
      // Define gtag function if it doesn't exist
      if (!window.gtag) {
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
      }

      // Load the GA script if not already loaded
      if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}"]`)) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
        document.head.appendChild(script);

        script.onload = () => {
          if (window.gtag) {
            window.gtag('js', new Date());
            window.gtag('config', GA_TRACKING_ID, {
              page_location: window.location.href,
              page_title: document.title,
              anonymize_ip: true,
              respect_dnt: true,
            });
          }
        };
      }
    }
  }, []);

  useEffect(() => {
    if (!GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') return;

    // Wait for gtag to be available before tracking page views
    const trackPageView = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        const url = pathname + (searchParams ? searchParams.toString() : '');
        pageview(url);
      } else {
        // Retry after a short delay if gtag is not ready
        setTimeout(trackPageView, 100);
      }
    };

    trackPageView();
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}