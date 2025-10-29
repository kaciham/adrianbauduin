'use client';

import React from 'react';
import { DatabaseProject } from '@/types';

interface ProjectStatsProps {
  project: DatabaseProject;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ project }) => {
  const stats = [
    {
      label: 'Projet créé',
      value: new Date(project.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long'
      }),
      icon: '📅'
    },
    {
      label: 'Images',
      value: `${project.images?.length || 0} photo${(project.images?.length || 0) > 1 ? 's' : ''}`,
      icon: '🖼️'
    }
  ];

  if (project.tags && project.tags.length > 0) {
    stats.push({
      label: 'Catégories',
      value: `${project.tags.length} tag${project.tags.length > 1 ? 's' : ''}`,
      icon: '🏷️'
    });
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques du projet</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  {stat.label}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStats;