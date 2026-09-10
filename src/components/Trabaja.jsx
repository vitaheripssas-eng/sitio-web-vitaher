import { useRef, useState } from 'react'
import { PERFILES, FORMACION_OPCIONES } from '../data.js'
import { enviarConArchivo } from '../utils.js'
import { trabajaSchema, formatZodErrors } from '../schemas.js'
import WhatsAppPreview from './WhatsAppPreview.jsx'
import ExitoServidor from './ExitoServidor.jsx'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Trabaja.css'
import './form.css'

const BASE = import.meta.env.BASE_URL

const FORMATOS = [
  {
    label: 'Lista de Chequeo - Cuidador',
    href: `${BASE}formatos/FORMATO_LISTA_DE_CHEQUEO_CUIDADOR.pdf`,
    icon: 'user-check',
  },
  {
    label: 'Lista de Chequeo - Profesional',
    href: `${BASE}formatos/FORMATO_LISTA_DE_CHEQUEO_PROFESIONAL.pdf`,
    icon: 'brain',
  },
  {
    label: 'Lista de Chequeo - Aux. Enfermería',
    href: `${BASE}formatos/FORMATO_LISTA_DE_CHEQUEO_AUX_ENFERMERIA.pdf`,
    icon: 'user',
  },
  {
    label: 'Lista de Chequeo - Administrativo',
    href: `${BASE}formatos/FORMATO_LISTA_DE_CHEQUO_ADMINISTRATIVO.pdf`,
    icon: 'home',
  },
]

export default function Trabaja() {
  const [sent, setSent] = useState(null)
  const [cv, setCv] = useState('')
  const [servidorOk, setServidorOk] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const raw = Object.fromEntries(new FormData(form))
    const parsed = trabajaSchema.safeParse(raw)
    if (!parsed.success) {
      setFieldErrors(formatZodErrors(parsed.error))
      return
    }
    setFieldErrors({})
    const data = parsed.data
    const fileInput = form.querySelector('input[type="file"]')
    const tieneArchivo = fileInput && fileInput.files.length > 0

    if (tieneArchivo) {
      setIsSubmitting(true)
      try {
        const fd = new FormData()
        fd.append('tipo', 'Postulación laboral')
        fd.append('destinatario', 'talentohumanovitaher@gmail.com')
        fd.append('para', 'talentohumanovitaher@gmail.com')
        fd.append('nombre', data.nombre ?? '')
        fd.append('telefono', data.telefono ?? '')
        fd.append('correo', data.correo ?? '')
        fd.append('extra', `Cargo: ${data.cargo}\nNivel de formación: ${data.formacion}\nCiudad: ${data.ciudad || '—'}`)
        fd.append('mensaje', data.experiencia || 'Sin descripción de experiencia.')
        fd.append('website', '')
        for (const f of fileInput.files) fd.append('archivo[]', f)
        await enviarConArchivo(fd)
        setServidorOk(true)
        setErrorEnvio('')
        form.reset()
        setCv('')
        return
      } catch {
        setErrorEnvio('No pudimos enviar tu hoja de vida. Escríbenos por WhatsApp y adjúntala en el chat.')
      } finally {
        setIsSubmitting(false)
      }
    }

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
          {/* Fila 1: Listas de chequeo - ancho completo */}
          <Reveal as="div" className="checklist-row">
            <h3>Listas de chequeo por cargo</h3>
            <p>En base a su profesión, seleccione la lista de chequeo correspondiente al cargo al que desea aplicar, descárguela, fírmela y adjúntela a su hoja de vida para el respectivo envío por medio del formulario.</p>
            <div className="formatos-grid">
              {FORMATOS.map((formato) => (
                <a
                  className="formato-card"
                  href={formato.href}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  key={formato.label}
                >
                  <h4>{formato.label}</h4>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Fila 2: Dos columnas - Izquierda: Perfiles, Derecha: Formulario */}
          <div className="trabaja-cols">
            <Reveal as="div" className="perfiles" delay={80}>
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
                    <input className="form-input" type="text" id="trabaja-nombre" name="nombre" placeholder="Nombres y apellidos" required aria-invalid={!!fieldErrors.nombre} />
                    {fieldErrors.nombre && <span className="form-field-error">{fieldErrors.nombre}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="trabaja-correo">
                      Correo electrónico <span className="req">*</span>
                    </label>
                    <input className="form-input" type="email" id="trabaja-correo" name="correo" placeholder="correo@ejemplo.com" required aria-invalid={!!fieldErrors.correo} />
                    {fieldErrors.correo && <span className="form-field-error">{fieldErrors.correo}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="trabaja-telefono">
                      Teléfono <span className="req">*</span>
                    </label>
                    <input className="form-input" type="tel" id="trabaja-telefono" name="telefono" placeholder="+57 ..." required aria-invalid={!!fieldErrors.telefono} />
                    {fieldErrors.telefono && <span className="form-field-error">{fieldErrors.telefono}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="trabaja-ciudad">Ciudad</label>
                    <input className="form-input" type="text" id="trabaja-ciudad" name="ciudad" placeholder="Ej: Arauca" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="trabaja-cargo">
                      Cargo al que aspira <span className="req">*</span>
                    </label>
                    <select className="form-select" id="trabaja-cargo" name="cargo" required aria-invalid={!!fieldErrors.cargo}>
                      <option value="">Seleccione un cargo...</option>
                      {PERFILES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                    {fieldErrors.cargo && <span className="form-field-error">{fieldErrors.cargo}</span>}
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
            <p className="form-error" role="alert" aria-live="polite">{errorEnvio || '\u00A0'}</p>
                <button className="btn btn-primary form-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? 'Enviando…' : 'Enviar postulación'}
                </button>
              </form>
            </Reveal>
          </div>
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

      {servidorOk && <ExitoServidor onClose={() => setServidorOk(false)} />}
    </section>
  )
}