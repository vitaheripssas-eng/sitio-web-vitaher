import FormSuccess from './FormSuccess.jsx'
import { Icon } from './Icons.jsx'

export default function ExitoServidor({ onClose }) {
  return (
    <div className="wap-overlay" onClick={onClose}>
      <div className="wap-card" role="status" onClick={(e) => e.stopPropagation()}>
        <header className="wap-header">
          <span className="wap-header-icon">
            <Icon name="checkCircle" size={22} />
          </span>
          <div>
            <h3>Solicitud enviada</h3>
            <p>Gracias por escribirnos.</p>
          </div>
          <button className="wap-close" type="button" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={20} />
          </button>
        </header>
        <div className="wap-body">
          <FormSuccess
            title="¡Recibimos tu solicitud!"
            message="Llegó correctamente con los archivos adjuntos. Nuestro equipo te responderá pronto."
          />
        </div>
        <footer className="wap-footer">
          <button className="btn btn-whatsapp" type="button" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  )
}
