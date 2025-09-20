import { projects } from '@/contents/projects'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ProjectCard from './ProjectCard'

const Realisation = () => {
  //réalisations navigation
  return (
    <>
      {/* Adding anchor section for navigation */}
      <section id="realisations">
        <div className="container mx-auto px-4 py-8">
          <h2 className="font-extrabold text-2xl md:text-3xl  text-black text-center my-12 ">Réalisations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:px-12 sm:gap-12  ">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Realisation
