import { useRef, useState } from 'react'
import { PHONE_DISPLAY, EMAIL, SERVICIOS_SELECCION } from '../data.js'
import { waLink } from '../utils.js'
import WhatsAppPreview from './WhatsAppPreview.jsx'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Contacto.css'
import './form.css'

const INFO = [
  {
    icon: 'mapPin',
    title: 'Dirección',
    value: 'Calle 7 Sur #24-66 (Lote), Barrio El Olímpico — Arauca, Colombia',
    href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Calle 7 Sur 24-66, Barrio El Olimpico, Arauca, Colombia'),
  },
  { icon: 'phone', title: 'Teléfono', value: PHONE_DISPLAY, href: 'tel:+573142318040' },
  { icon: 'whatsapp', title: 'WhatsApp', value: PHONE_DISPLAY, href: waLink('Hola, me comunico desde el sitio web de IPS VITAHER S.A.S.') },
  { icon: 'mail', title: 'Correo electrónico', value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: 'clock', title: 'Horario de atención', value: 'Lunes a viernes · 8:00 a.m.–12:00 p.m. y 2:00 p.m.–6:00 p.m.' },
]

export default function Contacto() {
  const [sent, setSent] = useState(null)
  const [soportes, setSoportes] = useState('')
  const formRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    const msg = [
      '*Solicitud de cita / mensaje — IPS VITAHER S.A.S.*',
      '',
      `Servicio de interés: ${data.servicio}`,
      `Mensaje: ${data.mensaje}`,
      '',
      `Nombre: ${data.nombre}`,
      `Teléfono: ${data.telefono}`,
      `Correo: ${data.correo}`,
      '',
      soportes ? `Orden o autorización adjunta: ${soportes}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    setSent(msg)
  }

  return (
    <section className="section contacto" id="contacto">
      <div className="container">
        <div className="section-head">
          <span className="section-label">Contáctanos</span>
          <h2>Estamos para servirte</h2>
          <p>Nuestro equipo está disponible para atender tus inquietudes y orientarte sobre nuestros servicios.</p>
        </div>

        <div className="contacto-layout">
          <Reveal as="div" className="contacto-info">
            {INFO.map((item) => (
              <div className="contacto-item" key={item.title}>
                <span className="contacto-item-icon">
                  <Icon name={item.icon} size={22} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.value}
                    </a>
                  ) : (
                    <p>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={140}>
            <form className="contacto-form" id="agendar" onSubmit={handleSubmit} ref={formRef}>
            <h3>Agendar cita / enviar mensaje</h3>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="contacto-nombre">
                  Nombre completo <span className="req">*</span>
                </label>
                <input className="form-input" type="text" id="contacto-nombre" name="nombre" placeholder="Nombres y apellidos" required />
              </div>
              <div className="form-field">
                <label htmlFor="contacto-telefono">
                  Teléfono <span className="req">*</span>
                </label>
                <input className="form-input" type="tel" id="contacto-telefono" name="telefono" placeholder="+57 ..." required />
              </div>
              <div className="form-field full">
                <label htmlFor="contacto-correo">Correo electrónico</label>
                <input className="form-input" type="email" id="contacto-correo" name="correo" placeholder="correo@ejemplo.com" />
              </div>
              <div className="form-field full">
                <label htmlFor="contacto-servicio">Servicio de interés</label>
                <select className="form-select" id="contacto-servicio" name="servicio" defaultValue="Medicina Domiciliaria">
                  {SERVICIOS_SELECCION.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="contacto-mensaje">
                  Mensaje <span className="req">*</span>
                </label>
                <textarea className="form-textarea" id="contacto-mensaje" name="mensaje" placeholder="Cuéntanos cómo podemos ayudarte..." required />
              </div>
              <div className="form-field full">
                <label>Adjuntar Orden/Autorización</label>
                <div className="form-file">
                  <input type="file" multiple onChange={(e) => setSoportes([...e.target.files].map((f) => f.name).join(', '))} />
                  <span className="form-file-label">
                    <Icon name="upload" size={18} />
                    {soportes || 'Subir Orden/Autorización'}
                  </span>
                </div>
              </div>
            </div>
            <button className="btn btn-primary form-submit" type="submit">
              Enviar solicitud
            </button>
            </form>
          </Reveal>
        </div>
      </div>

      {sent && (
        <WhatsAppPreview
          title="Solicitud lista para enviar"
          message="Revisa y edita el mensaje si lo necesitas, luego envíalo por WhatsApp."
          msg={sent}
          onClose={() => setSent(null)}
          onSent={() => {
            formRef.current?.reset()
            setSoportes('')
          }}
        />
      )}
    </section>
  )
}