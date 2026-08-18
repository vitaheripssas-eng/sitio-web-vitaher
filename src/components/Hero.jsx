import { useEffect, useRef, useState } from 'react'
import { STATS } from '../data.js'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Hero.css'

function CountStat({ value }) {
  const ref = useRef(null)
  const isNum = /^\d+$/.test(value)
  const [n, setN] = useState(() =>
    isNum && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? parseInt(value, 10)
      : 0,
  )

  useEffect(() => {
    const el = ref.current
    if (!el || !isNum) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        const target = parseInt(value, 10)
        const duration = 1400
        const start = performance.now()
        const tick = (t) => {
          const p = Math.min((t - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setN(Math.round(target * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, isNum])

  return <strong ref={ref}>{isNum ? n : value}</strong>
}

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <Reveal delay={0}>
              <span className="hero-badge">Salud domiciliaria · Arauca, Colombia</span>
            </Reveal>
            <Reveal delay={120}>
              <h1>
                Llevamos la atención médica hasta la comodidad de{' '}
                <span className="hero-highlight">su hogar</span>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="hero-text">
                En IPS VITAHER S.A.S. ZOMAC optimizamos la recuperación del paciente con un modelo
                interdisciplinario y logística de suministros de alta respuesta.{' '}
                <em>Cuidamos con calidad, servimos con el corazón.</em>
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#contacto">
                  Agendar Cita
                  <Icon name="plus" size={18} />
                </a>
                <a className="btn btn-ghost" href="#servicios">
                  Ver servicios
                  <Icon name="arrowDown" size={18} />
                </a>
              </div>
            </Reveal>
          </div>

          <div className="hero-card-wrap">
            <span className="hero-card-wrap-bg" aria-hidden="true" />
            <Reveal delay={200}>
              <div className="hero-card hero-anim">
                <div className="hero-card-icon">
                  <Icon name="heartPulse" size={34} />
                </div>
                <h3>Atención integral en casa</h3>
                <p>
                  Médicos, enfermeras y especialistas que visitan su hogar para garantizar una
                  recuperación segura y cercana.
                </p>
                <ul className="hero-card-list">
                  <li>
                    <Icon name="check" size={16} /> Equipo interdisciplinario calificado
                  </li>
                  <li>
                    <Icon name="check" size={16} /> Logística de suministros de alta respuesta
                  </li>
                  <li>
                    <Icon name="check" size={16} /> Seguimiento continuo del paciente
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={150}>
          <div className="hero-stats">
            {STATS.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <CountStat value={stat.value} label={stat.label} />
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}