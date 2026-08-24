import { EMAIL, PHONE_DISPLAY, WHATSAPP_NUMBER } from '../data.js'
import { Icon } from './Icons.jsx'
import './Footer.css'

const MAPS_QUERY = encodeURIComponent('Calle 7 Sur 24-66, Barrio El Olimpico, Arauca, Colombia')

const MAPS_EMBED = `https://maps.google.com/maps?q=${MAPS_QUERY}&t=&z=16&ie=UTF8&iwloc=&output=embed&hl=es`

const LEGAL = [
  { label: 'Términos y Condiciones', slug: 'terminos' },
  { label: 'Políticas de Privacidad', slug: 'privacidad' },
  { label: 'Tratamiento de Datos', slug: 'datos' },
  { label: 'Derechos y Deberes del Usuario', slug: 'derechos' },
  { label: 'Políticas de Seguridad y Salud en el Trabajo', slug: 'sst' },
  { label: 'Glosario', slug: 'glosario' },
]

const INSTITUCION = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'PQRS', href: '#pqrs' },
  { label: 'Trabaja Con Nosotros', href: '#trabaja' },
]

const DIRECCION = 'Calle 7 Sur #24-66 (Lote), Barrio El Olímpico, Arauca, Colombia'
const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=7.063694,-70.759028'

export default function Footer({ onOpenLegal }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="logo" href="#inicio" aria-label="VITAHER IPS S.A.S. — inicio">
              <img
                className="logo-img footer-logo-img"
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="Logo VITAHER IPS S.A.S."
              />
              <span className="logo-text footer-logo-text">
                <strong>VITAHER</strong>
                <small>IPS S.A.S.</small>
              </span>
            </a>
            <p>Cuidamos con calidad, servimos con el corazón.</p>
            <span className="footer-tagline">Línea de atención SIAU: +57 314 231 8040</span>
            <div className="footer-social">
              <a className="social-item" href="#" aria-label="Facebook de VITAHER IPS S.A.S.">
                <Icon name="facebook" size={20} />
                <span className="social-label">Facebook</span>
              </a>
              <a className="social-item" href="#" aria-label="Instagram de VITAHER IPS S.A.S.">
                <Icon name="instagram" size={20} />
                <span className="social-label">Instagram</span>
              </a>
<a
                className="social-item tiktok"
                href="https://www.tiktok.com/@vitaherips"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok de VITAHER IPS S.A.S."
              >
                <Icon name="tiktok" size={20} />
                <span className="social-label">TikTok</span>
              </a>
              <a
                className="social-item"
                href="https://wa.me/${WHATSAPP_NUMBER}"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp de VITAHER IPS S.A.S."
              >
                <Icon name="whatsapp" size={22} />
                <span className="social-label">WhatsApp</span>
              </a>
            </div>
          </div>

          <a
            className="footer-map"
            href={MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir la ubicación de IPS VITAHER S.A.S. en Google Maps"
            title="Abrir en Google Maps"
          >
            <iframe
              src={MAPS_EMBED}
              title="Ubicación de IPS VITAHER S.A.S. en Arauca, Colombia"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>

        <div className="footer-grid">
          <div>
            <h4>Institución</h4>
            <ul className="footer-links">
              {INSTITUCION.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul className="footer-links">
              {LEGAL.map((item) => (
                <li key={item.slug}>
                  <button
                    className="footer-link-btn"
                    onClick={() => onOpenLegal(item.slug)}
                    type="button"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contacto</h4>
            <ul className="footer-links footer-contact">
              <li>
                <Icon name="mapPin" size={16} />
                <a href={MAPS_LINK} target="_blank" rel="noreferrer">
                  {DIRECCION}
                </a>
              </li>
              <li>
                <Icon name="mail" size={16} />
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>
              <li>
                <Icon name="phone" size={16} />
                <a href="tel:+573142318040">{PHONE_DISPLAY}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VITAHER. Todos los derechos reservados.</span>
          <button
            className="back-top"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Volver arriba"
          >
            <Icon name="arrowDown" size={16} />
          </button>
        </div>
      </div>
    </footer>
  )
}