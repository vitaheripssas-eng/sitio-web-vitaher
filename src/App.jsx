import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Destacados from './components/Destacados.jsx'
import RutaCuidado from './components/RutaCuidado.jsx'
import Nosotros from './components/Nosotros.jsx'
import Servicios from './components/Servicios.jsx'
import PQRS from './components/PQRS.jsx'
import Trabaja from './components/Trabaja.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import Modal from './components/Modal.jsx'
import { getLegalPage } from './data/legal.js'

export default function App() {
  const [openDoc, setOpenDoc] = useState(null)

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Destacados />
        <RutaCuidado />
        <Nosotros />
        <Servicios />
        <PQRS />
        <Trabaja />
        <Contacto />
      </main>
      <Footer onOpenLegal={(slug) => setOpenDoc(getLegalPage(slug))} />
      {openDoc && <Modal doc={openDoc} onClose={() => setOpenDoc(null)} />}
    </>
  )
}