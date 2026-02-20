import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ultra-simple config for Railway
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: '/app/index.html' // Absolute path for Railway
    }
  },
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  }
})