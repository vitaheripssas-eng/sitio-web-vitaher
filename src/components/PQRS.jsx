import { useEffect, useRef, useState } from 'react'
import {
  PQRS_TIPOS,
  MUNICIPIOS_ARAUCA,
  SERVICIOS_SELECCION,
  CARGO_GRUPOS,
} from '../data.js'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import { pqrsSchema, formatZodErrors } from '../schemas.js'
import {
  enviarConArchivo,
  formatBytes,
  formatFechaHora,
  registrarRadicado,
  waLink,
  FIELD_ERROR_SUMMARY,
} from '../utils.js'
import GuidedForm, { ReviewRow } from './GuidedForm.jsx'
import { RadicadoToast, SeguimientoModal } from './Radicado.jsx'
import './PQRS.css'
import './form.css'

const TIPOS_DOC = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Tarjeta de identidad']
const MAX_MB = 20
const EXT_OK = /\.(pdf|jpe?g|png|webp|docx?|xlsx?)$/i
const STEP_LABELS = ['Datos', 'Solicitud', 'Detalle', 'Enviar']

const EMPTY = {
  nombre: '',
  tipoDoc: '',
  numDoc: '',
  telefono: '',
  correo: '',
  municipio: '',
  direccion: '',
  tipoSolicitud: '',
  servicio: '',
  fecha: '',
  descripcion: '',
}

