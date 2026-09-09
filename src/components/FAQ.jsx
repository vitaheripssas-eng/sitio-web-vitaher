import { FAQ } from '../data.js'
import Reveal from './Reveal.jsx'
import './FAQ.css'

export default function FAQSection() {
  return (
    <section className="section faq" id="faq" aria-label="Preguntas frecuentes">
      <div className="container">
        <div className="section-head">
          <span className="section-label">FAQ</span>
          <h2>Preguntas frecuentes</h2>
        </div>
        <div className="faq-list">
          {FAQ.map((item, i) => (
            <Reveal as="details" className="faq-item" key={item.q} delay={i * 60}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </section>
  )
}
