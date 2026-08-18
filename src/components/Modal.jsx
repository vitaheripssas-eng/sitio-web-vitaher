import { useEffect } from 'react'
import { Icon } from './Icons.jsx'
import './Modal.css'

export default function Modal({ doc, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={doc.title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <span className="modal-kicker">Documento institucional</span>
            <h2>{doc.title}</h2>
            <p className="modal-updated">Última actualización: {doc.updated}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar documento">
            <Icon name="x" size={22} />
          </button>
        </header>

        <div className="modal-body">
          <p className="modal-intro">{doc.intro}</p>

          {doc.sections.map((section) => (
            <section className="modal-section" key={section.h}>
              <h3>{section.h}</h3>
              {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <p className="modal-footnote">
            Para consultas sobre este documento, contáctanos por PQRS o al correo{' '}
            <a href="mailto:info@ipsvitaher.com">info@ipsvitaher.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}