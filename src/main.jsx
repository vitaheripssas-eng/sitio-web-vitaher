import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Service Worker: solo en producción para evitar caché durante el desarrollo
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + 'sw.js', { updateViaCache: 'none' })
      .then(reg => reg.update()) // revisa actualizaciones del SW en cada carga
      .catch(err => console.warn('SW registro fallido:', err))
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
