import { useEffect, useRef, useState } from 'react'
import {
  CARGO_GRUPOS,
  FORMACION_OPCIONES,
  MUNICIPIOS_ARAUCA,
  PERFILES,
} from '../data.js'
import { enviarConArchivo, formatBytes, FIELD_ERROR_SUMMARY } from '../utils.js'
import { trabajaSchema, formatZodErrors } from '../schemas.js'
import GuidedForm, { ReviewRow } from './GuidedForm.jsx'
import { RadicadoToast, SeguimientoModal } from './Radicado.jsx'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Trabaja.css'
import './form.css'

const BASE = import.meta.env.BASE_URL

const FORMATOS = [
  {
    key: 'cuidador',
    label: 'Cuidador',
    short: 'Cuidador',
    href: `${BASE}formatos/FORMATO_LISTA_DE_CHEQUEO_CUIDADOR.pdf`,
    icon: 'file',
  },
  {
    key: 'profesional',
    label: 'Profesional',
    short: 'Profesional',
    href: `${BASE}formatos/FORMATO_LISTA_DE_CHEQUEO_PROFESIONAL.pdf`,
    icon: 'file',
  },
  {
    key: 'aux',
    label: 'Auxiliar de Enfermería',
    short: 'Aux. Enfermería',
    href: `${BASE}formatos/FORMATO_LISTA_DE_CHEQUEO_AUX_ENFERMERIA.pdf`,
    icon: 'file',
  },
  {
    key: 'admin',
    label: 'Administrativo',
    short: 'Administrativo',
    href: `${BASE}formatos/FORMATO_LISTA_DE_CHEQUEO_ADMINISTRATIVO.pdf`,
    icon: 'file',
  },
]

const CARGO_KEYS = {
  Cuidadores: 'cuidador',
  'Auxiliar de Enfermería': 'aux',
  'Personal Administrativo': 'admin',
  'Servicios Generales': 'admin',
  Sistemas: 'admin',
}

const EMPTY_DATOS = {
  nombre: '',
  telefono: '',
  correo: '',
  municipio: '',
  formacion: '',
  experiencia: '',
}

const MAX_MB = 20
const STEP_LABELS = ['Datos', 'Perfil', 'Documentos', 'Enviar']

function checklistKeyFor(cargo) {
  return CARGO_KEYS[cargo] ?? 'profesional'
}

function formatoByKey(key) {
  return FORMATOS.find((formato) => formato.key === key) ?? FORMATOS[1]
}

function radicadoDesdeUrl(prefix) {
  if (typeof window === 'undefined') return ''
  const value = new URLSearchParams(window.location.search).get('radicado')?.trim().toUpperCase()
  return value?.startsWith(prefix) ? value : ''
}

function fileBadge(entry, kind) {
  if (!entry) return 'PDF'
  return kind === 'cv' || /\.pdf$/i.test(entry.name) ? 'PDF' : 'IMG'
}

function validateDato(key, value) {
  const result = trabajaSchema.shape[key].safeParse(value ?? '')
  return result.success ? '' : result.error.issues[0]?.message || 'Campo inválido'
}

function stepErrors(stepNumber, { datos, cargo, files, tratamiento }) {
  const errors = {}

  if (stepNumber === 1) {
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

    if (!datos.correo.trim()) {
      errors.correo = 'Escribe tu correo electrónico.'
    } else {
      const message = validateDato('correo', datos.correo)
      if (message) errors.correo = message
    }

    const municipioMessage = validateDato('municipio', datos.municipio)
    if (municipioMessage) errors.municipio = municipioMessage
  }

  if (stepNumber === 2) {
    if (!cargo) errors.cargo = 'Selecciona un cargo'
    for (const key of ['formacion', 'experiencia']) {
      const message = validateDato(key, datos[key])
      if (message) errors[key] = message
    }
  }

  if (stepNumber === 3) {
    if (!files.checklist) errors.checklist = 'Adjunta la lista de chequeo firmada.'
    if (!files.cv) errors.cv = 'Adjunta tu hoja de vida en PDF.'
  }

  if (stepNumber === 4 && !tratamiento) {
    errors.tratamientoDatos = 'Debes aceptar el tratamiento de datos personales.'
  }

  return errors
}

