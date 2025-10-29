'use client';

import ProjectGallery from '../components/ProjectGallery';
import Header from '../components/Header';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProjectGallery />
    </div>
  );
}