import { useEffect, useState } from 'react'
import { Icon } from './Icons.jsx'
import './AccessibilityFloat.css'

const STORAGE_KEY = 'vitaher-a11y'

function applyPrefs(prefs) {
  const html = document.documentElement
  html.style.fontSize = prefs.largeText ? '112.5%' : ''
  html.classList.toggle('a11y-high-contrast', !!prefs.highContrast)
  html.classList.toggle('a11y-underline-links', !!prefs.underlineLinks)
  html.classList.toggle('a11y-reduced-motion', !!prefs.reducedMotion)
}

export default function AccessibilityFloat() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    applyPrefs(prefs)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {}
  }, [prefs])

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))
  const reset = () => setPrefs({})

  return (
    <>
      <button
        className="a11y-float"
        type="button"
        aria-label={open ? 'Cerrar menú de accesibilidad' : 'Abrir menú de accesibilidad'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="accessibility" size={24} />
      </button>

      {open && (
        <div className="a11y-panel" role="dialog" aria-label="Opciones de accesibilidad" aria-modal="false">
          <div className="a11y-panel-header">
            <strong>Accesibilidad</strong>
            <button type="button" className="a11y-close" onClick={() => setOpen(false)} aria-label="Cerrar">
              <Icon name="x" size={18} />
            </button>
          </div>

          <div className="a11y-options">
            <button type="button" className={`a11y-option ${prefs.largeText ? 'is-active' : ''}`} onClick={() => toggle('largeText')}>
              <span>A+</span> Texto grande
            </button>
            <button type="button" className={`a11y-option ${prefs.highContrast ? 'is-active' : ''}`} onClick={() => toggle('highContrast')}>
              <span>◐</span> Alto contraste
            </button>
            <button type="button" className={`a11y-option ${prefs.underlineLinks ? 'is-active' : ''}`} onClick={() => toggle('underlineLinks')}>
              <span>U</span> Subrayar enlaces
            </button>
            <button type="button" className={`a11y-option ${prefs.reducedMotion ? 'is-active' : ''}`} onClick={() => toggle('reducedMotion')}>
              <span>◎</span> Pausar animaciones
            </button>
          </div>

          <button type="button" className="a11y-reset" onClick={reset}>
            Restablecer
          </button>
          <p className="a11y-note">Ajustes guardados en este navegador. Ley 1581.</p>
        </div>
      )}
    </>
  )
}
