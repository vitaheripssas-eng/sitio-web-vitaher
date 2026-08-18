import { WHATSAPP_NUMBER } from './data.js'

export function waLink(message) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}