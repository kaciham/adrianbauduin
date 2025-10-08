import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MobileBackgroundImage from './MobileBackgroundImage'

const About = () => {
  return (
    <div className='bg-white'>
      <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 md:px-8">
        {/* <p className="text-gray-900 text-justify my-8 px-4 md:mx-4 max-w-4xl">
          Je suis designer ébéniste spécialisé dans la création de trophées sur mesure en bois. &nbsp;
          J'imagine et fabrique des pièces uniques qui allient artisanat traditionnel et technologies modernes comme la découpe laser, l'impression UV ou la fraiseuse numérique CNC. Que ce soit pour une entreprise, une compétition sportive ou un événement particulier, je conçois des trophées élégants, durables et personnalisés selon vos besoins.
        </p> */}
        <div className="flex flex-col md:flex-row justify-center px-auto items-center gap-8 m-4 md:m-8 text-gray-900 w-full max-w-7xl">
          <Image
            src="/projects/createur-trophee-design-ecoposs.webp"
            alt="createur-trophee-design-ecoposs"
            width={600}
            height={400}
            className="w-full md:w-1/2 rounded-3xl transition-all duration-300 hover:sepia shadow-xl"
          />  
          <div className="w-full md:w-1/2 sm:px-12 ">
            <h2 className='font-extrabold text-2xl text-center md:text-3xl mb-8'>Présentation</h2>
            <p className='text-justify px-4 sm:px-6 md:px-0 text-base'>
         Je suis designer ébéniste spécialisé dans la création de trophées sur mesure en bois. &nbsp; 
         <br />
         <br />
            J&apos;imagine et fabrique des pièces uniques qui allient artisanat traditionnel et technologies modernes comme la découpe laser, l&apos;impression UV ou la fraiseuse numérique CNC.
          <br />
          <br />    
             Que ce soit pour une entreprise, une compétition sportive ou un événement particulier, je conçois des trophées élégants, durables et personnalisés selon vos besoins.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse justify-center items-center gap-8 m-4 md:m-8 text-gray-900 w-full max-w-7xl">
          <Image
            src="/projects/adrianprofile2.webp"
            alt="adrian-bauduin-ébéniste-créateur-de-trophées-sur-mesure"
            width={600}
            height={500}
            className="w-full md:w-1/2 rounded-3xl transition-all duration-300 hover:grayscale shadow-xl"
          />
          <div className="w-full md:w-1/2 sm:px-12">
            <h2 className='font-extrabold text-2xl text-center md:text-3xl m-4 mb-8'>Designer & Ébéniste</h2>
            <p className='text-justify px-4 sm:px-6 md:px-0 text-base'>
     Formé au design d&apos;objet et passionné par le bois, j&apos;allie créativité et savoir-faire artisanal pour concevoir des trophées uniques.
     
     <br />
     <br />
      Mon approche associe l&apos;élégance du design contemporain à la précision de l&apos;ébénisterie traditionnelle, afin de créer des pièces sur mesure qui allient esthétisme et durabilité.
      <br />
      <br />
      Grâce aux techniques modernes comme la fraiseuse CNC, la découpe laser ou l&apos;impression UV, chaque projet prend vie avec originalité et précision. Mes trophées reflètent à la fois l&apos;œil du designer et la main de l&apos;artisan.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-center items-center w-full md:flex-row-reverse md:py-8 gap-4 m-4 md:m-8 max-w-7xl text-base">
          <div className="flex flex-col justify-center items-center gap-8 text-gray-900 flex-1 w-full md:w-auto">
          
          <div className="text-center w-full md:w-auto">
             <h2 className="font-extrabold text-2xl md:text-3xl m-4 mb-8">Un trophée pour chaque occasion</h2>
            <h3 className="font-bold text-xl mb-2 uppercase">entreprise</h3>
            <p className='md:px-26 px-4 sm:px-32'>récompenses personnalisées pour valoriser vos collaborateurs ou partenaires.</p>
          </div>
          <div className="text-center w-full md:w-auto">
            <h3 className="font-bold text-xl mb-2 uppercase">sport</h3>
            <p  className='md:px-26 px-4 sm:px-32'>
          trophées sportifs
          gravés ou imprimés,
          robustes et originaux.
            </p>
          </div>
          <div className="text-center w-full md:w-auto">
            <h3 className="font-bold text-xl mb-2 uppercase">événementiel</h3>
            <p  className='md:px-26 px-4 sm:px-32'>
          cérémonies, mariages,
          commémorations,
          créations uniques
          et symboliques.
            </p>
          </div>
          </div>
          <div className="flex-1 flex justify-center items-center w-full md:w-auto">
        <Image
          src="/projects/trophee-dfcg-hauts-de-france-2025-prix-finance.webp"
          alt="trophee-dfcg-hauts-de-france-2025-prix-finance"
          width={400}
          height={150}
          className=' rounded-3xl hover:scale-110 transition-transform shadow-xl duration-300'
        />
          </div>
        </div>
      </div>
      <div className="flex justify-center px-4 sm:px-6 md:px-8">
        <Link
          href="/#realisations"
          className="inline-block bg-white md:w-auto text-gray-900 px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 uppercase text-sm md:text-lg font-semibold tracking-widest text-center mx-auto mb-10 w-full max-w-xs sm:max-w-sm md:max-w-md"
        > 
          Réalisations
        </Link>
      </div>

      <div>
        {/* <h2 className="font-extrabold  text-2xl md:text-3xl mb-4 text-gray-900 text-center px-4 sm:px-6 md:px-8">Des techniques modernes</h2> */}
    <h2 className="font-extrabold text-2xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 text-gray-900 text-center px-4 sm:px-6 md:px-8">Des techniques modernes</h2>
        <div className="text-gray-900 mx-4 sm:mx-8 md:mx-12">
            <div className="flex flex-col sm:flex-row justify-evenly items-center gap-4 my-4 px-4 md:px-0 text-gray-900 w-full max-w-7xl mx-auto">
            <div className="w-full sm:w-2/3 h-48 md:h-64 lg:h-80 overflow-hidden rounded-lg">
              <Image src="/projects/creation-artistique-bois-gravure-laser-design.webp" alt="creation-artistique-bois-gravure-laser-design" width={400} height={100} className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-98 shadow-xl' />
            </div>
              <div className='bg-[#6E849A] bg-opacity-10 p-6 rounded-lg max-w-2xl sm:w-1/3 text-white h-48 md:h-64 lg:h-80 flex flex-col justify-around items-center sm:justify-center sm:gap-4'> 
                <h3 className='text-lg sm:text-xl md:text-xl lg:text-2xl font-bolder text-center uppercase md:m-2'>Gravure Laser</h3>
                <p className="mx-2 sm:mx-4 text-sm sm:text-sm md:text-sm lg:text-sm text-justify">Textes, logos, motifs détaillés directement incrustés dans le bois</p>
              </div>
            </div>  
            <div className="flex flex-col sm:flex-row-reverse justify-center items-center gap-4 my-4  px-4 md:px-0 text-gray-900 w-full max-w-7xl mx-auto">
            <div className="w-full sm:w-2/3 h-48 md:h-64 lg:h-80 overflow-hidden rounded-lg">
              <Image src="/projects/BIENNALE_ECOPOSS/trophees-ecoposs-concours-nouvelles-osons-leloge-du-futur.webp" alt="trophees-ecoposs-concours-nouvelles-osons-leloge-du-futur" width={400} height={100} className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-98 shadow-xl' />
            </div>
              <div className='bg-[#6E849A] bg-opacity-10 p-6 rounded-lg max-w-2xl sm:w-1/3 text-white h-48 md:h-64 lg:h-80 flex flex-col justify-around items-center sm:justify-center sm:gap-4'>
                <h3 className='text-lg sm:text-xl md:text-xl lg:text-2xl font-bolder text-center uppercase md:m-2'>Impression UV</h3>
                <p className="mx-2 text-sm sm:text-sm md:text-sm lg:text-sm text-justify"> Des couleurs éclatantes, des détails précis. Logos, textes, visuels ou photos peuvent être
   reproduits directement sur le bois, pour un rendu moderne et durable.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-4  px-4 md:px-0 text-gray-900 w-full max-w-7xl mx-auto">
            <div className="w-full sm:w-2/3 h-48 md:h-64 lg:h-80 overflow-hidden rounded-lg">
              <Image src="/projects/concours_court_metrage_CPAM/trophee-artistique-bois-grave-incrustation.webp" alt="trophee-artistique-bois-grave-incrustation" width={400} height={100} className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-98 shadow-xl' />
            </div>
              <div className='bg-[#6E849A] bg-opacity-10 p-6 rounded-lg max-w-2xl sm:w-1/3 text-white h-48 md:h-64 lg:h-80 flex flex-col justify-around items-center sm:justify-center sm:gap-4'>
                <h3 className='text-lg sm:text-xl md:text-xl lg:text-2xl font-bolder text-center uppercase md:m-2'>USINAGE CNC</h3>
                <p className="mx-2 text-sm sm:text-sm md:text-sm lg:text-sm text-justify">Découpe de formes complexes à partir de
   fichiers 3D. chaque trophées en bois prend forme
   avec une précision millimétrée</p>
              </div>
            </div>
        </div>
      
       
        <MobileBackgroundImage
          src="/projects/trophees-bois-design-start-innovation-2024.webp"
          alt="Trophées bois design Start Innovation 2024"
          className="relative flex flex-col   md:flex-row justify-center items-center gap-4 min-h-[66vh] w-full max-w-7xl  rounded-sm overflow-hidden"
          style={{ backgroundAttachment: 'fixed' }}
        >
          {/* mobile-only overlay: sits above the background image but below the content so text remains fully opaque */}
          <div className="absolute inset-0 bg-white/60  md:bg-transparent" aria-hidden="true" />

          <div className="flex-1" />
          <div className="relative z-10 flex flex-col justify-end items-end bg-opacity-50 p-6 rounded-lg max-w-2xl text-gray-900 m-4 w-full md:w-1/2 lg:w-1/3 sm:w-1/3 self-end md:self-auto">
          <div className='text-center w-full md:w-auto'>
           <h3 className='font-extrabold text-2xl text-center md:text-3xl m-4 mb-8'>Matériaux nobles & durables</h3>
          </div>
            
            <p className='text-justify px-4 sm:px-6 md:px-10 '>
              J&apos;utilise principalement du bois massif (chêne, hêtre, érable, noyer) ainsi que du contreplaqué de qualité selon
              les besoins esthétiques et techniques. Chaque essence de bois est choisie pour son grain, sa teinte et sa durabilité.
              <br /><br />
              En choisissant un trophées en bois, vous optez pour une alternative écologique et durable aux trophées en plastique ou métal.
            </p>
          </div>
        </MobileBackgroundImage>
      </div>    
    </div>
  )
}

export default About
