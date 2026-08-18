import { useState } from 'react'
import { PQRS_TIPOS, SERVICIOS_SELECCION } from '../data.js'
import WhatsAppPreview from './WhatsAppPreview.jsx'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './PQRS.css'
import './form.css'

const PQRS_INFO = [
  { letra: 'P', title: 'Petición', text: 'Solicitud respetuosa o requerimiento de información.' },
  { letra: 'Q', title: 'Queja', text: 'Inconformidad frente a la atención recibida.' },
  { letra: 'R', title: 'Reclamo', text: 'Un servicio no fue prestado adecuadamente.' },
  { letra: 'S', title: 'Sugerencia', text: 'Propuesta para mejorar procesos y servicios.' },
  { letra: 'F', title: 'Felicitación', text: 'Reconocimiento al buen servicio recibido.' },
]

const TIPOS_DOC = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Tarjeta de identidad']

export default function PQRS() {
  const [sent, setSent] = useState(null)
  const [files, setFiles] = useState([])

  const input = (key) => ({
    name: key,
    id: `pqrs-${key}`,
    required: ['nombre', 'tipoSolicitud', 'descripcion'].includes(key),
  })

  function handleSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    const msg = [
      '*PQRS — IPS VITAHER S.A.S.*',
      '',
      `Tipo: ${data.tipoSolicitud}`,
      `Servicio: ${data.servicio ?? 'No especificado'}`,
      `Fecha del evento: ${data.fecha || 'No indicada'}`,
      '',
      `Descripción: ${data.descripcion}`,
      '',
      `Nombre: ${data.nombre}`,
      `Documento: ${data.tipoDoc} ${data.numDoc || ''}`,
      `Teléfono: ${data.telefono || '—'}`,
      `Correo: ${data.correo || '—'}`,
      `Municipio: ${data.municipio || '—'}`,
      `Dirección: ${data.direccion || '—'}`,
    ].join('\n')
    setSent({ msg, tipo: data.tipoSolicitud })
  }

  return (
    <section className="section pqrs" id="pqrs">
      <div className="container">
        <div className="section-head">
          <span className="section-label">PQRS</span>
          <h2>Tu opinión nos ayuda a mejorar</h2>
          <p>
            Escuchar a nuestros usuarios es fundamental para fortalecer la calidad de nuestros
            servicios. Presenta tu solicitud y será atendida con oportunidad, respeto y
            confidencialidad.
          </p>
        </div>

        <div className="pqrs-layout">
          <Reveal as="div" className="pqrs-cards">
            {PQRS_INFO.map((item) => (
              <div className="pqrs-card" key={item.letra}>
                <span className="pqrs-card-letra">{item.letra}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={140}>
            <form className="pqrs-form-card" onSubmit={handleSubmit}>
            <h3>Presenta tu PQRS</h3>
            <p>Todos los campos marcados con * son obligatorios.</p>

            <div className="form-grid">
              <span className="form-section-title">Información personal (opcional)</span>
              <div className="form-field full">
                <label htmlFor={input('nombre').id}>Nombre completo</label>
                <input className="form-input" type="text" id={input('nombre').id} name="nombre" placeholder="Nombres y apellidos" {...input('nombre')} />
              </div>
              <div className="form-field">
                <label htmlFor={input('tipoDoc').id}>Tipo de documento</label>
                <select className="form-select" id={input('tipoDoc').id} name="tipoDoc" defaultValue={TIPOS_DOC[0]}>
                  {TIPOS_DOC.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor={input('numDoc').id}>Número de documento</label>
                <input className="form-input" type="text" id={input('numDoc').id} name="numDoc" placeholder="Ej: 1.098.765.432" />
              </div>
              <div className="form-field">
                <label htmlFor={input('telefono').id}>Teléfono</label>
                <input className="form-input" type="tel" id={input('telefono').id} name="telefono" placeholder="+57 ..." />
              </div>
              <div className="form-field">
                <label htmlFor={input('correo').id}>Correo electrónico</label>
                <input className="form-input" type="email" id={input('correo').id} name="correo" placeholder="correo@ejemplo.com" />
              </div>
              <div className="form-field">
                <label htmlFor={input('municipio').id}>Municipio</label>
                <input className="form-input" type="text" id={input('municipio').id} name="municipio" placeholder="Ej: Arauca" />
              </div>
              <div className="form-field">
                <label htmlFor={input('direccion').id}>Dirección</label>
                <input className="form-input" type="text" id={input('direccion').id} name="direccion" placeholder="Barrio y calle" />
              </div>

              <span className="form-section-title">Información de la solicitud</span>
              <div className="form-field">
                <label htmlFor={input('tipoSolicitud').id}>
                  Tipo de solicitud <span className="req">*</span>
                </label>
                <select className="form-select" id={input('tipoSolicitud').id} name="tipoSolicitud" defaultValue="Petición" required>
                  {PQRS_TIPOS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor={input('servicio').id}>Servicio relacionado</label>
                <select className="form-select" id={input('servicio').id} name="servicio" defaultValue="Otro">
                  {SERVICIOS_SELECCION.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor={input('fecha').id}>Fecha del evento</label>
                <input className="form-input" type="date" id={input('fecha').id} name="fecha" />
              </div>
              <div className="form-field full">
                <label htmlFor={input('descripcion').id}>
                  Descripción detallada <span className="req">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  id={input('descripcion').id}
                  name="descripcion"
                  placeholder="Cuéntanos con detalle qué ocurrió..."
                  required
                />
              </div>
              <div className="form-field full">
                <label>Adjuntar archivos</label>
                <div className="form-file">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles([...e.target.files].map((f) => f.name))}
                  />
                  <span className="form-file-label">
                    <Icon name="upload" size={18} />
                    {files.length > 0 ? `${files.length} archivo(s) seleccionado(s)` : 'Arrastra un archivo o haz clic para adjuntar'}
                  </span>
                </div>
                {files.length > 0 && (
                  <span className="form-file-name">{files.join(', ')}</span>
                )}
              </div>
            </div>

            <button className="btn btn-primary form-submit" type="submit">
              Enviar PQRS
            </button>
            </form>
          </Reveal>
        </div>
      </div>

      {sent && (
        <WhatsAppPreview
          title="Solicitud lista para enviar"
          message="Revisa y edita tu PQRS si lo necesitas, luego envíala por WhatsApp o por correo."
          msg={sent.msg}
          mailSubject={`PQRS - ${sent.tipo}`}
          onClose={() => setSent(null)}
        />
      )}
    </section>
  )
}