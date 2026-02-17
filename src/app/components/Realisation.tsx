'use client';

import React, { useEffect, useState, useRef } from 'react';
import ProjectCard from './ProjectCard';
import { DatabaseProject } from '@/types';

const Realisation = () => {
  const [projects, setProjects] = useState<DatabaseProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before the section comes into view
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all projects, sorted by creation date
      const response = await fetch('/api/projects?limit=20', {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      } else {
        setError(`Failed to load projects: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(`Error loading projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchProjects();
    }
  }, [isVisible]);

  // Add a refresh function that can be called when needed
  const refreshProjects = () => {
    fetchProjects();
  };

  if (loading) {
    return (
      <section id="realisations">
        <div className="mx-auto px-4 py-30">
          <h2 className="text-3xl sm:text-3xl lg:text-6xl text-center font-semibold tracking-tight text-gray-900 m-4 pb-8">Réalisations</h2>
          <div className="text-center text-gray-500">Chargement des projets...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="realisations">
        <div className="mx-auto px-4 py-30">
          <h2 className="text-3xl sm:text-3xl lg:text-6xl text-center font-semibold tracking-tight text-gray-900 m-4 pb-8">Réalisations</h2>
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
              onClick={refreshProjects}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry Loading Projects
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Adding anchor section for navigation */}
      <section id="realisations" ref={sectionRef}>
        <div className="mx-auto px-4 py-30">
          <h2 className="text-3xl sm:text-3xl lg:text-6xl text-center font-semibold tracking-tight text-gray-900 m-4 pb-8">Réalisations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:px-12 sm:gap-16">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Realisation;
