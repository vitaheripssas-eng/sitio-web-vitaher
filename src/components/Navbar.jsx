import { useState, useEffect } from 'react'
import { NAV_LINKS } from '../data.js'
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

function Hamburger({ open, onClick }) {
  return (
    <button className={`toggle ${open ? 'is-open' : ''}`} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} type="button" onClick={onClick}>
      <svg className="hamburger-svg" viewBox="-4 -4 32 32" width="26" height="26" aria-hidden="true">
        <g className="hamburger-dots">
          <line className="dot dot-1" x1="7" y1="5" x2="17" y2="5" />
          <line className="dot dot-2" x1="7" y1="12" x2="17" y2="12" />
          <line className="dot dot-3" x1="7" y1="19" x2="17" y2="19" />
        </g>
      </svg>
    </button>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 960)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 960)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMenu = () => {
    if (!open) {
      setOpen(true);
      setMenuVisible(true);
    } else {
      setMenuVisible(false);
      setTimeout(() => setOpen(false), 250);
    }
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Logo />
        <nav className={`nav-links ${menuVisible ? 'is-open' : ''}`} aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          {isMobile && open && (
            <a className="btn btn-primary nav-cta" href="#contacto" onClick={() => setOpen(false)}>
              Agendar Cita
            </a>
          )}
        </nav>
        {isMobile ? (
          <Hamburger open={open} onClick={toggleMenu} />
        ) : (
          <a className="btn btn-primary nav-cta" href="#contacto">
            Agendar Cita
          </a>
        )}
      </div>
    </header>
  )
}