import { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons'
import { Icon } from './Icons.jsx'
import './AccessibilityFloat.css'

const STORAGE_KEY = 'vitaher-a11y'

function applyPrefs(prefs) {
  const html = document.documentElement
  html.style.fontSize = prefs.largeText ? '112.5%' : ''
  html.classList.toggle('dark-theme', !!prefs.darkMode)
  html.classList.toggle('a11y-high-contrast', !!prefs.highContrast)
  html.classList.toggle('a11y-invert-colors', !!prefs.invertColors)
  html.classList.toggle('a11y-underline-links', !!prefs.underlineLinks)
  html.classList.toggle('a11y-reduced-motion', !!prefs.reducedMotion)
  html.classList.toggle('a11y-subtitles', !!prefs.subtitles)
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
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [pos, setPos] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [showHint, setShowHint] = useState(() => {
    try {
      return !sessionStorage.getItem('vitaher-a11y-hint-dismissed')
    } catch {
      return true
    }
  })
  const dragRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0, moved: false })
  const btnRef = useRef(null)

  // Desvanecer el aviso automáticamente después de 9 segundos
  useEffect(() => {
    if (!showHint) return
    const timer = setTimeout(() => {
      setShowHint(false)
    }, 9000)
    return () => clearTimeout(timer)
  }, [showHint])

  const dismissHint = (e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    setShowHint(false)
    try {
      sessionStorage.setItem('vitaher-a11y-hint-dismissed', 'true')
    } catch {}
  }

  useEffect(() => {
    applyPrefs(prefs)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {}
  }, [prefs])

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))
  const reset = () => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    setPrefs({})
  }

  const handlePointerDown = (e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.left,
      origY: rect.top,
      moved: false,
    }
    setDragging(true)
    btn.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!dragging) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
    const newX = dragRef.current.origX + dx
    const newY = dragRef.current.origY + dy
    const maxX = window.innerWidth - 56
    const maxY = window.innerHeight - 56
    setPos({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    })
  }

  const handlePointerUp = (e) => {
    const btn = btnRef.current
    if (btn) btn.releasePointerCapture(e.pointerId)
    const wasMoved = dragRef.current.moved
    setDragging(false)
    if (showHint) dismissHint()
    if (wasMoved) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    setOpen((v) => !v)
  }

  const speakPage = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    setIsSpeaking(true)
    const text = document.querySelector('main')?.innerText?.slice(0, 4000) || document.body.innerText.slice(0, 4000)
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'es-CO'
    utter.rate = 0.9
    utter.onend = () => setIsSpeaking(false)
    utter.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utter)
  }

  const btnStyle = pos ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } : undefined
  const panelStyle = pos
    ? {
        left: Math.min(pos.x, window.innerWidth - 296),
        ...(pos.y > 140
          ? { bottom: Math.min(window.innerHeight - pos.y + 8, window.innerHeight - 100), top: 'auto', right: 'auto' }
          : { top: pos.y + 64, bottom: 'auto', right: 'auto' }),
      }
    : undefined

  const hintStyle = pos
    ? {
        left: pos.x > window.innerWidth / 2 ? 'auto' : pos.x + 64,
        right: pos.x > window.innerWidth / 2 ? Math.max(12, window.innerWidth - pos.x + 8) : 'auto',
        top: Math.max(12, Math.min(pos.y, window.innerHeight - 80)),
        bottom: 'auto',
      }
    : undefined

  const options = [
    { key: 'darkMode', icon: <Icon name={prefs.darkMode ? 'sun' : 'moon'} size={16} />, label: prefs.darkMode ? 'Modo claro' : 'Modo oscuro', active: prefs.darkMode },
    { key: 'speak', icon: isSpeaking ? '⏹' : '🔊', label: isSpeaking ? 'Detener' : 'Leer esta página en voz', active: isSpeaking },
    { key: 'largeText', icon: 'A+', label: 'Texto grande', active: prefs.largeText },
    { key: 'highContrast', icon: '◐', label: 'Alto contraste', active: prefs.highContrast },
    { key: 'invertColors', icon: '◑', label: 'Invertir colores', active: prefs.invertColors },
    { key: 'underlineLinks', icon: 'U', label: 'Subrayar enlaces', active: prefs.underlineLinks },
    { key: 'reducedMotion', icon: '◎', label: 'Pausar animaciones', active: prefs.reducedMotion },
    { key: 'subtitles', icon: 'CC', label: 'Subtítulos visibles', active: prefs.subtitles },
  ]

  return (
    <>
      <button
        ref={btnRef}
        className={`a11y-float ${dragging ? 'dragging' : ''}`}
        type="button"
        aria-label={open ? 'Cerrar menú de accesibilidad' : 'Abrir menú de accesibilidad (arrastrable)'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={btnStyle}
      >
        <FontAwesomeIcon icon={faUniversalAccess} style={{ fontSize: '44px', width: '44px', height: '44px' }} />
      </button>

      {/* Cartelito amigable en primera persona (Estilo 4) */}
      {showHint && !open && !dragging && (
        <div
          className="a11y-hint"
          style={hintStyle}
          role="status"
          aria-live="polite"
          onClick={() => {
            setOpen(true)
            dismissHint()
          }}
        >
          <div className="a11y-hint-content">
            <strong>👋 ¡Hola! Soy tu asistente de lectura:</strong>
            <p>Ábreme para cambiar opciones o muéveme si te estorbo.</p>
          </div>
          <button
            type="button"
            className="a11y-hint-close"
            aria-label="Cerrar aviso"
            onClick={dismissHint}
          >
            <Icon name="x" size={13} />
          </button>
        </div>
      )}

      {open && (
        <div
          className="a11y-panel a11y-panel--compact"
          role="dialog"
          aria-label="Opciones de accesibilidad"
          aria-modal="false"
          style={panelStyle}
        >
          <div className="a11y-header">
            <FontAwesomeIcon icon={faUniversalAccess} className="a11y-header-icon" />
            <div className="a11y-header-text">
              <strong>Accesibilidad</strong>
              <p>Personaliza tu experiencia</p>
            </div>
          </div>

          <div className="a11y-options">
            {options.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`a11y-option ${opt.active ? 'is-active' : ''}`}
                onClick={opt.key === 'speak' ? speakPage : () => toggle(opt.key)}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>

          <button type="button" className="a11y-reset" onClick={reset}>Restablecer todo</button>
        </div>
      )}
    </>
  )
}