function ahoraLocal() {
  const date = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function validateDato(key, value) {
  const result = pqrsSchema.shape[key].safeParse(value ?? '')
  return result.success ? '' : result.error.issues[0]?.message || 'Campo inválido'
}

function radicadoDesdeUrl() {
  if (typeof window === 'undefined') return ''
  const value = new URLSearchParams(window.location.search).get('radicado')?.trim().toUpperCase()
  return value?.startsWith('PQRS') ? value : ''
}

function stepErrors(step, datos, tratamiento) {
  const errors = {}

  if (step === 1) {
    for (const key of ['nombre', 'tipoDoc', 'numDoc', 'telefono', 'correo', 'municipio', 'direccion']) {
      const message = validateDato(key, datos[key])
      if (message) errors[key] = message
    }
  }

  if (step === 2) {
    if (!datos.tipoSolicitud) errors.tipoSolicitud = 'Selecciona un tipo de solicitud.'
    for (const key of ['servicio', 'fecha']) {
      const message = validateDato(key, datos[key])
      if (message) errors[key] = message
    }
  }

  if (step === 3) {
    if (!datos.descripcion.trim()) {
      errors.descripcion = 'Describe tu solicitud.'
    } else {
      const message = validateDato('descripcion', datos.descripcion)
      if (message) errors.descripcion = message
    }
  }

  if (step === 4 && !tratamiento) {
    errors.tratamientoDatos = 'Debes aceptar el tratamiento de datos personales.'
  }

  return errors
}

export default function PQRS() {
  const [step, setStep] = useState(1)
  const [datos, setDatos] = useState(() => ({ ...EMPTY, fecha: ahoraLocal() }))
  const [files, setFiles] = useState([])
  const [tratamiento, setTratamiento] = useState(false)
  const [consentSubmitted, setConsentSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [radicado, setRadicado] = useState(null)
  const [seguimientoRadicado, setSeguimientoRadicado] = useState(() => radicadoDesdeUrl())
  const [seguimientoOpen, setSeguimientoOpen] = useState(() => Boolean(radicadoDesdeUrl()))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    if (!radicadoDesdeUrl()) return
    window.requestAnimationFrame(() => {
      document.getElementById('pqrs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

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

  function handleFiles(event) {
    const selected = [...event.target.files]
    event.target.value = ''
    if (!selected.length) return

    const invalid = selected.find((file) => !EXT_OK.test(file.name))
    if (invalid) {
      const message = 'Adjunta archivos PDF, Word, Excel o imágenes.'
      setFieldErrors((prev) => ({ ...prev, files: message }))
      setError(FIELD_ERROR_SUMMARY)
      return
    }

    const tooBig = selected.find((file) => file.size > MAX_MB * 1024 * 1024)
    if (tooBig) {
      const message = `Cada archivo debe pesar máximo ${MAX_MB} MB.`
      setFieldErrors((prev) => ({ ...prev, files: message }))
      setError(FIELD_ERROR_SUMMARY)
      return
    }

    setFiles(selected)
    clearFieldError('files')
    setError('')
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
    clearFieldError('files')
    if (error) setError('')
  }

  function resetForm() {
    setDatos({ ...EMPTY, fecha: ahoraLocal() })
    setFiles([])
    setTratamiento(false)
    setConsentSubmitted(false)
    setFieldErrors({})
    setError('')
    setStep(1)
  }

  async function submitPqrs() {
    if (isSubmitting) return

    const consentErrors = stepErrors(4, datos, tratamiento)
    if (Object.keys(consentErrors).length) {
      setConsentSubmitted(true)
      setFieldErrors((prev) => ({ ...prev, ...consentErrors }))
      setError('')
      focusField('tratamientoDatos')
      return
    }

    const parsed = pqrsSchema.safeParse({
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
        tipoDoc: 1,
        numDoc: 1,
        telefono: 1,
        correo: 1,
        municipio: 1,
        direccion: 1,
        tipoSolicitud: 2,
        servicio: 2,
        fecha: 2,
        descripcion: 3,
        tratamientoDatos: 4,
      }
      if (first && stepForField[first]) {
        if (first === 'tratamientoDatos') focusField(first)
        else goToStep(stepForField[first])
      }
      return
    }

    const data = parsed.data
    const documento = data.numDoc
      ? [data.tipoDoc, data.numDoc].filter(Boolean).join(' ')
      : 'No indicado'
    const fechaTexto = formatFechaHora(data.fecha) || 'No indicada'
    const extra = [
      `Tipo: ${data.tipoSolicitud}`,
      `Servicio: ${data.servicio || 'No especificado'}`,
      `Fecha del evento: ${fechaTexto}`,
      `Documento: ${documento}`,
      `Municipio: ${data.municipio || '—'}`,
      `Dirección: ${data.direccion || '—'}`,
    ].join('\n')

    if (files.length) {
      setIsSubmitting(true)
      setError('')
      try {
        const fd = new FormData()
        fd.append('tipo', `PQRS - ${data.tipoSolicitud}`)
        fd.append('para', 'talentohumanovitaher@gmail.com')
        fd.append('destinatario', 'talentohumanovitaher@gmail.com')
        fd.append('nombre', data.nombre || 'Anónimo')
        fd.append('telefono', data.telefono ?? '')
        fd.append('correo', data.correo ?? '')
        fd.append('extra', extra)
        fd.append('mensaje', data.descripcion)
        fd.append('website', '')
        for (const file of files) fd.append('archivo[]', file)
        const res = await enviarConArchivo(fd)
        setRadicado({ numero: res.radicado || '', categoria: 'PQRS' })
        resetForm()
      } catch (err) {
        setError(
          err?.message ||
            'No pudimos enviar los archivos. Presenta tu PQRS por WhatsApp y adjúntalos en el chat.',
        )
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // Abrimos la pestaña antes del await para que el navegador no bloquee WhatsApp.
    const waWindow = window.open('', '_blank')
    if (waWindow) {
      try {
        waWindow.document.write(
          '<title>Abriendo WhatsApp…</title><p style="font-family:system-ui;padding:24px">Abriendo WhatsApp…</p>',
        )
      } catch {
        // La pestaña sigue siendo válida aunque no permita escribir el aviso.
      }
    }

    setIsSubmitting(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('categoria', 'PQRS')
      fd.append('tipo', `PQRS - ${data.tipoSolicitud}`)
      fd.append('nombre', data.nombre || 'Anónimo')
      fd.append('telefono', data.telefono ?? '')
      fd.append('correo', data.correo ?? '')
      fd.append('extra', extra)
      fd.append('mensaje', data.descripcion)
      fd.append('website', '')
      const registro = await registrarRadicado(fd)

      const msg = [
        '*PQRS — IPS VITAHER S.A.S.*',
        '',
        `Radicado: ${registro.radicado}`,
        `Tipo: ${data.tipoSolicitud}`,
        `Servicio: ${data.servicio || 'No especificado'}`,
        `Fecha del evento: ${fechaTexto}`,
        '',
        `Descripción: ${data.descripcion}`,
        '',
        `Nombre: ${data.nombre || 'Anónimo'}`,
        `Documento: ${documento}`,
        `Teléfono: ${data.telefono || '—'}`,
        `Correo: ${data.correo || '—'}`,
        `Municipio: ${data.municipio || '—'}`,
        `Dirección: ${data.direccion || '—'}`,
        '',
        'Sin archivos - adjuntar en WhatsApp si aplica',
      ].join('\n')

      const url = waLink(msg)
      if (waWindow && !waWindow.closed) {
        waWindow.location.href = url
      } else {
        const fallback = window.open(url, '_blank')
        if (fallback) fallback.opener = null
        else window.location.href = url
      }

      setRadicado({ numero: registro.radicado, categoria: 'PQRS' })
      resetForm()
    } catch (err) {
      if (waWindow && !waWindow.closed) waWindow.close()
      setError(err?.message || 'No pudimos registrar tu PQRS. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    {
      label: STEP_LABELS[0],
      title: 'Tus datos de contacto',
      subtitle: 'Este paso es opcional: puedes presentar tu PQRS de forma anónima.',
      content: (
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="pqrs-nombre">Nombre completo</label>
            <input
              className="form-input"
              type="text"
              id="pqrs-nombre"
              name="nombre"
              placeholder="Nombres y apellidos"
              value={datos.nombre}
              onChange={(event) => updateDato('nombre', event.target.value)}
              onBlur={(event) => updateDato('nombre', event.target.value)}
              autoComplete="name"
              aria-invalid={!!fieldErrors.nombre}
            />
            {fieldErrors.nombre && <span className="form-field-error">{fieldErrors.nombre}</span>}
            <span className="guided-field-hint">
              Si lo dejas vacío, tu PQRS será anónima.
            </span>
          </div>
          <div className="form-field">
            <label htmlFor="pqrs-tipoDoc">Tipo de documento</label>
            <select
              className="form-select"
              id="pqrs-tipoDoc"
              name="tipoDoc"
              value={datos.tipoDoc}
              onChange={(event) => updateDato('tipoDoc', event.target.value)}
            >
              <option value="">Selecciona un tipo...</option>
              {TIPOS_DOC.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            {fieldErrors.tipoDoc && <span className="form-field-error">{fieldErrors.tipoDoc}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="pqrs-numDoc">Número de documento</label>
            <input
              className="form-input"
              type="text"
              id="pqrs-numDoc"
              name="numDoc"
              placeholder="Ej: 1.098.765.432"
              value={datos.numDoc}
              onChange={(event) => updateDato('numDoc', event.target.value)}
              aria-invalid={!!fieldErrors.numDoc}
            />
            {fieldErrors.numDoc && <span className="form-field-error">{fieldErrors.numDoc}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="pqrs-telefono">Teléfono</label>
            <input
              className="form-input"
              type="tel"
              id="pqrs-telefono"
              name="telefono"
              placeholder="+57 ..."
              value={datos.telefono}
              onChange={(event) => updateDato('telefono', event.target.value)}
              autoComplete="tel"
              aria-invalid={!!fieldErrors.telefono}
            />
            {fieldErrors.telefono && (
              <span className="form-field-error">{fieldErrors.telefono}</span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="pqrs-correo">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              id="pqrs-correo"
              name="correo"
              placeholder="correo@ejemplo.com"
              value={datos.correo}
              onChange={(event) => updateDato('correo', event.target.value)}
              autoComplete="email"
              aria-invalid={!!fieldErrors.correo}
            />
            {fieldErrors.correo && <span className="form-field-error">{fieldErrors.correo}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="pqrs-municipio">Municipio (Arauca)</label>
            <select
              className="form-select"
              id="pqrs-municipio"
              name="municipio"
              value={datos.municipio}
              onChange={(event) => updateDato('municipio', event.target.value)}
              aria-invalid={!!fieldErrors.municipio}
            >
              <option value="">Selecciona tu municipio...</option>
              {MUNICIPIOS_ARAUCA.map((municipio) => (
                <option key={municipio} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>
            {fieldErrors.municipio && (
              <span className="form-field-error">{fieldErrors.municipio}</span>
            )}
          </div>
          <div className="form-field full">
            <label htmlFor="pqrs-direccion">Dirección</label>
            <input
              className="form-input"
              type="text"
              id="pqrs-direccion"
              name="direccion"
              placeholder="Barrio y calle"
              value={datos.direccion}
              onChange={(event) => updateDato('direccion', event.target.value)}
              autoComplete="street-address"
              aria-invalid={!!fieldErrors.direccion}
            />
            {fieldErrors.direccion && (
              <span className="form-field-error">{fieldErrors.direccion}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      label: STEP_LABELS[1],
      title: 'Cuéntanos qué necesitas',
      subtitle: 'Selecciona el tipo de solicitud y el servicio relacionado.',
      content: (
        <div className="form-grid">
          <div className="form-field full">
            <span className="pqrs-field-label">
              Tipo de solicitud <span className="req">*</span>
            </span>
            <div
              className={`pqrs-type-grid${fieldErrors.tipoSolicitud ? ' invalid' : ''}`}
              role="radiogroup"
              aria-label="Tipo de solicitud"
              aria-invalid={!!fieldErrors.tipoSolicitud}
            >
              {PQRS_TIPOS.map((tipo) => (
                <label
                  key={tipo.value}
                  className={`pqrs-type-card${datos.tipoSolicitud === tipo.value ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="tipoSolicitud"
                    value={tipo.value}
                    checked={datos.tipoSolicitud === tipo.value}
                    onChange={() => updateDato('tipoSolicitud', tipo.value)}
                  />
                  <span className="pqrs-type-letter" aria-hidden="true">
                    {tipo.letra}
                  </span>
                  <span className="pqrs-type-text">
                    <strong>{tipo.title}</strong>
                    <span>{tipo.text}</span>
                  </span>
                </label>
              ))}
            </div>
            {fieldErrors.tipoSolicitud && (
              <span className="form-field-error">{fieldErrors.tipoSolicitud}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="pqrs-servicio">Servicio relacionado</label>
            <select
              className="form-select"
              id="pqrs-servicio"
              name="servicio"
              value={datos.servicio}
              onChange={(event) => updateDato('servicio', event.target.value)}
            >
              <option value="">Selecciona un servicio o cargo...</option>
              <optgroup label="Servicios">
                {SERVICIOS_SELECCION.map((servicio) => (
                  <option key={servicio} value={servicio}>
                    {servicio}
                  </option>
                ))}
              </optgroup>
              {CARGO_GRUPOS.map((grupo) => (
                <optgroup key={grupo.label} label={`Cargos · ${grupo.label}`}>
                  {grupo.cargos.map((cargoNombre) => (
                    <option key={cargoNombre} value={cargoNombre}>
                      {cargoNombre}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="guided-field-hint">
              Incluye los servicios y todos los cargos de postulación.
            </span>
          </div>

          <div className="form-field pqrs-fecha-field">
            <label htmlFor="pqrs-fecha">Fecha y hora del evento</label>
            <input
              className="form-input"
              type="datetime-local"
              id="pqrs-fecha"
              name="fecha"
              value={datos.fecha}
              onChange={(event) => updateDato('fecha', event.target.value)}
              aria-invalid={!!fieldErrors.fecha}
            />
            {fieldErrors.fecha && <span className="form-field-error">{fieldErrors.fecha}</span>}
          </div>
        </div>
      ),
    },
    {
      label: STEP_LABELS[2],
      title: 'Describe tu caso',
      subtitle: 'Incluye los detalles que nos ayuden a atender tu caso.',
      content: (
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="pqrs-descripcion">
              Descripción detallada <span className="req">*</span>
            </label>
            <textarea
              className="form-textarea"
              id="pqrs-descripcion"
              name="descripcion"
              placeholder="Cuéntanos con detalle qué ocurrió..."
              value={datos.descripcion}
              onChange={(event) => updateDato('descripcion', event.target.value)}
              maxLength={2000}
              required
              aria-invalid={!!fieldErrors.descripcion}
            />
            {fieldErrors.descripcion && (
              <span className="form-field-error">{fieldErrors.descripcion}</span>
            )}
            <span className="guided-field-hint">
              Incluye fechas, nombres y detalles que nos permitan verificar lo ocurrido.
            </span>
          </div>
          <div className="form-field full">
            <label htmlFor="pqrs-archivos">Adjuntar archivos</label>
            <div className="form-file">
              <input
                id="pqrs-archivos"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
                onChange={handleFiles}
                aria-label="Adjuntar archivos a la PQRS"
              />
              <span className="form-file-label">
                <Icon name="upload" size={18} />
                {files.length > 0
                  ? `${files.length} archivo(s) seleccionado(s)`
                  : 'Arrastra un archivo o haz clic para adjuntar'}
              </span>
            </div>
            <span className="guided-field-hint">
              PDF, Word, Excel o imagen · máximo {MAX_MB} MB por archivo.
            </span>
            {fieldErrors.files && <span className="form-field-error">{fieldErrors.files}</span>}
            {files.length > 0 && (
              <div className="guided-files">
                {files.map((file, index) => (
                  <div className="guided-file-item" key={`${file.name}-${file.size}-${index}`}>
                    <span className="guided-file-name">{file.name}</span>
                    <span className="guided-file-meta">{formatBytes(file.size)}</span>
                    <button
                      type="button"
                      className="guided-file-remove"
                      onClick={() => removeFile(index)}
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
        'Verifica la información antes de enviar. Con archivos se envía por correo; sin archivos, se abrirá WhatsApp directamente con tu radicado.',
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
              <ReviewRow label="Nombre" value={datos.nombre.trim() || 'Anónimo'} />
              <ReviewRow
                label="Documento"
                value={
                  datos.numDoc.trim()
                    ? [datos.tipoDoc, datos.numDoc.trim()].filter(Boolean).join(' ')
                    : ''
                }
              />
              <ReviewRow label="Teléfono" value={datos.telefono.trim()} />
              <ReviewRow label="Correo" value={datos.correo.trim()} />
              <ReviewRow label="Municipio" value={datos.municipio.trim()} />
              <ReviewRow label="Dirección" value={datos.direccion.trim()} />
            </div>

            <div className="guided-review-group">
              <div className="guided-review-head">
                <span>Tu solicitud</span>
                <button type="button" className="guided-edit" onClick={() => editStep(2)}>
                  Editar
                </button>
              </div>
              <ReviewRow label="Tipo" value={datos.tipoSolicitud} />
              <ReviewRow label="Servicio" value={datos.servicio} />
              <ReviewRow label="Fecha y hora" value={formatFechaHora(datos.fecha)} />
            </div>

            <div className="guided-review-group">
              <div className="guided-review-head">
                <span>Detalle</span>
                <button type="button" className="guided-edit" onClick={() => editStep(3)}>
                  Editar
                </button>
              </div>
              <ReviewRow label="Descripción" value={datos.descripcion.trim()} />
              <ReviewRow
                label="Archivos"
                value={files.length ? files.map((file) => file.name).join(', ') : 'Sin archivos'}
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
            {PQRS_TIPOS.map((item) => (
              <div className="pqrs-card" key={item.value}>
                <span className="pqrs-card-letra">{item.letra}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={140}>
            <GuidedForm
              id="pqrs-form"
              className="pqrs-form-card"
              title="Presenta tu PQRS"
              titleId="pqrs-form-title"
              subtitle="Cuatro pasos. Puedes presentarla de forma anónima."
              steps={steps}
              step={step}
              onNext={nextStep}
              onPrev={prevStep}
              onSubmit={submitPqrs}
              submitLabel="Enviar PQRS"
              isSubmitting={isSubmitting}
              error={error}
              formRef={formRef}
            />
            <div className="radicado-consulta">
              <span>¿Ya radicaste tu PQRS?</span>
              <button
                type="button"
                onClick={() => {
                  setSeguimientoRadicado('')
                  setSeguimientoOpen(true)
                }}
              >
                Consulta tu seguimiento
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {radicado && (
        <RadicadoToast
          radicado={radicado.numero}
          categoria={radicado.categoria}
          onClose={() => setRadicado(null)}
          onTrack={() => {
            if (!radicado.numero) return
            setSeguimientoRadicado(radicado.numero)
            setSeguimientoOpen(true)
          }}
        />
      )}

      <SeguimientoModal
        key={seguimientoOpen ? seguimientoRadicado || 'nuevo' : 'cerrado'}
        open={seguimientoOpen}
        initialRadicado={seguimientoRadicado}
        onClose={() => setSeguimientoOpen(false)}
      />
    </section>
  )
}
