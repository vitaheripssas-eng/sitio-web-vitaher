import { useEffect, useRef, useState } from 'react'
import { consultarRadicado, formatFechaHora } from '../utils.js'
import { Icon } from './Icons.jsx'
import './Radicado.css'

const STATUS_CLASS = {
  Recibido: 'recibido',
  'En revisión': 'revision',
  Resuelto: 'resuelto',
  Cerrado: 'cerrado',
}

function statusClass(estado) {
  return STATUS_CLASS[estado] || 'recibido'
}

function tituloPorCategoria(categoria) {
  if (categoria === 'POST') return 'Postulación recibida'
  if (categoria === 'PQRS') return 'PQRS recibida'
  return 'Solicitud recibida'
}

async function copiarTexto(texto) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(texto)
    return
  }
  const area = document.createElement('textarea')
  area.value = texto
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  document.execCommand('copy')
  area.remove()
}

export function RadicadoToast({ radicado, categoria = 'PQRS', onClose, onTrack }) {
  const [copiado, setCopiado] = useState(false)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!radicado) return
    const timer = window.setTimeout(() => onCloseRef.current?.(), 15000)
    return () => window.clearTimeout(timer)
  }, [radicado])

  if (!radicado && !onTrack) return null

  async function copiar() {
    if (!radicado) return
    try {
      await copiarTexto(radicado)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2200)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="radicado-toast" role="status" aria-live="polite">
      <button className="radicado-toast-close" type="button" onClick={onClose} aria-label="Cerrar">
        <Icon name="x" size={18} />
      </button>
      <span className="radicado-toast-timer" aria-hidden="true" />

      <span className="radicado-toast-icon">
        <Icon name="checkCircle" size={24} />
      </span>

      <div className="radicado-toast-body">
        <strong>{tituloPorCategoria(categoria)}</strong>
        {radicado ? (
          <>
            <p>Tu solicitud quedó registrada con este número de radicado:</p>
            <div className="radicado-number">{radicado}</div>
            <p className="radicado-toast-status">
              Estado: <b>En revisión</b> · Talento Humano la revisará.
            </p>
            <div className="radicado-toast-actions">
              <button type="button" className="btn btn-primary" onClick={onTrack}>
                Consultar seguimiento
              </button>
              <button type="button" className="btn btn-ghost" onClick={copiar}>
                {copiado ? '¡Copiado!' : 'Copiar radicado'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p>Tu solicitud fue enviada correctamente. Nuestro equipo la revisará pronto.</p>
            <p className="radicado-toast-status">El radicado se asignará al procesar tu solicitud.</p>
            <div className="radicado-toast-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function SeguimientoModal({ open, initialRadicado = '', onClose }) {
  const [radicado, setRadicado] = useState(initialRadicado)
  const [registro, setRegistro] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 60)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const numero = initialRadicado.trim()
    if (!numero) return
    consultar(numero)
  }, [open, initialRadicado])

  if (!open) return null

  async function consultar(numero) {
    const value = numero.trim()
    if (!value) {
      setError('Escribe tu número de radicado.')
      return
    }
    setLoading(true)
    setError('')
    setRegistro(null)
    try {
      const data = await consultarRadicado(value)
      setRegistro(data)
    } catch (err) {
      setError(err?.message || 'No encontramos un radicado con ese número.')
    } finally {
      setLoading(false)
    }
  }

  function buscar(event) {
    event.preventDefault()
    consultar(radicado)
  }

  const historial =
    registro?.historial?.length > 0
      ? registro.historial
      : registro
        ? [{ estado: registro.estado, fecha: registro.estado_fecha || registro.fecha }]
        : []

  return (
    <div className="radicado-overlay" onClick={onClose}>
      <div
        className="radicado-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="radicado-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="radicado-modal-head">
          <div>
            <h3 id="radicado-title">Consultar radicado</h3>
            <p>Ingresa el número que te entregamos al enviar tu PQRS o postulación.</p>
          </div>
          <button type="button" className="radicado-modal-close" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={20} />
          </button>
        </header>

        <form className="radicado-search" onSubmit={buscar}>
          <label className="radicado-search-label" htmlFor="radicado-input">
            Número de radicado
          </label>
          <div className="radicado-search-row">
            <input
              ref={inputRef}
              id="radicado-input"
              className="form-input"
              type="text"
              value={radicado}
              onChange={(event) => {
                setRadicado(event.target.value.toUpperCase())
                if (error) setError('')
                if (registro) setRegistro(null)
              }}
              placeholder="Ej: PQRS-20261021-0001"
              autoComplete="off"
              spellCheck="false"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Buscando…' : 'Consultar'}
            </button>
          </div>
        </form>

        {error && (
          <p className="form-field-error radicado-error" role="alert">
            {error}
          </p>
        )}

        {registro && (
          <div className="radicado-result">
            <div className="radicado-result-top">
              <div>
                <span className={`radicado-badge ${statusClass(registro.estado)}`}>
                  {registro.estado}
                </span>
                <span className="radicado-result-tipo">{registro.tipo}</span>
              </div>
              <strong>{registro.radicado}</strong>
            </div>

            <p className="radicado-result-meta">
              Radicado el {formatFechaHora(registro.fecha) || '—'}
              {registro.actualizado ? ` · Última actualización: ${formatFechaHora(registro.actualizado)}` : ''}
            </p>

            <div className="radicado-history-wrap">
              <span className="radicado-history-title">Historial de estados</span>
              <ol className="radicado-history">
                {historial.map((item, index) => (
                  <li key={`${item.estado}-${item.fecha}-${index}`}>
                    <span className={`radicado-dot ${statusClass(item.estado)}`} aria-hidden="true" />
                    <div>
                      <strong>{item.estado}</strong>
                      <span>{formatFechaHora(item.fecha) || '—'}</span>
                      {item.respuesta && (
                        <p>
                          <strong>Respuesta de VITAHER:</strong> {item.respuesta}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="radicado-result-hint">
              Guarda este número. Con él puedes consultar el avance de tu solicitud cuando quieras.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
