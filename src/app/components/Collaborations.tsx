"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';

interface DatabaseClient {
  id: string;
  name: string;
  logo: string;
  projectSlug: string;
}

interface DatabaseProject {
  id: string;
  title: string;
  slug: string;
  client: string;
  clientLogo: string;
  description: string;
  images: string[];
}

const Collaborations: React.FC = () => {
  const [animationSpeed, setAnimationSpeed] = useState<number>(40);
  const [isPaused, setIsPaused] = useState(false);
  const [clients, setClients] = useState<DatabaseClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true); // Set to true by default for debugging
  const logoRowRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []); // Remove isVisible dependency to avoid re-creating observer

  // Fetch projects and extract unique clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching clients data from projects...');
        
        const response = await fetch('/api/projects?limit=50');
        const data = await response.json();
        
        console.log('📡 Projects API response:', data);
        
        if (data.success && data.projects) {
          console.log(`📊 Found ${data.projects.length} projects`);
          
          // Extract unique clients with logos from projects
          const clientMap = new Map<string, DatabaseClient>();
          
          data.projects.forEach((project: DatabaseProject, index: number) => {
            console.log(`🎯 Project ${index + 1}:`, {
              title: project.title,
              client: project.client,
              clientLogo: project.clientLogo,
              hasClient: !!project.client,
              hasLogo: !!project.clientLogo
            });
            
            if (project.client && project.clientLogo) {
              const clientKey = project.client.toLowerCase();
              if (!clientMap.has(clientKey)) {
                clientMap.set(clientKey, {
                  id: project.id,
                  name: project.client,
                  logo: project.clientLogo,
                  projectSlug: project.slug
                });
                console.log(`✅ Added client: ${project.client} with logo: ${project.clientLogo}`);
              } else {
                console.log(`⚠️ Client ${project.client} already exists, skipping`);
              }
            } else {
              console.log(`❌ Project ${project.title} missing client or logo`);
            }
          });
          
          const clientsArray = Array.from(clientMap.values());
          console.log('🎨 Final extracted clients:', clientsArray);
          console.log(`📈 Total unique clients with logos: ${clientsArray.length}`);
          setClients(clientsArray);
        } else {
          console.error('Failed to load projects:', data.error);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load immediately on component mount
    fetchData();
  }, []); // Remove dependency on isVisible for debugging

  // Adjust animation speed based on screen width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Base speed calculation - adjust the divisor for faster/slower scrolling
      // For a typical viewport, we want the animation to take about 30 seconds
      const baseSpeed = window.innerWidth > 1200 ? 30 : 
                        window.innerWidth > 768 ? 25 : 20;
      
      setAnimationSpeed(baseSpeed);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to generate client slug from name
  const generateClientSlug = (clientName: string) => {
    return clientName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Function to handle logo hover
  const handleLogoHover = (isHovering: boolean) => {
    setIsPaused(isHovering);
  };

  // Don't render if no clients or still loading
  if (loading || clients.length === 0) {
    console.log('🚨 Collaborations render state:', {
      loading,
      clientsLength: clients.length,
      isVisible,
      clients: clients
    });
    
    return (
      <section id='collaborations' className="bg-white">
        <div className="container mx-auto text-center py-4">
          <h2 className="text-3xl md:text-6xl font-bold mb-16 text-gray-900">Partenaires</h2>
          {loading ? (
            <div className="text-gray-500">Chargement des partenaires...</div>
          ) : (
            <div className="text-gray-500">
              Aucun partenaire trouvé (Clients: {clients.length}, IsVisible: {isVisible.toString()})
              <br />
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Recharger
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  console.log('✅ Collaborations rendering with clients:', clients);

  return (
    <section id='collaborations' className="bg-white" ref={sectionRef}>
      <div className="container mx-auto text-center py-4">
        <h2 className="text-3xl md:text-6xl font-bold mb-16 text-gray-900">Partenaires</h2>
        
        {/* Animated logos row */}
        <div 
          className="relative w-full overflow-hidden mb-12 h-28 rounded-lg p-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ position: 'relative' }}
        >
          <div 
            ref={logoRowRef}
            className="flex items-center absolute whitespace-nowrap"
            style={{
              animation: `scrollLeftToRight ${animationSpeed}s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
              display: 'flex',
              gap: '4rem',
              width: 'max-content'
            }}
          >
            {/* First set of logos */}
            {clients.map((client, index) => (
              <div 
                key={client.id} 
                className="w-32 h-20 relative flex-shrink-0 cursor-pointer"
                onMouseEnter={() => handleLogoHover(true)}
                onMouseLeave={() => handleLogoHover(false)}
                title={`Voir le trophée pour ${client.name}`}
              >
                <Link href={`/trophee/${client.projectSlug}`}>
                  <Image
                    src={client.logo}
                    alt={`Logo ${client.name}`}
                    fill={true}
                    style={{ objectFit: 'contain' }}
                    className="transition-transform duration-500 hover:scale-125"
                  />
                </Link>
              </div>
            ))}

            {/* Second set of identical logos for seamless looping */}
            {clients.map((client, index) => (
              <div 
                key={`second-${client.id}`} 
                className="w-32 h-20 relative flex-shrink-0 cursor-pointer"
                onMouseEnter={() => handleLogoHover(true)}
                onMouseLeave={() => handleLogoHover(false)}
                title={`Voir le trophée pour ${client.name}`}
              >
                <Link href={`/trophee/${client.projectSlug}`}>
                  <Image
                    src={client.logo}
                    alt={`Logo ${client.name}`}
                    fill={true}
                    style={{ objectFit: 'contain' }}
                    className="transition-transform duration-500 hover:scale-125"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaborations;
