import { useEffect, useState, useRef } from 'react'
import { Icon } from './Icons.jsx'
import './AccessibilityFloat.css'

const STORAGE_KEY = 'vitaher-a11y'
const POS_KEY = 'vitaher-a11y-pos'

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
  const [pos, setPos] = useState(() => {
    try {
      const raw = localStorage.getItem(POS_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0, moved: false })
  const btnRef = useRef(null)

  useEffect(() => {
    applyPrefs(prefs)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {}
  }, [prefs])

  useEffect(() => {
    if (pos) {
      try {
        localStorage.setItem(POS_KEY, JSON.stringify(pos))
      } catch {}
    }
  }, [pos])

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))
  const reset = () => setPrefs({})

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
      // evitar abrir panel si se arrastró
      return
    }
    setOpen((v) => !v)
  }

  const btnStyle = pos ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } : undefined
  const panelStyle = pos
    ? {
        left: Math.min(pos.x, window.innerWidth - 296),
        top: pos.y > 120 ? pos.y - 260 : pos.y + 64,
        right: 'auto',
        bottom: 'auto',
      }
    : undefined

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
        <Icon name="accessibility" size={24} />
      </button>

      {open && (
        <div className="a11y-panel" role="dialog" aria-label="Opciones de accesibilidad" aria-modal="false" style={panelStyle}>
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
          <p className="a11y-note">Arrastra el botón para moverlo. Ajustes guardados. Ley 1581.</p>
        </div>
      )}
    </>
  )
}
