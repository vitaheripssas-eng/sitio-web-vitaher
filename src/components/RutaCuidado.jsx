import { CUIDADO_STEPS } from '../data.js'
import Reveal from './Reveal.jsx'
import './RutaCuidado.css'

export default function RutaCuidado() {
  return (
    <section className="section ruta" aria-label="Ruta de un cuidado domiciliario">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="section-label">Proceso</span>
            <h2>Ruta de un cuidado domiciliario</h2>
            <p>
              Acompañamos al paciente en cada etapa de su recuperación, desde la valoración inicial
              hasta el bienestar sostenible en su hogar.
            </p>
          </div>
        </Reveal>

        <ol className="ruta-list">
          {CUIDADO_STEPS.map((step, i) => (
            <Reveal as="li" className="ruta-step" delay={i * 120} key={step.title}>
              <span className="ruta-num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {i < CUIDADO_STEPS.length - 1 && <span className="ruta-arrow" aria-hidden="true" />}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}