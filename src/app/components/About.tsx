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

      <div className="flex flex-col justify-center items-center md:flex-row gap-8 m-8">
        <div className="flex flex-col justify-evenly gap-8 text-black v-full">
            <h2 className="font-bold text-2xl md:text-3xl mb-4">Un trophée pour chaque occasion</h2>
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
         <Image
            src="/projects/trophee-dfcg-hauts-de-france-2025-prix-finance.webp"
            alt="Adrian Bauduin trophées en bois sur mesure"
            width={400}
            height={100}
            className='py-2 rounded-3xl hover:scale-105 transition-transform'
            />
    </div>
      </div>
    
      <div className="flex justify-center">
        <Link
          href="/contact"
          className="inline-block bg-white md:w-auto text-black px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 uppercase text-sm md:text-lg font-semibold tracking-widest text-center mx-auto mb-10 w-full"
        > 
          Réalisations
        </Link>
      </div>

      <div>
        <h2 className="font-bold text-2xl md:text-3xl mb-4 text-black text-center ">Des techniques modernes</h2>
        <div className="text-black">
          <div className="flex flex-row">
            <Image src="/path/to/image.jpg" alt="Découpe laser" width={400} height={300} />
            <div>
              <h3>Découpe laser</h3>
              <p>Précision et finesse pour des formes complexes.</p>
            </div>
          </div>
          <div  className="flex flex-row-reverse">
            <Image src="/path/to/image.jpg" alt="Découpe laser" width={400} height={300} />
            <div>
              <h3>Découpe laser</h3>
              <p>Précision et finesse pour des formes complexes.</p>
            </div>
          </div>
          <div  className="flex flex-row">
            <Image src="/path/to/image.jpg" alt="Découpe laser" width={400} height={300} />
            <div>
              <h3>Découpe laser</h3>
              <p>Précision et finesse pour des formes complexes.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 my-10 px-4 md:px-0 text-black">
          <Image src="/path/to/image.jpg" alt="Atelier de fabrication" width={800} height={400} />
          <div>
            <h2>Designer et Ébéniste</h2>
            <p>
Formé au design d’objet et passionné par le bois, j’allie créativité et savoir-faire artisanal pour concevoir des trophées uniques. Mon approche associe l’élégance du design contemporain à la précision de l’ébénisterie traditionnelle, afin de créer des pièces sur mesure qui allient esthétisme et durabilité.

Grâce aux techniques modernes comme la fraiseuse CNC, la découpe laser ou l’impression UV, chaque projet prend vie avec originalité et précision. Mes trophées reflètent à la fois l’œil du designer et la main de l’artisan.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 min-h-[66vh] bg-cover bg-center"
            style={{ backgroundImage: "url('/projects/trophée-design-contreplaqué-gravure-impression.webp')" }}>
            <div className="bg-opacity-90 p-6 rounded-lg max-w-2xl text-black m-4">

              <h3>Matériaux
nobles &
durables</h3>
              <p>
J’utilise principalement du bois massif (chêne, hêtre, érable, noyer) ainsi que du contreplaqué de qualité selon
les besoins esthétiques et techniques. Chaque essence de bois est choisie pour son grain, sa teinte et sa durabilité.

En choisissant un trophée en bois, vous optez pour une alternative écologique et durable aux trophées en plastique ou métal.
</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default About
