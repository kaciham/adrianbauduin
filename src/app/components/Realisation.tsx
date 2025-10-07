import { projects } from '@/contents/projects'
import React from 'react'
import ProjectCard from './ProjectCard'

const Realisation = () => {
  //réalisations navigation
  return (
    <>
      {/* Adding anchor section for navigation */}
      <section id="realisations">
        <div className="  mx-auto px-4 py-30">
          
          <h2 className="text-3xl sm:text-3xl lg:text-6xl text-center font-semibold tracking-tight text-gray-900 m-4 pb-8">Réalisations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:px-12 sm:gap-16  ">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Realisation
