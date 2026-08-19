import { useRef, useState } from 'react'
import { PERFILES, FORMACION_OPCIONES } from '../data.js'
import WhatsAppPreview from './WhatsAppPreview.jsx'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Trabaja.css'
import './form.css'

export default function Trabaja() {
  const [sent, setSent] = useState(null)
  const [cv, setCv] = useState('')
  const formRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    const msg = [
      '*Postulación laboral — IPS VITAHER S.A.S.*',
      '',
      `Cargo: ${data.cargo}`,
      `Nivel de formación: ${data.formacion}`,
      `Experiencia: ${data.experiencia || 'No indicada'}`,
      '',
      `Nombre: ${data.nombre}`,
      `Teléfono: ${data.telefono}`,
      `Correo: ${data.correo}`,
      `Ciudad: ${data.ciudad}`,
      '',
      cv ? `Hoja de vida adjunta: ${cv}` : 'Enviará hoja de vida por otro medio',
    ]
      .filter(Boolean)
      .join('\n')
    setSent(msg)
  }

  return (
    <section className="section trabaja" id="trabaja">
      <div className="container">
        <div className="section-head">
          <span className="section-label">Trabaja con nosotros</span>
          <h2>Haz parte de nuestro equipo</h2>
          <p>
            Buscamos personas comprometidas con la excelencia, la calidad y la humanización de los
            servicios de salud. Promovemos un ambiente basado en el respeto, la innovación y el
            crecimiento profesional.
          </p>
        </div>

        <div className="trabaja-layout">
          <Reveal as="div" className="perfiles">
            <h3>Perfiles que buscamos</h3>
            <p>Si tu perfil está en la lista, te invitamos a postularte:</p>
            <div className="perfiles-grid">
              {PERFILES.map((perfil) => (
                <span className="perfil" key={perfil}>
                  <Icon name="check" size={14} />
                  {perfil}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <form className="trabaja-form" onSubmit={handleSubmit} ref={formRef}>
            <h3>Envía tu hoja de vida</h3>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="trabaja-nombre">
                  Nombre completo <span className="req">*</span>
                </label>
                <input className="form-input" type="text" id="trabaja-nombre" name="nombre" placeholder="Nombres y apellidos" required />
              </div>
              <div className="form-field">
                <label htmlFor="trabaja-correo">
                  Correo electrónico <span className="req">*</span>
                </label>
                <input className="form-input" type="email" id="trabaja-correo" name="correo" placeholder="correo@ejemplo.com" required />
              </div>
              <div className="form-field">
                <label htmlFor="trabaja-telefono">
                  Teléfono <span className="req">*</span>
                </label>
                <input className="form-input" type="tel" id="trabaja-telefono" name="telefono" placeholder="+57 ..." required />
              </div>
              <div className="form-field">
                <label htmlFor="trabaja-ciudad">Ciudad</label>
                <input className="form-input" type="text" id="trabaja-ciudad" name="ciudad" placeholder="Ej: Arauca" />
              </div>
              <div className="form-field">
                <label htmlFor="trabaja-cargo">
                  Cargo al que aspira <span className="req">*</span>
                </label>
                <select className="form-select" id="trabaja-cargo" name="cargo" required>
                  <option value="">Seleccione un cargo...</option>
                  {PERFILES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="trabaja-formacion">Nivel de formación</label>
                <select className="form-select" id="trabaja-formacion" name="formacion" defaultValue="Profesional">
                  {FORMACION_OPCIONES.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="trabaja-experiencia">Experiencia laboral</label>
                <textarea className="form-textarea" id="trabaja-experiencia" name="experiencia" placeholder="Describe tu experiencia relacionada con el cargo..." />
              </div>
              <div className="form-field full">
                <label>Adjuntar hoja de vida (PDF)</label>
                <div className="form-file">
                  <input type="file" accept=".pdf" onChange={(e) => setCv(e.target.files[0]?.name ?? '')} />
                  <span className="form-file-label">
                    <Icon name="upload" size={18} />
                    {cv || 'Subir PDF'}
                  </span>
                </div>
              </div>
            </div>
            <button className="btn btn-primary form-submit" type="submit">
              Enviar postulación
            </button>
            </form>
          </Reveal>
        </div>
      </div>

      {sent && (
        <WhatsAppPreview
          title="Postulación lista para enviar"
          message="Revisa y edita tu postulación antes de enviarla. La hoja de vida la adjuntas en la conversación de WhatsApp."
          msg={sent}
          onClose={() => setSent(null)}
          onSent={() => {
            formRef.current?.reset()
            setCv('')
          }}
        />
      )}
    </section>
  )
}