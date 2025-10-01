import React from 'react'
import Image from 'next/image'

const About = () => {
  return (
    <div className='bg-white'>
      <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 m-4 md:m-8 text-gray-900 w-full max-w-7xl">
          <Image
            src="/projects/createur-trophee-design-ecoposs.webp"
            alt="Atelier de fabrication"
            width={600}
            height={400}
            className="w-full md:w-1/2 rounded-3xl transition-all duration-300 hover:sepia shadow-xl"
          />
          <div className="w-full md:w-1/2">
            <h2 className='font-extrabold text-2xl text-center md:text-3xl m-4 mb-8'>Présentation</h2>
            <p className='text-justify px-4 sm:px-6 md:px-0'>
     Je suis designer ébéniste spécialisé dans la création de trophées sur mesure en bois. 
          J&apos;imagine et fabrique des pièces uniques qui allient artisanat traditionnel et technologies modernes comme la découpe laser, l&apos;impression UV ou la fraiseuse numérique CNC. Que ce soit pour une entreprise, une compétition sportive ou un événement particulier, je conçois des trophées élégants, durables et personnalisés selon vos besoins.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse justify-center items-center gap-8 m-4 md:m-8 text-gray-900 w-full max-w-7xl">
          <Image
            src="/projects/adrianprofile2.webp"
            alt="Atelier de fabrication"
            width={600}
            height={500}
            className="w-full md:w-1/2 rounded-3xl transition-all duration-300 hover:grayscale shadow-xl"
          />
          <div className="w-full md:w-1/2">
            <h2 className='font-extrabold text-2xl text-center md:text-3xl m-4 mb-8'>Designer & Ébéniste</h2>
            <p className='text-justify px-4 sm:px-6 md:px-0'>
     Formé au design d&apos;objet et passionné par le bois, j&apos;allie créativité et savoir-faire artisanal pour concevoir des trophées uniques. Mon approche associe l&apos;élégance du design contemporain à la précision de l&apos;ébénisterie traditionnelle, afin de créer des pièces sur mesure qui allient esthétisme et durabilité.

      Grâce aux techniques modernes comme la fraiseuse CNC, la découpe laser ou l&apos;impression UV, chaque projet prend vie avec originalité et précision. Mes trophées reflètent à la fois l&apos;œil du designer et la main de l&apos;artisan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
