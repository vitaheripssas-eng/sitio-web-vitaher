import {
  WHATSAPP_NUMBER,
  FORM_ENDPOINT,
  REGISTRO_ENDPOINT,
  TRACKING_ENDPOINT,
} from './data.js'

export const FIELD_ERROR_SUMMARY = 'Revisa los campos marcados.'

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
  return data
}

export async function registrarRadicado(payload) {
  const res = await fetch(REGISTRO_ENDPOINT, { method: 'POST', body: payload })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok || !data?.radicado) {
    throw new Error(data?.error ?? 'No fue posible registrar el radicado')
  }
  return data
}

export async function consultarRadicado(radicado) {
  const url = `${TRACKING_ENDPOINT}?action=track&radicado=${encodeURIComponent(radicado)}`
  const res = await fetch(url)
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok || !data?.registro) {
    throw new Error(data?.error ?? 'No encontramos un radicado con ese número.')
  }
  return data.registro
}

export function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function formatFechaHora(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
}
