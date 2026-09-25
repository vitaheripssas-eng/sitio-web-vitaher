import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Cloudflare Pages con dominio propio vitaherips.com → siempre raíz
  build: {
    cssMinify: false,
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
