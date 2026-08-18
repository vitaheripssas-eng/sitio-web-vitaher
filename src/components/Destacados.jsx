import { useCallback, useEffect, useRef, useState } from 'react'
import { DESTACADOS } from '../data.js'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Destacados.css'

const AUTOPLAY_MS = 6500

export default function Destacados() {
  const [index, setIndex] = useState(0)
  const paused = useRef(false)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % DESTACADOS.length)
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + DESTACADOS.length) % DESTACADOS.length)
  }, [])

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      if (!paused.current) next()
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [next, reduced])

  return (
    <section className="section destacados" aria-label="Servicios destacados">
      <div className="container">
        <Reveal delay={120}>
          <div
            className="destacados-carousel"
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
            onFocus={() => (paused.current = true)}
            onBlur={() => (paused.current = false)}
          >
            <div
              className="destacados-track"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {DESTACADOS.map((slide, i) => (
                <article
                  className="destacado"
                  key={slide.title}
                  aria-hidden={i !== index}
                  tabIndex={i === index ? 0 : -1}
                >
                  <div className="destacado-copy">
                    <h3>{slide.title}</h3>
                    <p>{slide.text}</p>
                    <ul>
                      {slide.items.map((item) => (
                        <li key={item}>
                          <Icon name="check" size={16} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a className="btn btn-primary" href={slide.cta.href}>
                      {slide.cta.label}
                      <Icon name="arrowDown" size={18} />
                    </a>
                  </div>
                  <img
                    className="destacado-img"
                    src={slide.img}
                    alt={slide.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </article>
              ))}
            </div>

            <button
              className="destacados-arrow destacados-prev"
              type="button"
              onClick={prev}
              aria-label="Anterior"
            >
              <Icon name="chevronLeft" size={22} />
            </button>
            <button
              className="destacados-arrow destacados-next"
              type="button"
              onClick={next}
              aria-label="Siguiente"
            >
              <Icon name="chevronRight" size={22} />
            </button>

            <div className="destacados-dots" role="tablist" aria-label="Seleccionar servicio">
              {DESTACADOS.map((slide, i) => (
                <button
                  className={`destacados-dot${i === index ? ' is-active' : ''}`}
                  type="button"
                  key={slide.title}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir a ${slide.title}`}
                  aria-selected={i === index}
                  role="tab"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}