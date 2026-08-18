import { VALORES, ELIGENOS } from '../data.js'
import { Icon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Nosotros.css'

export default function Nosotros() {
  return (
    <section className="section nosotros" id="nosotros">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="section-label">Nosotros</span>
            <h2>Una IPS comprometida con su bienestar</h2>
            <p>
              En IPS VITAHER S.A.S. ZOMAC entendemos que cada paciente es único y merece una
              atención integral, segura y con calidad humana.
            </p>
          </div>
        </Reveal>

        <div className="nosotros-grid">
          <Reveal as="div" className="card-mv">
            <span className="card-tag">Misión</span>
            <p>
              Proveer soluciones integrales de salud domiciliaria y gestión farmacéutica
              especializada, fundamentadas en estándares superiores de calidad, seguridad y
              humanización. En VITAHER IPS S.A.S. optimizamos la recuperación del paciente mediante
              un modelo de atención interdisciplinario y una logística de suministros de alta
              respuesta, orientados a la mitigación de riesgos clínicos, la reducción de
              hospitalizaciones evitables y el bienestar sostenible del usuario y su entorno
              familiar.
            </p>
          </Reveal>
          <Reveal as="div" className="card-mv" delay={140}>
            <span className="card-tag">Visión</span>
            <p>
              Para el año 2029, consolidarnos como la IPS referente en el departamento de Arauca en
              servicios de salud domiciliaria y gestión farmacéutica integral. Seremos reconocidos
              por la implementación de un modelo asistencial de alta capacidad resolutiva,
              apalancado en la transformación digital y la excelencia operativa, garantizando
              niveles superiores de seguridad del paciente y sostenibilidad, impactando
              positivamente en los indicadores de salud de nuestra comunidad.
            </p>
          </Reveal>
        </div>

        <div className="valores-grid">
          {VALORES.map((valor, i) => (
            <Reveal as="div" className="valor" delay={i * 110} key={valor.num}>
              <span className="num">{valor.num}</span>
              <h3>{valor.title}</h3>
              <p>{valor.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="porque">
            <div>
              <span className="section-label">Por qué elegirnos</span>
              <h2>Confianza, tranquilidad y bienestar</h2>
              <p className="porque-note">
                "Un equipo interdisciplinario altamente capacitado, procesos basados en estándares
                de calidad y un firme compromiso con la mejora continua."
              </p>
            </div>
            <div className="porque-badges">
              {ELIGENOS.map((item) => (
                <span className="badge" key={item}>
                  <Icon name="checkCircle" size={18} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}