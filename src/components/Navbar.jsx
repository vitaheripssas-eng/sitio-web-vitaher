import { useState } from 'react'
import { NAV_LINKS } from '../data.js'
import { Icon } from './Icons.jsx'
import './Navbar.css'

function Logo() {
  return (
    <a className="logo" href="#inicio" aria-label="VITAHER IPS S.A.S. — inicio">
      <img className="logo-img" src="/logo.png" alt="Logo VITAHER IPS S.A.S." />
      <span className="logo-text">
        <strong>VITAHER</strong>
        <small>IPS S.A.S.</small>
      </span>
    </a>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
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
  )
}