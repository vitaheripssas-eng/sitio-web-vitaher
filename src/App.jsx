import { useState, lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Footer from './components/Footer.jsx'
import Modal from './components/Modal.jsx'
import { getLegalPage } from './data/legal.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const Destacados = lazy(() => import('./components/Destacados.jsx'))
const RutaCuidado = lazy(() => import('./components/RutaCuidado.jsx'))
const Nosotros = lazy(() => import('./components/Nosotros.jsx'))
const Servicios = lazy(() => import('./components/Servicios.jsx'))
const PQRS = lazy(() => import('./components/PQRS.jsx'))
const Trabaja = lazy(() => import('./components/Trabaja.jsx'))
const Contacto = lazy(() => import('./components/Contacto.jsx'))

export default function App() {
  const [openDoc, setOpenDoc] = useState(null)

  return (
    <ErrorBoundary>
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<div style={{ minHeight: 320 }} aria-hidden />}>
          <Destacados />
          <RutaCuidado />
          <Nosotros />
          <Servicios />
          <PQRS />
          <Trabaja />
          <Contacto />
        </Suspense>
      </main>
      <Footer onOpenLegal={(slug) => setOpenDoc(getLegalPage(slug))} />
      {openDoc && <Modal doc={openDoc} onClose={() => setOpenDoc(null)} />}
    </ErrorBoundary>
  )
}