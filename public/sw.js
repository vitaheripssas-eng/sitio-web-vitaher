// Service Worker — VITAHER IPS S.A.S.
// Estrategia: network-first para HTML (siempre versión fresca), cache-first para assets

const CACHE_VERSION = 'vitaher-v1'

// ── Instalación: activar inmediatamente sin esperar ──────────────────────────
self.addEventListener('install', () => {
  self.skipWaiting()
})

// ── Activación: limpiar cachés viejos y tomar control de todos los tabs ──────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
      )
      .then(() => clients.claim()) // toma control inmediato de todos los tabs abiertos
  )
})

// ── Interceptar peticiones ───────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event

  // Solo manejar peticiones HTTP/HTTPS
  if (!request.url.startsWith('http')) return

  // NAVEGACIÓN (HTML) → siempre red primero: garantiza versión actualizada
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(() =>
        caches.match(request)
      )
    )
    return
  }

  // ASSETS (JS, CSS, imágenes) → caché primero, luego red
  // Vite genera nombres únicos por versión (hash), así que el caché es seguro
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).then(response => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_VERSION).then(c => c.put(request, clone))
        }
        return response
      })
    })
  )
})
