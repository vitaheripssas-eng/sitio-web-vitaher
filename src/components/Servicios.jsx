import { SERVICIOS, CRONICOS, AGUDO } from '../data.js'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Servicios.css'

export default function Servicios() {
  return (
    <section className="section servicios" id="servicios">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="section-label">Servicios</span>
            <h2>Atención integral en salud, humanizada, segura y de calidad</h2>
            <p>
              Brindamos atención domiciliaria y ambulatoria a pacientes de todas las edades, con un
              equipo interdisciplinario enfocado en mejorar la calidad de vida de cada usuario.{' '}
              <em>"Cuidamos con calidad, servimos con el corazón."</em>
            </p>
          </div>
        </Reveal>

        <div className="servicios-grid">
          {SERVICIOS.map((servicio, i) => (
            <Reveal as="article" className="servicio" delay={(i % 3) * 110} key={servicio.title}>
              <div className="servicio-icon">
                <Icon name={servicio.icon} size={26} />
              </div>
              <h3>{servicio.title}</h3>
              <p>{servicio.text}</p>
              <ul>
                {servicio.items.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={14} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="pacientes-grid">
          <Reveal as="div" className="paciente paciente-cronico">
            <h3>Atención integral al paciente crónico</h3>
            <p>
              Seguimiento continuo a pacientes con enfermedades de larga duración, buscando mejorar
              su calidad de vida y prevenir complicaciones.
            </p>
            <div className="paciente-tags">
              {CRONICOS.map((item) => (
                <span className="paciente-tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal as="div" className="paciente paciente-agudo" delay={150}>
            <h3>Atención al paciente agudo</h3>
            <p>
              Seguimiento domiciliario oportuno tras una hospitalización o durante la recuperación
              de una enfermedad aguda.
            </p>
            <div className="paciente-tags">
              {AGUDO.map((item) => (
                <span className="paciente-tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}