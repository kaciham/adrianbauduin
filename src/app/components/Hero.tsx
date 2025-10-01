import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    //accueil navigation
    <section id="hero" className="flex flex-col justify-center items-center gap-4 h-[90vh] bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/projects/trophée-design-contreplaqué-gravure-impression.webp')" }}>
      <div className="w-full max-w-[500px] px-4 flex flex-col items-center">
        <Image
          src="./projects/logo_adrian_bauduin_blanc.svg"
          alt="Adrian Bauduin trophées en bois sur mesure"
          width={400}
          height={100}
          style={{ width: 'auto', height: 'auto' }}
          className='py-2'
        /> 
        <h1 className="uppercase mt-2 py-2 text-center w-full text-lg sm:text-lg md:text-2xl lg:text-2xl tracking-widest text-bold" >
          trophées en bois sur mesure
        </h1>
      </div>
      <Link
      href="/#contact"
      className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest"
      >
     Contactez-moi
      </Link>
    </section>
    )
}

export default Hero
