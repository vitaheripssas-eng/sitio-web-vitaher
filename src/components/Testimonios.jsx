import { TESTIMONIOS } from '../data.js'
import Reveal from './Reveal.jsx'
import './Testimonios.css'

export default function Testimonios() {
  return (
    <section className="section testimonios" id="testimonios" aria-label="Testimonios">
      <div className="container">
        <div className="section-head">
          <span className="section-label">Testimonios</span>
          <h2>Lo que dicen nuestras familias</h2>
        </div>
        <div className="testimonios-grid">
          {TESTIMONIOS.map((t, i) => (
            <Reveal as="article" className="testimonio" delay={i * 100} key={t.nombre}>
              <p className="testimonio-texto">“{t.texto}”</p>
              <span className="testimonio-nombre">{t.nombre}</span>
              <span className="testimonio-servicio">{t.servicio}</span>
            </Reveal>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: TESTIMONIOS.map((t, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: { '@type': 'Review', author: { '@type': 'Person', name: t.nombre }, reviewBody: t.texto },
            })),
          }),
        }}
      />
    </section>
  )
}
