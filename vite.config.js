import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'logo.png', 'tiktok.png'],
      manifest: {
        name: 'VITAHER IPS S.A.S.',
        short_name: 'VITAHER',
        description: 'Salud domiciliaria en Arauca — medicina, enfermería, psicología, nutrición y terapias.',
        theme_color: '#004b87',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/sitio-web-vitaher/',
        scope: '/sitio-web-vitaher/',
        icons: [
          { src: 'logo.png', sizes: '192x192', type: 'image/png' },
          { src: 'logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,pdf}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/maps\.google\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'google-maps', expiration: { maxEntries: 10, maxAgeSeconds: 86400 } },
          },
        ],
      },
    }),
  ],
  base: '/sitio-web-vitaher/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react')) return 'vendor'
          if (id.includes('node_modules/zod')) return 'zod'
        },
      },
    },
  },
})
