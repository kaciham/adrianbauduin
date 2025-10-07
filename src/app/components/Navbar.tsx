'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8)
      // window.scrollTo({ top: window.scrollY, behavior: 'smooth' });
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const targetId = (event.currentTarget as HTMLElement).getAttribute('href')
      if (targetId) {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach((link) => {
      link.addEventListener('click', handleScroll)
    })

    return () => {
      links.forEach((link) => {
        link.removeEventListener('click', handleScroll)
      })
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const menuItems = [
    { href: '/#hero', label: 'Accueil' },
    { href: '/#realisations', label: 'Réalisations' },
    // { href: '/devis  ', label: 'Devis' },
    { href: '/#contact', label: 'Contact' },
  ]

  return (
    <nav
      className={`w-full fixed z-50 top-0 backdrop-blur-[3px] text-border transition-colors duration-200 ${
        scrolled ? 'bg-black/60' : 'bg-transparent'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-30 sm:h-20">
          <motion.div>
            {scrolled && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/" className="text-xl font-extrabold text-white">
                  <Image
                    src="/projects/logo_adrian_bauduin_blanc.svg"
                    alt="Adrian Bauduin trophées en bois sur mesure"
                    width={400}
                    height={100}
                    style={{ width: '100px', height: '100px' }}
                    className="py-2"
                  />
                </Link>
              </motion.div>
            )}
          </motion.div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {menuItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="transition-colors opacity-70     px-2 py-1 rounded-sm text-white hover:bg-white hover:text-gray-900"
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg transition-colors "
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </motion.button>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-4 flex-col co">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href + item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block pl-2 py-2 transition-colors rounded-2xl font-bold bg-black/60 text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuItems.length * 0.1 }}
                ></motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}