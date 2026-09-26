import { useState, useEffect } from 'react'
import { NAV_LINKS } from '../data.js'
import { Icon } from './Icons.jsx'
import './Navbar.css'

function Logo() {
  return (
    <a className="logo" href="#inicio" aria-label="VITAHER IPS S.A.S. — inicio">
      <img className="logo-img" src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo VITAHER IPS S.A.S." />
      <span className="logo-text">
        <strong>VITAHER</strong>
        <small>IPS S.A.S.</small>
      </span>
    </a>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Punto 4: Bloquear scroll del fondo en celular cuando el menú está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Cerrar menú al presionar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Logo />
          <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Principal">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <a className="btn btn-primary nav-cta" href="#contacto" onClick={() => setOpen(false)}>
              Agendar Cita
            </a>
          </nav>
          <button
            className="nav-toggle"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'x' : 'menu'} size={26} />
          </button>
        </div>
      </header>
      {/* Punto 2: Fondo oscuro (Backdrop) que cierra el menú al tocar fuera */}
      <div
        className={`nav-backdrop ${open ? 'is-open' : ''}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
    </>
  )
}
