import { useRef, useState } from 'react'
import { PHONE_DISPLAY, EMAIL, SERVICIOS_SELECCION } from '../data.js'
import { waLink, formatBytes, FIELD_ERROR_SUMMARY } from '../utils.js'
import { contactoSchema, formatZodErrors } from '../schemas.js'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import GuidedForm, { ReviewRow } from './GuidedForm.jsx'
import './Contacto.css'
import './form.css'

const INFO = [
  {
    icon: 'mapPin',
    title: 'Dirección',
    value: 'Calle 7 Sur #24-66 (Lote), Barrio El Olímpico — Arauca, Colombia',
    href: 'https://www.google.com/maps/search/?api=1&query=7.063694,-70.759028',
  },
  { icon: 'phone', title: 'Teléfono', value: PHONE_DISPLAY, href: 'tel:+573142318040' },
  {
    icon: 'whatsapp',
    title: 'WhatsApp',
    value: PHONE_DISPLAY,
    href: waLink('Hola, me comunico desde el sitio web de IPS VITAHER S.A.S.'),
  },
  {
    icon: 'mail',
    title: 'Correo electrónico',
    value: EMAIL,
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`,
  },
  {
    icon: 'clock',
    title: 'Horario de atención',
    value: 'Lunes a viernes · 8:00 a.m.–12:00 p.m. y 2:00 p.m.–6:00 p.m.',
  },
]

const MAX_MB = 20
const EXT_OK = /\.(pdf|jpe?g|png|webp|docx?)$/i
const STEP_LABELS = ['Datos', 'Servicio', 'Mensaje', 'Enviar']

const EMPTY = {
  nombre: '',
  telefono: '',
  correo: '',
  servicio: '',
  mensaje: '',
}

function validateDato(key, value) {
  const result = contactoSchema.shape[key].safeParse(value ?? '')
  return result.success ? '' : result.error.issues[0]?.message || 'Campo inválido'
}

function stepErrors(step, datos, tratamiento) {
  const errors = {}

  if (step === 1) {
    if (!datos.nombre.trim()) {
      errors.nombre = 'Escribe tu nombre completo.'
    } else {
      const message = validateDato('nombre', datos.nombre)
      if (message) errors.nombre = message
    }

    if (!datos.telefono.trim()) {
      errors.telefono = 'Escribe tu teléfono de contacto.'
    } else {
      const message = validateDato('telefono', datos.telefono)
      if (message) errors.telefono = message
    }

    const correoMessage = validateDato('correo', datos.correo)
    if (correoMessage) errors.correo = correoMessage
  }

  if (step === 2) {
    const message = validateDato('servicio', datos.servicio)
    if (message) errors.servicio = message
  }

  if (step === 3) {
    if (!datos.mensaje.trim()) {
      errors.mensaje = 'Escribe tu mensaje.'
    } else {
      const message = validateDato('mensaje', datos.mensaje)
      if (message) errors.mensaje = message
    }
  }

  if (step === 4 && !tratamiento) {
    errors.tratamientoDatos = 'Debes aceptar el tratamiento de datos personales.'
  }

  return errors
}

export default function Contacto() {
  const [step, setStep] = useState(1)
  const [datos, setDatos] = useState({ ...EMPTY })
  const [soportes, setSoportes] = useState([])
  const [tratamiento, setTratamiento] = useState(false)
  const [consentSubmitted, setConsentSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const formRef = useRef(null)

  function clearFieldError(key) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function updateDato(key, value) {
    setDatos((prev) => ({ ...prev, [key]: value }))
    clearFieldError(key)
    if (error) setError('')
  }

  function focusField(name) {
    formRef.current?.querySelector(`[name="${name}"]`)?.focus()
  }

  function handleConsentChange(checked) {
    setTratamiento(checked)
    if (checked) {
      clearFieldError('tratamientoDatos')
      if (error) setError('')
      return
    }
    if (consentSubmitted) {
      setFieldErrors((prev) => ({
        ...prev,
        tratamientoDatos: 'Debes aceptar el tratamiento de datos personales.',
      }))
    }
  }

  function goToStep(nextStep) {
    setStep(nextStep)
    window.requestAnimationFrame(() => {
      const form = formRef.current
      if (!form) return
      const rect = form.getBoundingClientRect()
      if (rect.top < 90) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  function editStep(nextStep) {
    setError('')
    goToStep(nextStep)
  }

  function prevStep() {
    if (step <= 1) return
    setError('')
    goToStep(step - 1)
  }

  function nextStep() {
    const errors = stepErrors(step, datos, tratamiento)
    if (Object.keys(errors).length) {
      setFieldErrors((prev) => ({ ...prev, ...errors }))
      setError(FIELD_ERROR_SUMMARY)
      const first = Object.keys(errors)[0]
      if (first && first !== 'tratamientoDatos') focusField(first)
      return
    }
    setError('')
    goToStep(Math.min(4, step + 1))
  }

  function handleSoportes(event) {
    const selected = [...event.target.files]
    event.target.value = ''
    if (!selected.length) return

    const invalid = selected.find((file) => !EXT_OK.test(file.name))
    if (invalid) {
      const message = 'Adjunta la orden en PDF, Word o imagen.'
      setFieldErrors((prev) => ({ ...prev, soportes: message }))
      setError(FIELD_ERROR_SUMMARY)
      return
    }

    const tooBig = selected.find((file) => file.size > MAX_MB * 1024 * 1024)
    if (tooBig) {
      const message = `Cada archivo debe pesar máximo ${MAX_MB} MB.`
      setFieldErrors((prev) => ({ ...prev, soportes: message }))
      setError(FIELD_ERROR_SUMMARY)
      return
    }

    setSoportes(selected)
    clearFieldError('soportes')
    setError('')
  }

  function removeSoporte(index) {
    setSoportes((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
    clearFieldError('soportes')
    if (error) setError('')
  }

  function resetForm() {
    setDatos({ ...EMPTY })
    setSoportes([])
    setTratamiento(false)
    setConsentSubmitted(false)
    setFieldErrors({})
    setError('')
    setStep(1)
  }

  function submitContacto() {
    const consentErrors = stepErrors(4, datos, tratamiento)
    if (Object.keys(consentErrors).length) {
      setConsentSubmitted(true)
      setFieldErrors((prev) => ({ ...prev, ...consentErrors }))
      setError('')
      focusField('tratamientoDatos')
      return
    }

    const parsed = contactoSchema.safeParse({
      ...datos,
      tratamientoDatos: tratamiento ? 'on' : '',
    })

    if (!parsed.success) {
      const validationErrors = formatZodErrors(parsed.error)
      setFieldErrors((prev) => ({ ...prev, ...validationErrors }))
      setError(FIELD_ERROR_SUMMARY)
      const first = Object.keys(validationErrors)[0]
      const stepForField = {
        nombre: 1,
        telefono: 1,
        correo: 1,
        servicio: 2,
        mensaje: 3,
        tratamientoDatos: 4,
      }
      if (first && stepForField[first]) {
        if (first === 'tratamientoDatos') focusField(first)
        else goToStep(stepForField[first])
      }
      return
    }

    const data = parsed.data
    const msg = [
      '*Solicitud de cita / mensaje — IPS VITAHER S.A.S.*',
      '',
      `Servicio de interés: ${data.servicio || 'No especificado'}`,
      `Mensaje: ${data.mensaje}`,
      '',
      `Nombre: ${data.nombre}`,
      `Teléfono: ${data.telefono}`,
      `Correo: ${data.correo || '—'}`,
      '',
      soportes.length
        ? `Orden o autorización adjunta: ${soportes.map((file) => file.name).join(', ')} (adjuntar en WhatsApp)`
        : 'Sin archivos - adjuntar en WhatsApp si aplica',
    ].join('\n')

    const win = window.open(waLink(msg), '_blank')
    if (win) win.opener = null
    resetForm()
  }

  const steps = [
    {
      label: STEP_LABELS[0],
      title: 'Empecemos por tus datos',
      subtitle: 'Así podremos contactarte y orientarte con tu solicitud.',
      content: (
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="contacto-nombre">
              Nombre completo <span className="req">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              id="contacto-nombre"
              name="nombre"
              placeholder="Nombres y apellidos"
              value={datos.nombre}
              onChange={(event) => updateDato('nombre', event.target.value)}
              onBlur={(event) => updateDato('nombre', event.target.value)}
              autoComplete="name"
              required
              aria-invalid={!!fieldErrors.nombre}
            />
            {fieldErrors.nombre && <span className="form-field-error">{fieldErrors.nombre}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="contacto-telefono">
              Teléfono <span className="req">*</span>
            </label>
            <input
              className="form-input"
              type="tel"
              id="contacto-telefono"
              name="telefono"
              placeholder="+57 ..."
              value={datos.telefono}
              onChange={(event) => updateDato('telefono', event.target.value)}
              autoComplete="tel"
              required
              aria-invalid={!!fieldErrors.telefono}
            />
            {fieldErrors.telefono && (
              <span className="form-field-error">{fieldErrors.telefono}</span>
            )}
          </div>
          <div className="form-field full">
            <label htmlFor="contacto-correo">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              id="contacto-correo"
              name="correo"
              placeholder="correo@ejemplo.com"
              value={datos.correo}
              onChange={(event) => updateDato('correo', event.target.value)}
              autoComplete="email"
              aria-invalid={!!fieldErrors.correo}
            />
            {fieldErrors.correo && <span className="form-field-error">{fieldErrors.correo}</span>}
          </div>
        </div>
      ),
    },
    {
      label: STEP_LABELS[1],
      title: '¿Qué servicio te interesa?',
      subtitle: 'Selecciona el servicio o elige Otro si no estás seguro.',
      content: (
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="contacto-servicio">Servicio de interés</label>
            <select
              className="form-select"
              id="contacto-servicio"
              name="servicio"
              value={datos.servicio}
              onChange={(event) => updateDato('servicio', event.target.value)}
              aria-invalid={!!fieldErrors.servicio}
            >
              <option value="">Seleccione un servicio...</option>
              {SERVICIOS_SELECCION.map((servicio) => (
                <option key={servicio} value={servicio}>
                  {servicio}
                </option>
              ))}
            </select>
            {fieldErrors.servicio && (
              <span className="form-field-error">{fieldErrors.servicio}</span>
            )}
            <span className="guided-field-hint">
              Este dato es opcional. Si no sabes qué servicio necesitas, elige Otro y te orientamos.
            </span>
          </div>
        </div>
      ),
    },
    {
      label: STEP_LABELS[2],
      title: 'Cuéntanos cómo podemos ayudarte',
      subtitle: 'Escribe tu mensaje y adjunta la orden o autorización si la tienes.',
      content: (
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="contacto-mensaje">
              Mensaje <span className="req">*</span>
            </label>
            <textarea
              className="form-textarea"
              id="contacto-mensaje"
              name="mensaje"
              placeholder="Cuéntanos cómo podemos ayudarte..."
              value={datos.mensaje}
              onChange={(event) => updateDato('mensaje', event.target.value)}
              maxLength={2000}
              required
              aria-invalid={!!fieldErrors.mensaje}
            />
            {fieldErrors.mensaje && <span className="form-field-error">{fieldErrors.mensaje}</span>}
          </div>
          <div className="form-field full">
            <label htmlFor="contacto-archivos">Adjuntar orden o autorización</label>
            <div className="form-file">
              <input
                id="contacto-archivos"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={handleSoportes}
                aria-label="Adjuntar orden o autorización"
              />
              <span className="form-file-label">
                <Icon name="upload" size={18} />
                {soportes.length > 0
                  ? `${soportes.length} archivo(s) seleccionado(s)`
                  : 'Subir orden o autorización'}
              </span>
            </div>
            <span className="guided-field-hint">
              PDF, Word o imagen · máximo {MAX_MB} MB por archivo. La adjuntas en el chat de WhatsApp.
            </span>
            {fieldErrors.soportes && (
              <span className="form-field-error">{fieldErrors.soportes}</span>
            )}
            {soportes.length > 0 && (
              <div className="guided-files">
                {soportes.map((file, index) => (
                  <div className="guided-file-item" key={`${file.name}-${file.size}-${index}`}>
                    <span className="guided-file-name">{file.name}</span>
                    <span className="guided-file-meta">{formatBytes(file.size)}</span>
                    <button
                      type="button"
                      className="guided-file-remove"
                      onClick={() => removeSoporte(index)}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      label: STEP_LABELS[3],
      title: 'Revisa y envía',
      subtitle:
        'Al enviar se abrirá WhatsApp con tu mensaje listo. Adjunta allí la orden o autorización.',
      content: (
        <>
          <div className="guided-review">
            <div className="guided-review-group">
              <div className="guided-review-head">
                <span>Tus datos</span>
                <button type="button" className="guided-edit" onClick={() => editStep(1)}>
                  Editar
                </button>
              </div>
              <ReviewRow label="Nombre" value={datos.nombre.trim()} />
              <ReviewRow label="Teléfono" value={datos.telefono.trim()} />
              <ReviewRow label="Correo" value={datos.correo.trim()} />
            </div>

            <div className="guided-review-group">
              <div className="guided-review-head">
                <span>Servicio</span>
                <button type="button" className="guided-edit" onClick={() => editStep(2)}>
                  Editar
                </button>
              </div>
              <ReviewRow label="Servicio de interés" value={datos.servicio} />
            </div>

            <div className="guided-review-group">
              <div className="guided-review-head">
                <span>Mensaje</span>
                <button type="button" className="guided-edit" onClick={() => editStep(3)}>
                  Editar
                </button>
              </div>
              <ReviewRow label="Mensaje" value={datos.mensaje.trim()} />
              <ReviewRow
                label="Archivos"
                value={
                  soportes.length
                    ? soportes.map((file) => file.name).join(', ')
                    : 'Sin archivos'
                }
              />
            </div>
          </div>

          <label className="form-check guided-consent">
            <input
              type="checkbox"
              name="tratamientoDatos"
              checked={tratamiento}
              onChange={(event) => handleConsentChange(event.target.checked)}
              required
              aria-invalid={!!fieldErrors.tratamientoDatos}
            />
            <span>
              Autorizo de manera previa, expresa e informada el tratamiento de mis datos personales
              a <strong>IPS VITAHER S.A.S. ZOMAC</strong>, conforme a su{' '}
              <button
                type="button"
                className="form-check-link"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('open-legal', { detail: 'datos' }))
                }
              >
                Política de Tratamiento de Datos
              </button>
              . <span className="req">*</span>
            </span>
          </label>
          {fieldErrors.tratamientoDatos && (
            <span className="form-field-error">{fieldErrors.tratamientoDatos}</span>
          )}
        </>
      ),
    },
  ]

  return (
    <section className="section contacto" id="contacto">
      <div className="container">
        <div className="section-head">
          <span className="section-label">Contáctanos</span>
          <h2>Estamos para servirte</h2>
          <p>
            Nuestro equipo está disponible para atender tus inquietudes y orientarte sobre nuestros
            servicios.
          </p>
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
            <GuidedForm
              id="contacto-form"
              className="contacto-form"
              title="Agendar cita / enviar mensaje"
              titleId="contacto-form-title"
              subtitle="Cuatro pasos. Al final podrás enviar tu solicitud por WhatsApp."
              steps={steps}
              step={step}
              onNext={nextStep}
              onPrev={prevStep}
              onSubmit={submitContacto}
              submitLabel="Enviar por WhatsApp"
              error={error}
              formRef={formRef}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
