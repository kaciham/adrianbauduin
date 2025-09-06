import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const About = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center my-10">
        <p className="text-black text-justify my-8 px-4 md:px-0 max-w-4xl">
          Je suis designer ébéniste spécialisé dans la création de trophées sur mesure en bois. J’imagine et fabrique des pièces uniques qui allient artisanat traditionnel et technologies modernes comme la découpe laser, l’impression UV ou la fraiseuse numérique CNC. Que ce soit pour une entreprise, une compétition sportive ou un événement particulier, je conçois des trophées élégants, durables et personnalisés selon vos besoins.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 my-8">
        <div className="flex flex-col md:flex-row gap-8 text-black">
          <h2>Un trophée pour chaque occasion</h2>
          <div>
            <h3>entreprise</h3>
            <p>récompenses personnalisées pour valoriser vos collaborateurs ou partenaires.</p>
          </div>
          <div>
            <h3>sport</h3>
            <p>
              trophées sportifs
              gravés ou imprimés,
              robustes et originaux.
            </p>
          </div>
          <div>
            <h3>événementiel</h3>
            <p>
              cérémonies, mariages,
              commémorations,
              créations uniques
              et symboliques.
            </p>
          </div>
        </div>

        <div>
          <Image src="/path/to/image.jpg" alt="Trophée personnalisé" width={400} height={300} />
        </div>
      </div>

      <Link
        href="/contact"
        className="inline-block bg-white md:w-auto text-black px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
      >
        Réalisations
      </Link>

      <div>
        <h2 className="text-black">Des techniques modernes</h2>
        <div className="text-black">
          <div>
            <Image src="/path/to/image.jpg" alt="Découpe laser" width={400} height={300} />
            <div>
              <h3>Découpe laser</h3>
              <p>Précision et finesse pour des formes complexes.</p>
            </div>
          </div>
          <div>
            <Image src="/path/to/image.jpg" alt="Découpe laser" width={400} height={300} />
            <div>
              <h3>Découpe laser</h3>
              <p>Précision et finesse pour des formes complexes.</p>
            </div>
          </div>
          <div>
            <Image src="/path/to/image.jpg" alt="Découpe laser" width={400} height={300} />
            <div>
              <h3>Découpe laser</h3>
              <p>Précision et finesse pour des formes complexes.</p>
            </div>
          </div>
        </div>
        <div>
          <Image src="/path/to/image.jpg" alt="Atelier de fabrication" width={800} height={400} />
          <div>
            <h2>Designer et Ébéniste</h2>
            <p>
Formé au design d’objet et passionné par le bois, j’allie créativité et savoir-faire artisanal pour concevoir des trophées uniques. Mon approche associe l’élégance du design contemporain à la précision de l’ébénisterie traditionnelle, afin de créer des pièces sur mesure qui allient esthétisme et durabilité.

Grâce aux techniques modernes comme la fraiseuse CNC, la découpe laser ou l’impression UV, chaque projet prend vie avec originalité et précision. Mes trophées reflètent à la fois l’œil du designer et la main de l’artisan.</p>
          </div>
        </div>
        <div>
             <div>
              <h3>Découpe laser</h3>
              <p>Précision et finesse pour des formes complexes.</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default About
