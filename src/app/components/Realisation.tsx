import React from 'react';
import ProjectCard from './ProjectCard';
import connectToDatabase from '@/lib/mongodb';
import { Project } from '@/models/Project';
import { DatabaseProject } from '@/types';

async function getProjects(): Promise<DatabaseProject[]> {
  try {
    await connectToDatabase();
    const projects = await Project.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return projects.map((p: any) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      description: p.description,
      client: p.client,
      clientLogo: p.clientLogo,
      images: p.images,
      tags: p.tags,
      year: p.year,
      materials: p.materials,
      techniques: p.techniques,
      technologies: p.technologies,
      createdAt: p.createdAt?.toISOString() ?? '',
      updatedAt: p.updatedAt?.toISOString(),
      createdBy: p.createdBy,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

const Realisation = async () => {
  const projects = await getProjects();

  return (
    <section id="realisations">
      <div className="mx-auto px-4 py-30">
        <h2 className="text-3xl sm:text-3xl lg:text-6xl text-center font-semibold tracking-tight text-gray-900 m-4 pb-8">Réalisations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:px-12 sm:gap-16">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Realisation;
