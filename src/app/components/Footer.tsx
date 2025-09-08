import React from 'react'

const Footer = () => {
  return (
    <div className="bg-black text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Mon Entreprise. Tous droits réservés.</p>
      </div>
    </div>
  )
}

export default Footer
