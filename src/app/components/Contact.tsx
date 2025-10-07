'use client';

import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';

export default function Contact() {

  const fname = useRef<HTMLInputElement>(null);
  const lname = useRef<HTMLInputElement>(null);
  const companyName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const message = useRef<HTMLTextAreaElement>(null);
  const sub = useRef<HTMLInputElement>(null);

  async function handleSubmit(): Promise<void> {
    // helper to read and trim a ref value
    const read = (r: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null | undefined) =>
      (r?.current?.value || '').toString().trim();

    const fullName = `${read(fname)} ${read(lname)}`.trim();
    const subjectVal = read(sub) || 'Contact via site';

    // build payload but only include non-empty fields
    const payload: Record<string, string> = {};
    if (fullName) payload.name = fullName;
    const emailVal = read(email);
    if (emailVal) payload.email = emailVal;
    if (subjectVal) payload.subject = subjectVal;
  const messageVal = read(message);
    if (messageVal) payload.message = messageVal;
    const phoneVal = read(phone);
    if (phoneVal) payload.phone = phoneVal;
    const companyVal = read(companyName);
    if (companyVal) payload.company = companyVal;

    console.log('Submitting contact form', payload);

    // Client-side validation: require first name, last name, email and message
    const firstNameVal = read(fname);
    const lastNameVal = read(lname);
    if (!firstNameVal || !lastNameVal || !emailVal || !messageVal) {
      setErrorMessage("Veuillez au minimum remplir les champs Prénom, Nom, Email et Message s'il vous plaît.");
      setSuccessMessage('');
      setIsVisible(true);
      return;
    }

    // Email format validation: require a basic valid email before submitting
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      setErrorMessage('Veuillez saisir une adresse email valide.');
      setSuccessMessage('');
      setIsVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/server', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200 && response.data?.success) {
        setSuccessMessage('Votre message a bien été envoyé. à très vite !');
        setErrorMessage('');
        // clear form (optional)
        if (fname.current) fname.current.value = '';
        if (lname.current) lname.current.value = '';
        if (companyName.current) companyName.current.value = '';
        if (email.current) email.current.value = '';
        if (phone.current) phone.current.value = '';
        if (message.current) message.current.value = '';
        if (sub.current) sub.current.value = '';
      } else {
        setErrorMessage('Échec de l\'envoi du message. Veuillez réessayer.');
        setSuccessMessage('');
        console.error('Server response', response.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Une erreur est survenue lors de l\'envoi du message.');
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  }

  // UI state for messages and visibility (fade-out)
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (successMessage || errorMessage) {
      setIsVisible(true);
      timer = setTimeout(() => {
        setIsVisible(false);
        // clear messages after fade-out finishes
        const cleanup = setTimeout(() => {
          setSuccessMessage('');
          setErrorMessage('');
          clearTimeout(cleanup);
        }, 1000);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [successMessage, errorMessage]);

  return (
    <>
      <section id="contact" className="bg-[#6E849A] justify-center items-center py-18">
        <div className="flex flex-col px-4 sm:px-6 lg:px-8 justify-center items-center">
          <div className="max-w-2xl flex flex-col justify-center items-center">
            <h2 className="text-3xl sm:text-3xl lg:text-6xl font-semibold tracking-tight text-white m-4">Coordonnées</h2>
            <p className="mt-2 text-base sm:text-lg text-center text-white px-4">Cliquez sur les cartes pour copier mes coordonnées !</p>
          </div>

          {/* Coordonnées cards container shares same max width as form */}
          <div className="mt-8 sm:mt-10 w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
              <div className="group relative flex flex-col justify-center rounded-md bg-white px-4 sm:px-6 py-4 sm:py-3 text-base font-semibold text-gray-900 transition-colors duration-200 hover:bg-black/90 hover:text-white min-h-[96px] sm:min-h-[80px] cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard.writeText("0623284237");
                  const el = document.getElementById("phone-copy-tooltip");
                  if (el) {
                    el.classList.remove("opacity-0");
                    setTimeout(() => el.classList.add("opacity-0"), 1500);
                  }
                }}
              >
                <div className="text-left z-0">
                  <div className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-200">Téléphone</div>
                  <div className="mt-1 text-base sm:text-lg font-medium">0623284237</div>
                </div>
                <span id="phone-copy-tooltip" className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 transition-opacity">Copié!</span>
              </div>

              <div className="group relative flex flex-col justify-center rounded-md bg-white px-4 sm:px-6 py-4 sm:py-3 text-base font-semibold text-gray-900 transition-colors duration-200 hover:bg-black/90 hover:text-white min-h-[96px] sm:min-h-[80px] cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard.writeText("Ateliers LIDD 30 rue Henri Regnault 59000 LILLE");
                  const el = document.getElementById("address-copy-tooltip");
                  if (el) {
                    el.classList.remove("opacity-0");
                    setTimeout(() => el.classList.add("opacity-0"), 1500);
                  }
                }}
              >
                <div className="text-left z-0">
                  <div className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-200">Adresse</div>
                  <div className="mt-1 text-base sm:text-lg font-medium">
                    <span className="font-bold">Ateliers LIDD</span><br />
                    30 rue Henri Regnault<br /> 59000 LILLE
                  </div>
                </div>
                <span id="address-copy-tooltip" className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 transition-opacity">Copié!</span>
              </div>

              <div className="group relative flex flex-col justify-center rounded-md bg-white px-4 sm:px-6 py-4 sm:py-3 text-base font-semibold text-gray-900 transition-colors duration-200 hover:bg-black/90 hover:text-white min-h-[96px] sm:min-h-[80px] cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard.writeText("bauduin.adrian@gmail.com");
                  const el = document.getElementById("email-copy-tooltip");
                  if (el) {
                    el.classList.remove("opacity-0");
                    setTimeout(() => el.classList.add("opacity-0"), 1500);
                  }
                }}
              >
                <div className="text-left z-0">
                  <div className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-200">Email</div>
                  <div className="mt-1 text-base sm:text-lg font-medium">bauduin.adrian@gmail.com</div>
                </div>
                <span id="email-copy-tooltip" className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 transition-opacity">Copié!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col w-full justify-center bg-white px-6 sm:px-6 lg:px-8 ">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          {/* {/* <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[144.5rem] max-w-none -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[288.75rem]"
          /> */}
        </div> 
     

        {/* CONTACT FORM */}
        <div className="flex flex-col w-full max-w-4xl mx-auto justify-center items-center">
            <div className="max-w-2xl w-full flex flex-col justify-center items-center my-8">
                  <h2 className="text-3xl sm:text-3xl lg:text-6xl font-semibold tracking-tight text-gray-900 m-4">Contact</h2>
                  <p className="mt-2 text-base sm:text-lg text-center text-gray-600 px-4">Une idée ? Un projet ? N&apos;hésitez pas à me contacter !</p>
            </div>
          <div className="grid grid-cols-1 gap-x-6 sm:gap-x-8 gap-y-4 sm:gap-y-6 sm:grid-cols-2 w-full">
            <div>
              <label htmlFor="first-name" className="block text-sm sm:text-base font-semibold text-gray-900">
                Prénom <span className='text-red'>*</span>
              </label>
              <div className="mt-2 sm:mt-[2.5]">
                <input
                  ref={fname}
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  placeholder='Prénom'
                  className="block w-full rounded-md bg-white px-3 sm:px-3.5 py-3 sm:py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm sm:text-base font-semibold text-gray-900">
                Nom <span className='text-red'>*</span>
              </label>
              <div className="mt-2 sm:mt-[2.5]">
                <input
                ref={lname}
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  placeholder='Nom'
                  className="block w-full rounded-md bg-white px-3 sm:px-3.5 py-3 sm:py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="company" className="block text-sm sm:text-base font-semibold text-gray-900">
                Entreprise / Organisation
              </label>
              <div className="mt-2 sm:mt-[2.5]">
                <input
                ref={companyName}
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder='Entreprise / Organisation'
                  className="block w-full rounded-md bg-white px-3 sm:px-3.5 py-3 sm:py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-gray-900">
                Email <span className='text-red'>*</span>
              </label>
              <div className="mt-2 sm:mt-[2.5]">
                <input
                  ref={email}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder='Email'
                  className="block w-full rounded-md bg-white px-3 sm:px-3.5 py-3 sm:py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone-number" className="block text-sm sm:text-base font-semibold text-gray-900">
                Numéro de téléphone
              </label>
              <div className="mt-2 sm:mt-[2.5]">
                <input
                  ref={phone}
                  id="phone-number"
                  name="phone-number"
                  type="tel"
                  placeholder='Numéro de téléphone'
                  className="block w-full rounded-md bg-white px-3 sm:px-3.5 py-3 sm:py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm sm:text-base font-semibold text-gray-900">
                Message <span className='text-red'>*</span>
              </label>
              <div className="mt-2 sm:mt-[2.5]">
                <textarea
                  ref={message}
                  id="message"
                  name="message"
                  rows={4}
                  placeholder='Votre message...'
                  className="block w-full rounded-md bg-white px-3 sm:px-3.5 py-3 sm:py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600 resize-none"
                  defaultValue={''}
                />
              </div>  
            </div>
          </div>
          <div className=" sm:mt-10 w-full flex justify-center pb-6">
               {/* Inline success / error messages with fade */}
          <div className="w-full max-w-2xl mx-auto flex flex-col justify-center items-center">
            <div className='py-4 min-h-[42px]'>
            {isVisible && successMessage && (
              <div className="mt-4 p-4 text-sm text-green-600 border border-green-500 rounded-lg bg-green-100 transition-opacity duration-500">
                <strong>Succès :</strong> {successMessage}
              </div>
            )}
            {isVisible && errorMessage && (
              <div className="mt-4 p-4 text-sm text-red-600 border border-red-500 rounded-lg bg-red-100 transition-opacity duration-500">
                <strong>Erreur :</strong> {errorMessage}
              </div>
            )}
            </div>
            <button
              type="submit"
              value="Send Message"
              onClick={() => { handleSubmit(); }}
              disabled={isLoading}
              className={`w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-2 rounded-full transition-colors border-2 text-center uppercase text-base sm:text-sm lg:text-lg font-semibold tracking-widest cursor-pointer min-w-[200px] ${isLoading ? 'bg-gray-200 text-gray-600 border-gray-300' : 'bg-white text-gray-900 border-black hover:bg-black hover:text-white'}`}
            >
              {isLoading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
       
          </div>
        </div>
      </div>
    </>
  );
}
