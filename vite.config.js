import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('react')) return 'vendor'
          if (id.includes('react-dom')) return 'vendor'
          if (id.includes('react-router-dom')) return 'vendor'

          if (id.includes('axios')) return 'axios'
          if (id.includes('socket.io-client')) return 'socket'

          return 'vendor'
        }
      }
    }
  },

  server: {
    port: 5173,
  },
})