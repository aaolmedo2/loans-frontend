import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/api/prestamos-frontend/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // o tu URL pública
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});

