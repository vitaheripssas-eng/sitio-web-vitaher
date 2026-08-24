import { useEffect, useRef, useState } from 'react'
import { EMAIL } from '../data.js'
import { waLink } from '../utils.js'
import { Icon } from './Icons.jsx'
import './WhatsAppPreview.css'

export default function WhatsAppPreview({ title, message, msg, mailSubject, onClose, onSent }) {
  const [text, setText] = useState(msg)
  const taRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    taRef.current?.focus()
  }, [])

  function send() {
    window.open(waLink(text.trim()), '_blank', 'noopener,noreferrer')
    onSent?.()
    onClose()
  }

  return (
    <div className="wap-overlay" onClick={onClose}>
      <div
        className="wap-card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="wap-header">
          <span className="wap-header-icon">
            <Icon name="whatsapp" size={22} />
          </span>
          <div>
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
          <button className="wap-close" type="button" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={20} />
          </button>
        </header>

        <div className="wap-body">
          <label className="wap-label" htmlFor="wap-textarea">
            Mensaje a enviar por WhatsApp
          </label>
          <textarea
            id="wap-textarea"
            className="wap-textarea"
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="wap-hint">Puedes editar el mensaje antes de enviarlo.</p>
        </div>

        <footer className="wap-footer">
          <button className="btn btn-whatsapp" type="button" onClick={send}>
            <Icon name="whatsapp" size={18} />
            Enviar por WhatsApp
          </button>
          {mailSubject && (
            <a
              className="btn btn-ghost"
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(text)}`}
              target="_blank"
              rel="noreferrer"
            >
              Enviar por correo
            </a>
          )}
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Cancelar
          </button>
        </footer>
      </div>
    </div>
  )
}