export default function Trabaja() {
  const [step, setStep] = useState(1)
  const [datos, setDatos] = useState({ ...EMPTY_DATOS })
  const [cargo, setCargo] = useState('')
  const [checklistNotice, setChecklistNotice] = useState('')
  const [files, setFiles] = useState({ cv: null, checklist: null })
  const [tratamiento, setTratamiento] = useState(false)
  const [consentSubmitted, setConsentSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [radicado, setRadicado] = useState(null)
  const [seguimientoRadicado, setSeguimientoRadicado] = useState(() => radicadoDesdeUrl('POST'))
  const [seguimientoOpen, setSeguimientoOpen] = useState(() => Boolean(radicadoDesdeUrl('POST')))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)
  const cvInputRef = useRef(null)
  const checklistInputRef = useRef(null)

  const checklist = formatoByKey(cargo ? checklistKeyFor(cargo) : 'profesional')
  const checklistHint =
    checklistNotice ||
    (cargo
      ? `Para ${cargo} se asigna automáticamente la lista de ${checklist.label}.`
      : 'Selecciona tu cargo para asignar la lista que corresponde.')

  useEffect(() => {
    if (!radicadoDesdeUrl('POST')) return
    window.requestAnimationFrame(() => {
      document.getElementById('trabaja')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    if (formError) setFormError('')
  }

  function removeFile(kind) {
    setFiles((prev) => ({ ...prev, [kind]: null }))
    clearFieldError(kind)
    setFormError('')
    if (kind === 'cv' && cvInputRef.current) cvInputRef.current.value = ''
    if (kind === 'checklist' && checklistInputRef.current) checklistInputRef.current.value = ''
  }

  function handleCargoChange(value) {
    const changed = value !== cargo
    setCargo(value)
    clearFieldError('cargo')
    setFormError('')
    if (changed && files.checklist) {
      removeFile('checklist')
      setChecklistNotice('Cambiaste de cargo. Vuelve a subir la lista de chequeo firmada que corresponde.')
    } else {
      setChecklistNotice('')
    }
  }

  function handleConsentChange(checked) {
    setTratamiento(checked)
    if (checked) {
      clearFieldError('tratamientoDatos')
      if (formError) setFormError('')
      return
    }
    if (consentSubmitted) {
      setFieldErrors((prev) => ({
        ...prev,
        tratamientoDatos: 'Debes aceptar el tratamiento de datos personales.',
      }))
    }
  }

  function handleFileInput(kind, event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const isCv = kind === 'cv'
    const allowed = isCv ? /\.pdf$/i.test(file.name) : /\.(pdf|jpe?g|png)$/i.test(file.name)

    if (!allowed) {
      removeFile(kind)
      const message = isCv
        ? 'La hoja de vida debe ser un archivo PDF.'
        : 'La lista de chequeo debe ser PDF, JPG o PNG.'
      setFieldErrors((prev) => ({ ...prev, [kind]: message }))
      setFormError(FIELD_ERROR_SUMMARY)
      return
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      removeFile(kind)
      const message = `El archivo supera el límite de ${MAX_MB} MB.`
      setFieldErrors((prev) => ({ ...prev, [kind]: message }))
      setFormError(FIELD_ERROR_SUMMARY)
      return
    }

    setFiles((prev) => ({ ...prev, [kind]: { file, name: file.name, size: file.size } }))
    clearFieldError(kind)
    setFormError('')
    if (kind === 'checklist') setChecklistNotice('')
  }

  function focusField(name) {
    const field = formRef.current?.querySelector(`[name="${name}"]`)
    field?.focus()
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

  function nextStep() {
    const errors = stepErrors(step, { datos, cargo, files, tratamiento })
    if (Object.keys(errors).length) {
      setFieldErrors((prev) => ({ ...prev, ...errors }))
      setFormError(FIELD_ERROR_SUMMARY)
      if (step === 1) {
        const first = ['nombre', 'telefono', 'correo', 'municipio'].find((key) => errors[key])
        if (first) focusField(first)
      } else if (step === 2) {
        const first = ['cargo', 'formacion', 'experiencia'].find((key) => errors[key])
        if (first) focusField(first)
      }
      return
    }
    setFormError('')
    goToStep(Math.min(4, step + 1))
  }

  function prevStep() {
    if (step <= 1) return
    setFormError('')
    goToStep(step - 1)
  }

  function editStep(nextStep) {
    setFormError('')
    goToStep(nextStep)
  }

  function resetForm() {
    setDatos({ ...EMPTY_DATOS })
    setCargo('')
    setChecklistNotice('')
    setFiles({ cv: null, checklist: null })
    setTratamiento(false)
    setConsentSubmitted(false)
    setFieldErrors({})
    setFormError('')
    setStep(1)
    if (cvInputRef.current) cvInputRef.current.value = ''
    if (checklistInputRef.current) checklistInputRef.current.value = ''
  }

  async function handleSubmit() {
    const consentErrors = stepErrors(4, { datos, cargo, files, tratamiento })
    if (Object.keys(consentErrors).length) {
      setConsentSubmitted(true)
      setFieldErrors((prev) => ({ ...prev, ...consentErrors }))
      setFormError('')
      focusField('tratamientoDatos')
      return
    }

    const parsed = trabajaSchema.safeParse({
      ...datos,
      cargo,
      tratamientoDatos: tratamiento ? 'on' : '',
    })

    if (!parsed.success) {
      const validationErrors = formatZodErrors(parsed.error)
      setFieldErrors((prev) => ({ ...prev, ...validationErrors }))
      setFormError(FIELD_ERROR_SUMMARY)
      const first = Object.keys(validationErrors)[0]
      if (['nombre', 'telefono', 'correo', 'municipio'].includes(first)) goToStep(1)
      else if (['cargo', 'formacion', 'experiencia'].includes(first)) goToStep(2)
      else focusField('tratamientoDatos')
      return
    }

    if (!files.cv || !files.checklist) {
      const fileErrors = stepErrors(3, { datos, cargo, files, tratamiento })
      setFieldErrors((prev) => ({ ...prev, ...fileErrors }))
      setFormError(FIELD_ERROR_SUMMARY)
      goToStep(3)
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const data = parsed.data
    const fd = new FormData()
    fd.append('tipo', 'Postulación laboral')
    fd.append('destinatario', 'talentohumanovitaher@gmail.com')
    fd.append('para', 'talentohumanovitaher@gmail.com')
    fd.append('nombre', data.nombre)
    fd.append('telefono', data.telefono)
    fd.append('correo', data.correo)
    fd.append(
      'extra',
      [
        `Cargo: ${data.cargo}`,
        `Nivel de formación: ${data.formacion || '-'}`,
        `Municipio: ${data.municipio || '-'}`,
        `Lista de chequeo: ${checklist.label}`,
      ].join('\n'),
    )
    fd.append('mensaje', data.experiencia || 'Sin descripción de experiencia.')
    fd.append('website', '')
    fd.append('archivo[]', files.checklist.file)
    fd.append('archivo[]', files.cv.file)

    try {
      const res = await enviarConArchivo(fd)
      setRadicado({ numero: res.radicado || '', categoria: 'POST' })
      resetForm()
    } catch (err) {
      setFormError(
        err?.message ||
          'No pudimos enviar tu postulación. Revisa tu conexión e inténtalo de nuevo, o escríbenos por WhatsApp y adjunta los dos archivos.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    {
      label: STEP_LABELS[0],
      title: 'Empecemos por tus datos',
      subtitle: 'Déjanos tus datos de contacto para comunicarnos contigo.',
      content: (
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="trabaja-nombre">
              Nombre completo <span className="req">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              id="trabaja-nombre"
              name="nombre"
              placeholder="Nombres y apellidos"
              value={datos.nombre}
              onChange={(event) => updateDato('nombre', event.target.value)}
              onBlur={(event) => updateDato('nombre', event.target.value)}
              autoComplete="name"
              required
              aria-invalid={!!fieldErrors.nombre}
              aria-describedby={fieldErrors.nombre ? 'trabaja-nombre-error' : undefined}
            />
            {fieldErrors.nombre && (
              <span id="trabaja-nombre-error" className="form-field-error">
                {fieldErrors.nombre}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="trabaja-telefono">
              Teléfono / WhatsApp <span className="req">*</span>
            </label>
            <input
              className="form-input"
              type="tel"
              id="trabaja-telefono"
              name="telefono"
              placeholder="+57 300 000 0000"
              value={datos.telefono}
              onChange={(event) => updateDato('telefono', event.target.value)}
              autoComplete="tel"
              required
              aria-invalid={!!fieldErrors.telefono}
              aria-describedby={fieldErrors.telefono ? 'trabaja-telefono-error' : undefined}
            />
            {fieldErrors.telefono && (
              <span id="trabaja-telefono-error" className="form-field-error">
                {fieldErrors.telefono}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="trabaja-correo">
              Correo electrónico <span className="req">*</span>
            </label>
            <input
              className="form-input"
              type="email"
              id="trabaja-correo"
              name="correo"
              placeholder="correo@ejemplo.com"
              value={datos.correo}
              onChange={(event) => updateDato('correo', event.target.value)}
              autoComplete="email"
              required
              aria-invalid={!!fieldErrors.correo}
              aria-describedby={fieldErrors.correo ? 'trabaja-correo-error' : undefined}
            />
            {fieldErrors.correo && (
              <span id="trabaja-correo-error" className="form-field-error">
                {fieldErrors.correo}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="trabaja-municipio">Municipio (Arauca)</label>
            <select
              className="form-select"
              id="trabaja-municipio"
              name="municipio"
              value={datos.municipio}
              onChange={(event) => updateDato('municipio', event.target.value)}
              autoComplete="address-level2"
              aria-invalid={!!fieldErrors.municipio}
              aria-describedby={fieldErrors.municipio ? 'trabaja-municipio-error' : undefined}
            >
              <option value="">Selecciona tu municipio...</option>
              {MUNICIPIOS_ARAUCA.map((municipio) => (
                <option key={municipio} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>
            {fieldErrors.municipio && (
              <span id="trabaja-municipio-error" className="form-field-error">
                {fieldErrors.municipio}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      label: STEP_LABELS[1],
      title: 'Cuéntanos tu perfil',
      subtitle: 'Con tu cargo asignamos automáticamente la lista de chequeo que debes firmar.',
      content: (
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="trabaja-cargo">
              Cargo al que aspiras <span className="req">*</span>
            </label>
            <select
              className="form-select"
              id="trabaja-cargo"
              name="cargo"
              value={cargo}
              onChange={(event) => handleCargoChange(event.target.value)}
              required
              aria-invalid={!!fieldErrors.cargo}
              aria-describedby={fieldErrors.cargo ? 'trabaja-cargo-error' : undefined}
            >
              <option value="">Selecciona un cargo...</option>
              {CARGO_GRUPOS.map((grupo) => (
                <optgroup key={grupo.label} label={grupo.label}>
                  {grupo.cargos.map((cargoNombre) => (
                    <option key={cargoNombre} value={cargoNombre}>
                      {cargoNombre}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {fieldErrors.cargo && (
              <span id="trabaja-cargo-error" className="form-field-error">
                {fieldErrors.cargo}
              </span>
            )}
            <span className="guided-field-hint">
              En el siguiente paso verás la lista asignada automáticamente a este cargo.
            </span>
          </div>

          <div className="form-field">
            <label htmlFor="trabaja-formacion">Nivel de formación</label>
            <select
              className="form-select"
              id="trabaja-formacion"
              name="formacion"
              value={datos.formacion}
              onChange={(event) => updateDato('formacion', event.target.value)}
              aria-invalid={!!fieldErrors.formacion}
              aria-describedby={fieldErrors.formacion ? 'trabaja-formacion-error' : undefined}
            >
              <option value="">Selecciona un nivel...</option>
              {FORMACION_OPCIONES.map((formacion) => (
                <option key={formacion} value={formacion}>
                  {formacion}
                </option>
              ))}
            </select>
            {fieldErrors.formacion && (
              <span id="trabaja-formacion-error" className="form-field-error">
                {fieldErrors.formacion}
              </span>
            )}
          </div>

          <div className="form-field full">
            <label htmlFor="trabaja-experiencia">Experiencia laboral</label>
            <textarea
              className="form-textarea"
              id="trabaja-experiencia"
              name="experiencia"
              placeholder="Describe brevemente tu experiencia relacionada con el cargo..."
              value={datos.experiencia}
              onChange={(event) => updateDato('experiencia', event.target.value)}
              maxLength={2000}
              aria-invalid={!!fieldErrors.experiencia}
              aria-describedby={fieldErrors.experiencia ? 'trabaja-experiencia-error' : undefined}
            />
            {fieldErrors.experiencia && (
              <span id="trabaja-experiencia-error" className="form-field-error">
                {fieldErrors.experiencia}
              </span>
            )}
            <span className="guided-field-hint">Opcional. Puedes ampliarla luego en una entrevista.</span>
          </div>
        </div>
      ),
    },
    {
      label: STEP_LABELS[2],
      title: 'Documentos obligatorios',
      subtitle: 'Descarga, firma y adjunta la lista de chequeo, y sube tu hoja de vida.',
      content: (
        <>
          <div className={`trabaja-doc${fieldErrors.checklist ? ' invalid' : ''}`}>
            <div className="trabaja-doc-head">
              <div>
                <strong>Lista de chequeo firmada</strong>
                <span>{checklistHint}</span>
              </div>
              <span className="trabaja-doc-badge">Obligatoria</span>
            </div>

            <div className="trabaja-doc-actions">
              <a className="btn btn-primary trabaja-download" href={checklist.href} download>
                <Icon name="download" size={16} />
                Descargar lista
              </a>
              <div className="trabaja-select-wrap">
                <span className="trabaja-mini-label">Lista que vas a firmar</span>
                <div className="trabaja-readonly" aria-live="polite">
                  <Icon name="check" size={15} />
                  <span>{checklist.label}</span>
                </div>
              </div>
            </div>

            <p className="trabaja-note">
              Descarga el PDF, fírmalo y súbelo aquí. Aceptamos PDF, JPG o PNG.
            </p>

            <div
              className={`trabaja-file${files.checklist ? ' has-file' : ''}${fieldErrors.checklist ? ' invalid' : ''}`}
            >
              <span className="trabaja-file-icon">{fileBadge(files.checklist, 'checklist')}</span>
              <div className="trabaja-file-info">
                <strong>{files.checklist?.name || 'Sin archivo'}</strong>
                <span>
                  {files.checklist
                    ? `${formatBytes(files.checklist.size)} · Documento firmado`
                    : 'PDF, JPG o PNG · máx. 20 MB'}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-ghost trabaja-file-pick"
                onClick={() => checklistInputRef.current?.click()}
              >
                <Icon name="upload" size={15} />
                Elegir
              </button>
              <input
                ref={checklistInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                hidden
                onChange={(event) => handleFileInput('checklist', event)}
              />
              {files.checklist && (
                <button
                  type="button"
                  className="trabaja-file-remove"
                  onClick={() => removeFile('checklist')}
                >
                  <Icon name="x" size={14} />
                  Quitar
                </button>
              )}
            </div>
            {fieldErrors.checklist && (
              <span className="form-field-error">{fieldErrors.checklist}</span>
            )}
          </div>

          <div className={`trabaja-doc${fieldErrors.cv ? ' invalid' : ''}`}>
            <div className="trabaja-doc-head">
              <div>
                <strong>Hoja de vida</strong>
                <span>Adjunta tu currículum en PDF, con la información más reciente.</span>
              </div>
              <span className="trabaja-doc-badge">Obligatoria</span>
            </div>

            <div
              className={`trabaja-file${files.cv ? ' has-file' : ''}${fieldErrors.cv ? ' invalid' : ''}`}
            >
              <span className="trabaja-file-icon">{fileBadge(files.cv, 'cv')}</span>
              <div className="trabaja-file-info">
                <strong>{files.cv?.name || 'Sin archivo'}</strong>
                <span>
                  {files.cv ? `${formatBytes(files.cv.size)} · PDF` : 'PDF · máx. 20 MB'}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-ghost trabaja-file-pick"
                onClick={() => cvInputRef.current?.click()}
              >
                <Icon name="upload" size={15} />
                Elegir
              </button>
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf"
                hidden
                onChange={(event) => handleFileInput('cv', event)}
              />
              {files.cv && (
                <button
                  type="button"
                  className="trabaja-file-remove"
                  onClick={() => removeFile('cv')}
                >
                  <Icon name="x" size={14} />
                  Quitar
                </button>
              )}
            </div>
            {fieldErrors.cv && <span className="form-field-error">{fieldErrors.cv}</span>}
          </div>
        </>
      ),
    },
    {
      label: STEP_LABELS[3],
      title: 'Revisa y envía',
      subtitle: 'Verifica que tus datos y documentos estén correctos antes de enviar.',
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
              <ReviewRow label="Municipio" value={datos.municipio.trim()} />
            </div>

            <div className="guided-review-group">
              <div className="guided-review-head">
                <span>Tu perfil</span>
                <button type="button" className="guided-edit" onClick={() => editStep(2)}>
                  Editar
                </button>
              </div>
              <ReviewRow label="Cargo" value={cargo} />
              <ReviewRow label="Formación" value={datos.formacion} />
              <ReviewRow label="Experiencia" value={datos.experiencia.trim()} />
            </div>

            <div className="guided-review-group">
              <div className="guided-review-head">
                <span>Documentos</span>
                <button type="button" className="guided-edit" onClick={() => editStep(3)}>
                  Editar
                </button>
              </div>
              <ReviewRow label="Hoja de vida" value={files.cv?.name} />
              <ReviewRow label="Lista de chequeo" value={checklist.label} />
              <ReviewRow label="Archivo firmado" value={files.checklist?.name} />
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
              Autorizo de manera previa, expresa e informada el tratamiento de mis datos
              personales a <strong>IPS VITAHER S.A.S. ZOMAC</strong>, conforme a su{' '}
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
          <Reveal as="aside" className="trabaja-perfiles" aria-labelledby="trabaja-perfiles-title">
            <span className="section-label">Perfiles que buscamos</span>
            <h3 id="trabaja-perfiles-title">
              Si tu perfil está en la lista, te invitamos a postularte:
            </h3>
            <ul className="trabaja-perfiles-list">
              {PERFILES.map((perfil) => (
                <li key={perfil}>
                  <Icon name="check" size={14} />
                  <span>{perfil}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={140} className="trabaja-form-wrap">
            <GuidedForm
              id="trabaja-form"
              className="trabaja-form"
              title="Postúlate a VITAHER"
              titleId="trabaja-form-title"
              subtitle="Completa los cuatro pasos y adjunta tus documentos."
              steps={steps}
              step={step}
              onNext={nextStep}
              onPrev={prevStep}
              onSubmit={handleSubmit}
              submitLabel="Enviar postulación"
              isSubmitting={isSubmitting}
              error={formError}
              formRef={formRef}
              headExtra={
                <div className="trabaja-reqs" aria-label="Documentos requeridos">
                  <span className={`trabaja-req${files.cv ? ' done' : ''}`}>
                    <span className="trabaja-req-dot" />
                    Hoja de vida en PDF
                  </span>
                  <span className={`trabaja-req${files.checklist ? ' done' : ''}`}>
                    <span className="trabaja-req-dot" />
                    Lista de chequeo firmada
                  </span>
                </div>
              }
            />
            <div className="radicado-consulta">
              <span>¿Ya enviaste tu postulación?</span>
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
