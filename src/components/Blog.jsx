import { BLOG_POSTS } from '../data.js'
import Reveal from './Reveal.jsx'
import './Blog.css'

export default function Blog() {
  return (
    <section className="section blog" id="blog" aria-label="Blog">
      <div className="container">
        <div className="section-head">
          <span className="section-label">Blog</span>
          <h2>Noticias y consejos de salud</h2>
          <p>Artículos breves para cuidarte en casa. Próximamente con contenido completo.</p>
        </div>
        <div className="blog-grid">
          {BLOG_POSTS.map((post, i) => (
            <Reveal as="article" className="blog-card" delay={i * 80} key={post.slug}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span className="blog-date">{post.date}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
