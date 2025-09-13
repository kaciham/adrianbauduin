import { ChevronDownIcon } from '@heroicons/react/16/solid';

export default function Contact() {
  return (
    <>
      <section className="bg-white justify-center items-center py-16 ">
        <div className="flex flex-col px-6 lg:px-8 justify-center items-center">
          <div className="max-w-2xl flex flex-col justify-center items-center">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-7xl m-4">Contact</h2>
            <p className="mt-2 text-lg text-gray-600">Une idée ? Un projet ? N'hésitez pas à me contacter !</p>
          </div>

          <div className="mt-10 max-w-5xl">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-6 md:items-stretch">
              <a
                href="tel:+060000000"
                aria-label="Call us"
                className="inline-flex h-full items-center justify-center rounded-md border border-black bg-white px-6 py-3 text-base font-semibold text-black transition-colors duration-200 hover:bg-black hover:text-white w-full md:w-1/3"
              >
                <div className="text-left">
                  <div className="text-xs text-gray-500">Téléphone</div>
                  <div className="mt-1 text-sm font-medium">06 00 00 00 00</div>
                </div>
              </a>

              <a
                href="https://www.google.com/maps/search/123+Example+St,+City,+Country"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View address"
                className="inline-flex h-full items-center justify-center rounded-md border border-black bg-white px-6 py-3 text-base font-semibold text-black transition-colors duration-200 hover:bg-black hover:text-white w-full md:w-1/3"
              >
                <div className="text-left">
                  <div className="text-xs text-gray-500">Adresse</div>
                  <div className="mt-1 text-sm font-medium">123 Example St, City</div>
                </div>
              </a>
               <a
                href="mailto:adrian@ebeniste.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View address"
                className="inline-flex h-full items-center justify-center rounded-md border border-black bg-white px-6 py-3 text-base font-semibold text-black transition-colors duration-200 hover:bg-black hover:text-white w-full md:w-1/3"
              >
                <div className="text-left">
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="mt-1 text-sm font-medium">123 Example St, City</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col w-full bg-white px-6 py-24 sm:py-12 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[144.5rem] max-w-none -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[288.75rem]"
          />
        </div>

        {/* CONTACT FORM */}
        <div className="flex flex-col w-full px-6 lg:px-8 justify-center items-center">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
                First name
              </label>
              <div className="mt-2.5">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900">
                Last name
              </label>
              <div className="mt-2.5">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-gray-900">
                Company
              </label>
              <div className="mt-2.5">
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                Email
              </label>
              <div className="mt-2.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-900">
                Phone number
              </label>
              <div className="mt-2.5">
                <div className="flex rounded-md bg-white outline-1 outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black-600">
                  <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  </div>
                  <input
                    id="phone-number"
                    name="phone-number"
                    type="text"
                    placeholder="123-456-7890"
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-black-600"
                  defaultValue={''}
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block bg-white md:w-auto text-black px-4 py-2 rounded-full transition-colors border-2 border-black hover:bg-black hover:text-white mt-4 text-center uppercase text-sm md:text-lg font-semibold tracking-widest cursor-pointer"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
  