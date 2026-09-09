import { WHATSAPP_NUMBER } from '../data.js'
import { waLink } from '../utils.js'
import { Icon } from './Icons.jsx'
import './WhatsAppFloat.css'

export default function WhatsAppFloat() {
  const href = waLink('Hola, me comunico desde el sitio web de VITAHER IPS S.A.S.')

  const onClick = () => {
    window.gtag?.('event', 'click_whatsapp_float', { method: 'whatsapp' })
  }

  return (
    <a
      className="wa-float"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir WhatsApp de VITAHER"
      onClick={onClick}
    >
      <Icon name="whatsapp" size={26} />
    </a>
  )
}
