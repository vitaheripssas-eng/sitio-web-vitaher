import { WHATSAPP_NUMBER, FORM_ENDPOINT } from './data.js'

export function waLink(message) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export async function enviarConArchivo(payload) {
  const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: payload })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? 'No fue posible enviar el formulario')
  }
}