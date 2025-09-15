import { projects } from '@/contents/projects'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Realisation = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="font-extrabold text-2xl md:text-3xl  text-black text-center my-12 ">Réalisations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:px-12 sm:gap-12  ">
        {projects.map((project) => (
          <Link href={`/trophee/${project.id}`} key={project.id}>
            <div className="bg-white  rounded-lg shadow-xl overflow-hidden transform transition-transform hover:scale-105 cursor-pointer">
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-black text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Realisation
