import { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons'
import './AccessibilityFloat.css'

const STORAGE_KEY = 'vitaher-a11y'

function applyPrefs(prefs) {
  const html = document.documentElement
  html.style.fontSize = prefs.largeText ? '112.5%' : ''
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
  const dragRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0, moved: false })
  const btnRef = useRef(null)

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
    if (wasMoved) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    setOpen((v) => !v)
  }

  const speakPage = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel()
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
        bottom: Math.min(window.innerHeight - pos.y + 8, window.innerHeight - 200),
        top: 'auto',
        right: 'auto',
      }
    : undefined

  const animStyle = prefs.reducedMotion ? { animation: 'none' } : undefined

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

      {open && (
        <div
          className="a11y-panel a11y-panel--compact"
          role="dialog"
          aria-label="Opciones de accesibilidad"
          aria-modal="false"
          style={{ ...panelStyle, ...animStyle }}
        >
          <div className="a11y-title-box">
            <strong>Accesibilidad</strong>
            <p>Personaliza tu experiencia</p>
          </div>

          <div className="a11y-options">
            <button type="button" className={`a11y-option ${isSpeaking ? 'is-active' : ''}`} onClick={speakPage}>
              <span>{isSpeaking ? '⏹' : '🔊'}</span> {isSpeaking ? 'Detener' : 'Leer esta página en voz'}
            </button>
            <button type="button" className={`a11y-option ${prefs.largeText ? 'is-active' : ''}`} onClick={() => toggle('largeText')}>
              <span>A+</span> Texto grande
            </button>
            <button type="button" className={`a11y-option ${prefs.highContrast ? 'is-active' : ''}`} onClick={() => toggle('highContrast')}>
              <span>◐</span> Alto contraste
            </button>
            <button type="button" className={`a11y-option ${prefs.invertColors ? 'is-active' : ''}`} onClick={() => toggle('invertColors')}>
              <span>◑</span> Invertir colores
            </button>
            <button type="button" className={`a11y-option ${prefs.underlineLinks ? 'is-active' : ''}`} onClick={() => toggle('underlineLinks')}>
              <span>U</span> Subrayar enlaces
            </button>
            <button type="button" className={`a11y-option ${prefs.reducedMotion ? 'is-active' : ''}`} onClick={() => toggle('reducedMotion')}>
              <span>◎</span> Pausar animaciones
            </button>
            <button type="button" className={`a11y-option ${prefs.subtitles ? 'is-active' : ''}`} onClick={() => toggle('subtitles')}>
              <span>CC</span> Subtítulos visibles
            </button>
          </div>

          <button type="button" className="a11y-option" onClick={reset}>
            <span>↺</span> Restablecer
          </button>
        </div>
      )}
    </>
  )
}
